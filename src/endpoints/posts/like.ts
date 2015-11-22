import {Post, PostLike} from '../../models';
import {IUser, IPost, IPostLike} from '../../interfaces';

/**
 * ふぁぼります
 * @param user ユーザー
 * @param id 対象の投稿のID
 */
export default function(user: IUser, id: string): Promise<void> {
	'use strict';
	return new Promise<void>((resolve, reject) => {
		Post.findById(id, (err: any, post: IPost) => {
			if (err === null) {
				if (post !== null) {
					PostLike.findOne({
						post: post.id,
						user: user.id
					}, (postLikeFindErr: any, postLike: IPostLike) => {
						if (postLikeFindErr === null) {
							if (postLike === null) {
								PostLike.create({
									post: post.id,
									user: user.id
								}, (createErr: any, createdPostLike: IPostLike) => {
									if (createErr === null) {
										resolve();
									} else {
										reject(createErr);
									}
								});
							} else {
								reject('already-liked');
							}
						} else {
							reject(postLikeFindErr);
						}
					});
				} else {
					reject('post-not-found');
				}
			} else {
				reject(err);
			}
		});
	});
}
