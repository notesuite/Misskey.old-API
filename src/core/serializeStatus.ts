import {Post, PostFavorite} from '../models';
import {IUser, IStatus} from '../interfaces';
import getPostStargazers from './getPostStargazers';

export default (status: IStatus, me: IUser = null, options: {
	includeStargazers: boolean;
} = {
	includeStargazers: true
}): Promise<Object> => {
	'use strict';
	return new Promise((resolve: (serializedStatus: Object) => void, reject: (err: any) => void) => {
		Promise.all([
			// Get is favorited
			new Promise((getIsFavoritedResolve: (same: any) => void, getIsFavoritedReject: (err: any) => void) => {
				PostFavorite.find({
					post: status.id,
					user: me.id
				}).limit(1).count((countErr: any, count: number) => {
					if (countErr !== null) {
						return getIsFavoritedReject(countErr);
					}
					getIsFavoritedResolve(count > 0);
				});
			}),
			// Get is reposted
			new Promise((getIsRepostedResolve: (same: any) => void, getIsRepostedReject: (err: any) => void) => {
				Post.find({
					type: 'repost',
					post: status.id,
					user: me.id
				}).limit(1).count((countErr: any, count: number) => {
					if (countErr !== null) {
						return getIsRepostedReject(countErr);
					}
					getIsRepostedResolve(count > 0);
				});
			}),
			// Get stargazers
			new Promise((getStargazersResolve: (stargazers: any) => void, getStargazersReject: (err: any) => void) => {
				if (options.includeStargazers) {
					getPostStargazers(status.id, 10).then((stargazers: IUser[]) => {
						if (stargazers !== null && stargazers.length > 0) {
							getStargazersResolve(stargazers.map((stargazer: IUser) => {
								return stargazer.toObject();
							}));
						} else {
							getStargazersResolve(null);
						}
					}, (getStargazersErr: any) => {
						getStargazersReject(getStargazersErr);
					});
				}
			})
		]).then((results: any[]) => {
			const serializedStatus: any = status.toObject();
			serializedStatus.isFavorited = results[0];
			serializedStatus.isReposted = results[1];
			if (options.includeStargazers) {
				serializedStatus.stargazers = results[2];
			}
			resolve(serializedStatus);
		},
		(serializedErr: any) => {
			reject(serializedErr);
		});
	});
}
