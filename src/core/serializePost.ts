import {Post, PostLike} from '../models';
import {IUser, IStatusPost, IPhotoPost} from '../interfaces';
import serializeStatus from './serializeStatus';
import serializePhotoPost from './serializePhotoPost';
import getPostLikers from './getPostLikers';

export default function serializePost(
		post: any,
		me: IUser = null,
		includeDestination: boolean = true)
			: Promise<Object> {
	'use strict';

	const type: string = post.type;

	return new Promise<Object>((resolve, reject) => {
		switch (type) {
			case 'status':
				common(<IStatusPost>post, me, includeDestination).then((serialized: Object) => {
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
				common(<IPhotoPost>post, me, includeDestination).then((serialized: Object) => {
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
				serializePost(post.post, me).then((serializedPost: any) => {
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

function common(
		post: any,
		me: IUser = null,
		includeDestination: boolean = true)
			: Promise<Object> {
	'use strict';
	return new Promise<Object>((resolve, reject) => {
		Promise.all([
			// Get reply source
			new Promise<Object>((getDestinationResolve, getDestinationReject) => {
				if (post.inReplyToPost !== null && includeDestination) {
					serializePost(post.inReplyToPost, me, false).then((serializedReply: Object) => {
						getDestinationResolve(serializedReply);
					}, (serializedReplyErr: any) => {
						getDestinationReject(serializedReplyErr);
					});
				} else {
					getDestinationResolve(null);
				}
			}),
			// Get is liked
			new Promise<boolean>((getIsLikedResolve, getIsLikedReject) => {
				PostLike.find({
					post: post.id,
					user: me.id
				}).limit(1).count((countErr: any, count: number) => {
					if (countErr !== null) {
						return getIsLikedReject(countErr);
					}
					getIsLikedResolve(count > 0);
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
			// Get likers
			new Promise<Object[]>((getLikersResolve, getLikersReject) => {
				getPostLikers(post.id, 10).then((likers: IUser[]) => {
					if (likers !== null && likers.length > 0) {
						getLikersResolve(likers.map((liker: IUser) => {
							return liker.toObject();
						}));
					} else {
						getLikersResolve(null);
					}
				}, (getLikersErr: any) => {
					getLikersReject(getLikersErr);
				});
			})
		]).then((results: any[]) => {
			const serialized: any = post;
			serialized.inReplyToPost = (post.inReplyToPost !== null && includeDestination) ? results[0] : post.inReplyToPost;
			serialized.isLiked = results[1];
			serialized.isReposted = results[2];
			serialized.likers = results[3];
			resolve(serialized);
		},
		(serializedErr: any) => {
			reject(serializedErr);
		});
	});
}
