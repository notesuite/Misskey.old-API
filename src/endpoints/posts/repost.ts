import {Post, Repost} from '../../models';
import {IApplication, IUser, IPost, IRepost} from '../../interfaces';
import publishUserStream from '../../core/publish-user-stream';
import serializePost from '../../core/serialize-post';
import createNotification from '../../core/create-notification';

/**
 * 対象の投稿をRepostします
 * @param app API利用App
 * @param user API利用ユーザー
 * @param targetPostId 対象の投稿のID
 * @return 作成された投稿オブジェクト
 */
export default function(
	app: IApplication,
	user: IUser,
	targetPostId: string
): Promise<Object> {
	'use strict';

	return new Promise<Object>((resolve, reject) => {
		// Init 'inReplyToPostId' parameter
		if (targetPostId === undefined || targetPostId === null || targetPostId === '') {
			return reject('target-post-id-is-required');
		}

		// Repostの対象に指定されている投稿が実在するかチェック
		Post.findById(targetPostId, (findErr: any, post: IPost) => {
			if (findErr !== null) {
				return reject(findErr);
			} else if (post === null) {
				return reject('not-found');
			} else if (post.isDeleted) {
				return reject('post-is-deleted');
			} else if (post.user.toString() === user.id.toString()) {
				return reject('your-post');
			} else if (post.type === 'repost') {
				return reject('no-rerepost');
			}

			// 同じ投稿を複数回Repostするのを禁止するために、既に対象の投稿をRepostしていないかチェック
			Repost.findOne({
				user: user.id,
				type: 'repost',
				post: post.id
			}, (findOldErr: any, oldRepost: IRepost) => {
				if (findOldErr !== null) {
					return reject(findOldErr);
				} else if (oldRepost !== null) {
					return reject('already-reposted');
				}

				// Repost作成
				Repost.create({
					app: app !== null ? app.id : null,
					user: user.id,
					post: post.id
				}, (err: any, createdRepost: IRepost) => {
					if (err !== null) {
						return reject(err);
					}

					// Resolve promise
					serializePost(createdRepost, user).then(serialized => {
						resolve(serialized);
					}, (serializeErr: any) => {
						reject(serializeErr);
					});

					// 被Repost数をインクリメント
					post.repostsCount++;
					post.save();

					// User stream
					publishUserStream(user.id, {
						type: 'post',
						value: {
							id: createdRepost.id
						}
					});

					// 通知を作成
					createNotification(null, <string>post.user, 'repost', {
						postId: post.id,
						userId: user.id
					});
				});
			});
		});
	});
}
