/* tslint:disable:variable-name */

import * as redis from 'redis';
import config from '../../config';
const Limiter: any = require('ratelimiter');
import {Post, StatusPost} from '../../models';
import {IApplication, IUser, IPost, IStatusPost} from '../../interfaces';
import publishUserStream from '../../core/publish-user-stream';
import populateAll from '../../core/post-populate-all';
import serializePost from '../../core/serialize-post';
import savePostMentions from '../../core/save-post-mentions';
import extractHashtags from '../../core/extract-hashtags';
import registerHashtags from '../../core/register-hashtags';

/**
 * Statusを作成します
 * @param app API利用App
 * @param user API利用ユーザー
 * @param text 本文
 * @param inReplyToPostId 返信先投稿のID
 */
export default function status(
	app: IApplication,
	user: IUser,
	text: string,
	inReplyToPostId: string = null
): Promise<Object> {
	'use strict';

	const limiter = new Limiter({
		id: user.id + 'posts-status',
		duration: 1000 * 60 * 60,
		max: 100,
		db: redis.createClient(config.redis.port, config.redis.host)
	});

	return new Promise<Object>((resolve, reject) => {
		limiter.get((limitErr: any, limit: any) => {
			if (limitErr !== null) {
				return reject('something-happened');
			} else if (limit.remaining === 0) {
				return reject('rate-limit-exceeded');
			}

			const maxTextLength: number = 300;
			text = text.trim();

			if (text.length > maxTextLength) {
				return reject('too-long-text');
			}

			if (inReplyToPostId !== null) {
				// リプライ先に指定されている投稿が実在するかチェック
				Post.findById(inReplyToPostId, (err: any, reply: IPost) => {
					if (err !== null) {
						reject(err);
					} else if (reply === null) {
						reject('reply-source-not-found');
					} else if (reply.isDeleted) {
						reject('reply-source-not-found');
					} else if (reply.type === 'repost') {
						reject('reply-to-repost-is-not-allowed');
					} else {
						create(reply);
					}
				});
			} else {
				create();
			}

			function create(reply: IPost = null): void {
				const hashtags: string[] = extractHashtags(text);
				StatusPost.create({
					type: 'status',
					app: app !== null ? app.id : null,
					user: user.id,
					inReplyToPost: inReplyToPostId,
					text,
					hashtags
				}, (createErr: any, createdStatus: IStatusPost) => {
					if (createErr !== null) {
						reject(createErr);
					} else {
						populateAll(createdStatus).then((populated: Object) => {
							serializePost(populated, user).then((serialized: Object) => {
								resolve(serialized);
							}, (serializeErr: any) => {
								reject(serializeErr);
							});
						}, (populateErr: any) => {
							reject(populateErr);
						});

						user.postsCount++;
						user.save();

						if (reply !== null) {
							reply.repliesCount++;
							reply.save();
						}

						registerHashtags(hashtags);

						savePostMentions(createdStatus, text);

						publishUserStream(user.id, {
							type: 'post',
							value: {
								id: createdStatus.id
							}
						});
					}
				});
			}
		});
	});
}
