import {IUser} from '../models/user';
import {Favorite, IFavorite} from '../models/favorite';

export default function(postId: string, limit: number = 10, sinceCursor: number = null, maxCursor: number = null)
		: Promise<IUser[]> {
	'use strict';

	return new Promise((resolve: (stargazers: IUser[]) => void, reject: (err: any) => void) => {
		// StatusFavorite取得用のクエリを生成
		const query: any = ((): any => {
			if (sinceCursor === null && maxCursor === null) {
				return {post: postId};
			} else if (sinceCursor) {
				return {$and: [
					{post: postId},
					{cursor: {$gt: sinceCursor}}
				]};
			} else if (maxCursor) {
				return {$and: [
					{post: postId},
					{cursor: {$lt: maxCursor}}
				]};
			}
		})();

		// クエリを発行してFavoriteを取得
		Favorite.find(query)
				.sort('-createdAt')
				.limit(limit)
				.populate('user')
				.exec((favoritesFindErr: any, favorites: IFavorite[]) => {
			if (favoritesFindErr !== null) {
				reject(favoritesFindErr);
			} else if (favorites.length === 0) {
				resolve(null);
			} else {
				resolve(favorites.map((favorite: IFavorite) => {
					return <IUser>favorite.user;
				}));
			}
		});
	});
}
