import {IUser, IStatus} from '../interfaces';
import getPostStargazers from './getPostStargazers';

export default (status: IStatus, options: {
	includeStargazers: boolean;
} = {
	includeStargazers: true
}): Promise<Object> => {
	'use strict';
	return new Promise((resolve: (serializedStatus: Object) => void, reject: (err: any) => void) => {
		Promise.all([
			// Get stargazers
			new Promise((getStargazersResolve: (stargazers: Object[]) => void, getStargazersReject: (err: any) => void) => {
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
			if (options.includeStargazers && results[0] !== undefined) {
				serializedStatus.stargazers = results[0];
			}
			resolve(serializedStatus);
		},
		(serializedErr: any) => {
			reject(serializedErr);
		});
	});
}
