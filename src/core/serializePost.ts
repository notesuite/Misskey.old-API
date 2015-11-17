import {Post, PostFavorite} from '../models';
import {IUser, IPost, IStatusPost, IPhotoPost} from '../interfaces';
import serializeStatus from './serializeStatus';
import serializePhotoPost from './serializePhotoPost';
import getPostStargazers from './getPostStargazers';

export default function serializePost(post: any, me: IUser = null, serializeReply = true): Promise<Object> {
	'use strict';
	const type: string = post.type;
	return new Promise<Object>((resolve, reject) => {
		switch (type) {
			case 'status':
				common(<IStatusPost>post, me, serializeReply).then((serialized: Object) => {
					serializeStatus(serialized, me).then((serializedStatus: Object) => {
						resolve(serializedStatus);
					}, (serializeErr: any) => {
						reject(serializeErr);
					});
				}, (serializeErr: any) => {
					reject(serializeErr);
				});
				break;
			case 'photo':
				common(<IPhotoPost>post, me, serializeReply).then((serialized: Object) => {
					serializePhotoPost(serialized, me).then((serializedPhotoPost: Object) => {
						resolve(serializedPhotoPost);
					}, (serializeErr: any) => {
						reject(serializeErr);
					});
				}, (serializeErr: any) => {
					reject(serializeErr);
				});
				break;
			case 'repost':
				serializePost(post.post, me, serializeReply).then((serializedPost: any) => {
					post.post = serializedPost;
					resolve(post);
				}, (err: any) => {
					reject(err);
				});
				break;
			default:
				reject('unknown-timeline-item-type');
				break;
		}
	});
}

function common(post: any, me: IUser = null, serializeReply = true): Promise<Object> {
	'use strict';
	return new Promise<Object>((resolve, reject) => {
		Promise.all([
			// Get reply source
			new Promise<Object>((getDestinationResolve, getDestinationReject) => {
				if (post.inReplyToPost !== null && serializeReply) {
					Post.findById(post.inReplyToPost, (findErr: any, source: IPost) => {
						if (findErr !== null) {
							return getDestinationReject(findErr);
						}
						serializePost(source, me, false).then((serializedReply: Object) => {
							getDestinationResolve(serializedReply);
						}, (serializedReplyErr: any) => {
							getDestinationReject(serializedReplyErr);
						});
					});
				} else {
					getDestinationResolve(null);
				}
			}),
			// Get is favorited
			new Promise<boolean>((getIsFavoritedResolve, getIsFavoritedReject) => {
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
			new Promise<boolean>((getIsRepostedResolve, getIsRepostedReject) => {
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
			new Promise<Object[]>((getStargazersResolve, getStargazersReject) => {
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
			new Promise<Object[]>((getRepliesResolve, getRepliesReject) => {
				Post.find({
					inReplyToPost: post.id
				}).limit(10).exec((repliesFindErr: any, replies: IPost[]) => {
					if (repliesFindErr !== null) {
						return getRepliesReject(repliesFindErr);
					}
					getRepliesResolve(replies);
				});
			})
		]).then((results: any[]) => {
			const serialized: any = post;
			serialized.inReplyToPost = (post.inReplyToPost !== null && serializeReply) ? results[0] : post.inReplyToPost;
			serialized.isFavorited = results[1];
			serialized.isReposted = results[2];
			serialized.stargazers = results[3];
			serialized.replies = results[4];
			resolve(serialized);
		},
		(serializedErr: any) => {
			reject(serializedErr);
		});
	});
}
