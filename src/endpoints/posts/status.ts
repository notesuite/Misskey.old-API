import {Post, StatusPost} from '../../models';
import {IApplication, IUser, IPost, IStatusPost} from '../../interfaces';
import publishUserStream from '../../core/publishUserStream';
import populateAll from '../../core/postPopulateAll';
import serializePost from '../../core/serializePost';
import savePostMentions from '../../core/savePostMentions';
import extractTags from '../../core/extractTags';

/**
 * Statusを作成します
 * @app: API利用App
 * @user: API利用ユーザー
 * @text: 本文
 * @inReplyToPostId: 返信先投稿のID
 */
export default function(app: IApplication, user: IUser, text: string, inReplyToPostId: string = null)
		: Promise<Object> {
	'use strict';

	const maxTextLength: number = 300;
	text = text.trim();

	if (text.length > maxTextLength) {
		return <Promise<any>>Promise.reject('too-long-text');
	}

	return new Promise<Object>((resolve, reject) => {
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
			const tags: string[] = extractTags(text);
			StatusPost.create({
				type: 'status',
				app: app !== null ? app.id : null,
				user: user.id,
				inReplyToPost: inReplyToPostId,
				text,
				tags
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
}
