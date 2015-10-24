import {User, IUser} from '../models/user';
import {Status, IStatus} from '../models/status';
import {StatusFavorite, IStatusFavorite} from '../models/statusFavorite';

export default function(statusId: string, limit?: number, sinceCursor?: number, maxCursor?: number)
		: Promise<IUser[]> {
	'use strict';
	limit = limit ? limit : 10;

	return new Promise((resolve: (statuses: Object[]) => void, reject: (err: any) => void) => {
		// StatusFavorite取得用のクエリを生成
		const query: any = ((): any => {
			if (sinceCursor === null && maxCursor === null) {
				return {statusId};
			} else if (sinceCursor) {
				return {$and: [
					{statusId},
					{cursor: {$gt: sinceCursor}}
				]};
			} else if (maxCursor) {
				return {$and: [
					{statusId},
					{cursor: {$lt: maxCursor}}
				]};
			}
		})();

		// クエリを発行してStatusFavoriteを取得
		StatusFavorite.find(query).sort('-createdAt').limit(limit)
				.exec((favoritesFindErr: any, favorites: IStatusFavorite[]) => {
			if (favoritesFindErr) {
				reject(favoritesFindErr);
			} else if (favorites.length === 0) {
				resolve(null);
			} else {
				// stargazersを取得
				Promise.all(favorites.map((favorite: IStatusFavorite) => {
					return new Promise((findUserResolve: (stargazer: IUser) => void, findUserReject: (err: any) => void) => {
						User.findById(favorite.userId.toString(), (findUserErr: any, stargazer: IUser) => {
							if (findUserErr) {
								findUserReject(findUserErr);
							} else if (stargazer === null) {
								findUserResolve(null)
							} else {
								findUserResolve(stargazer);
							}
						});
					});
				})).then((stargazers: IUser[]) => {
					resolve(stargazers);
				}, (getStargazersErr: any) => {
					reject(getStargazersErr);
				});
			}
		});
	});
}
