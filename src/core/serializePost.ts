import {Post, PostFavorite} from '../models';
import {IUser, IStatus, IReply} from '../interfaces';
import serializeStatus from './serializeStatus';
import serializeReply from './serializeReply';
import getPostStargazers from './getPostStargazers';

export default function serializePost(post: any, me: IUser = null): Promise<Object> {
	'use strict';
	const type: string = post.type;
	return new Promise((resolve: (obj: Object) => void, reject: (err: any) => void) => {
		switch (type) {
			case 'status':
				common(<IStatus>post, me).then((serialized: Object) => {
					serializeStatus(serialized, me).then((serializedStatus: Object) => {
						resolve(serializedStatus);
					}, (serializeErr: any) => {
						reject(serializeErr);
					});
				}, (serializeErr: any) => {
					reject(serializeErr);
				});
				break;
			case 'reply':
				common(<IReply>post, me).then((serialized: Object) => {
					serializeReply(serialized, me).then((serializedReply: Object) => {
						resolve(serializedReply);
					}, (serializeErr: any) => {
						reject(serializeErr);
					});
				}, (serializeErr: any) => {
					reject(serializeErr);
				});
				break;
			case 'repost':
				serializePost(post.post, me).then((serializedPost: any) => {
					post.post = serializedPost;
					resolve(post);
				});
				break;
			default:
				reject('unknown-timeline-item-type');
				break;
		}
	});
}

function common(post: any, me: IUser = null): Promise<Object> {
	'use strict';
	return new Promise<Object>((resolve, reject) => {
		Promise.all([
			// Get is favorited
			new Promise((getIsFavoritedResolve: (same: any) => void, getIsFavoritedReject: (err: any) => void) => {
				PostFavorite.find({
					post: post.id,
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
					post: post.id,
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
				getPostStargazers(post.id, 10).then((stargazers: IUser[]) => {
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
			}),
			// Get replies
			new Promise((getRepliesResolve: (replies: any) => void, getRepliesReject: (err: any) => void) => {
				Post.find({
					type: 'reply',
					inReplyToPost: post.id
				}).limit(10).exec((repliesFindErr: any, replies: IReply[]) => {
					if (repliesFindErr !== null) {
						return getRepliesReject(repliesFindErr);
					}
					getRepliesResolve(replies);
				});
			})
		]).then((results: any[]) => {
			const serialized: any = post;
			serialized.isFavorited = results[0];
			serialized.isReposted = results[1];
			serialized.stargazers = results[2];
			serialized.replies = results[3];
			resolve(serialized);
		},
		(serializedErr: any) => {
			reject(serializedErr);
		});
	});
}
