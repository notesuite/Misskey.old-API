import {Post, Repost} from '../../db/db';
import {IApplication, IUser, IPost, IRepost} from '../../db/interfaces';
import serializePost from '../../core/serialize-post';
import createNotification from '../../core/create-notification';
import event from '../../event';

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
	return new Promise<Object>((resolve, reject) => {
		// Check user
		if (user === undefined || user === null) {
			return reject('plz-authenticate');
		} else if (user.isSuspended) {
			return reject('access-denied');
		}

		// Init 'inReplyToPostId' parameter
		if (targetPostId === undefined || targetPostId === null || targetPostId === '') {
			return reject('target-post-id-is-required');
		}

		// 最後の投稿を取得
		Post.findById(<string>user.latestPost, (latestPostFindErr: any, latestPost: IPost) => {

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
						post: post.id,
						prevPost: latestPost !== null ? latestPost.id : null,
						nextPost: null
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

						// 作成した投稿を前の投稿の次の投稿に設定する
						if (latestPost !== null) {
							latestPost.nextPost = createdRepost.id;
							latestPost.save();
						}

						// 最終Postを更新
						user.latestPost = createdRepost.id;
						user.save();

						// 被Repost数をインクリメント
						post.repostsCount++;
						post.save();

						event.publishPost(user.id, createdRepost);

						// 通知を作成
						createNotification(null, <string>post.user, 'repost', {
							postId: post.id,
							userId: user.id
						});
					});
				});
			});
		});
	});
}
