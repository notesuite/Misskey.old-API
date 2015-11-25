import {Post, PostLike} from '../../models';
import {IUser, IPost, IPostLike} from '../../interfaces';
import createNotification from '../../core/create-notification';

/**
 * ふぁぼります
 * @param user ユーザー
 * @param id 対象の投稿のID
 */
export default function like(user: IUser, id: string): Promise<void> {
	'use strict';
	return new Promise<void>((resolve, reject) => {
		Post.findById(id, (err: any, post: IPost) => {
			if (err !== null) {
				return reject(err);
			}
			if (post === null) {
				return reject('post-not-found');
			}
			if (post.isDeleted) {
				return reject('post-is-deleted');
			}
			PostLike.findOne({
				post: post.id,
				user: user.id
			}, (postLikeFindErr: any, postLike: IPostLike) => {
				if (postLikeFindErr !== null) {
					return reject(postLikeFindErr);
				}
				if (postLike !== null) {
					return reject('already-liked');
				}
				PostLike.create({
					post: post.id,
					user: user.id
				}, (createErr: any, createdPostLike: IPostLike) => {
					if (createErr !== null) {
						return reject(createErr);
					}
					resolve();

					post.likesCount++;
					post.save();

					// 通知を作成
					createNotification(null, <string>post.user, 'like', {
						postId: post.id,
						userId: user.id
					});
				});
			});
		});
	});
}
