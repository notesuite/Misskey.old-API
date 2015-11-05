import {Post, PostFavorite} from '../../models';
import {IUser, IPost, IPostFavorite} from '../../interfaces';

/**
 * ふぁぼります
 * @user: ユーザー
 * @targetPostId: 対象の投稿のID
 */
export default function(user: IUser, targetPostId: string): Promise<void> {
	'use strict';
	return new Promise((resolve: () => void, reject: (err: any) => void) => {
		Post.findById(targetPostId, (err: any, targetPost: IPost) => {
			if (err == null) {
				if (targetPost != null) {
					PostFavorite.findOne({
						post: targetPost,
						user: user
					}, (postFavoriteFindErr: any, postFavorite: IPostFavorite) => {
						if (postFavoriteFindErr == null) {
							if (postFavorite == null) {
								PostFavorite.Create({
									post: targetPost,
									user: user
								}, (createErr: any, createdPostFavorite: IPostFavorite) => {
									if (createErr == null) {
										resolve();
									} else {
										reject(createErr);
									}
								});
							} else {
								reject('already-favorite-post');
							}
						} else {
							reject(postFavoriteFindErr);
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
