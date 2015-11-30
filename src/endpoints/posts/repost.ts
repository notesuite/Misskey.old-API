import {Post, Repost} from '../../models';
import {IApplication, IUser, IPost, IRepost} from '../../interfaces';
import publishUserStream from '../../core/publish-user-stream';
import populateAll from '../../core/post-populate-all';
import createNotification from '../../core/create-notification';

export default function repost(app: IApplication, user: IUser, targetPostId: string)
		: Promise<Object> {
	'use strict';

	return new Promise<Object>((resolve, reject) => {
		Post.findById(targetPostId, (findErr: any, post: IPost) => {
			if (findErr !== null) {
				return reject(findErr);
			} else if (post === null) {
				return reject('not-found');
			} else if (post.isDeleted) {
				return reject('post-is-deleted');
			} else if (post.user.toString() === user.id.toString()) {
				return reject('your-post');
			} else if (post.type === 'repost') {
				return reject('no-rerepost');
			}
			Repost.findOne({
				user: user.id,
				type: 'repost',
				post: targetPostId
			}, (findOldErr: any, oldRepost: IRepost) => {
				if (findOldErr !== null) {
					return reject(findOldErr);
				} else if (oldRepost !== null) {
					return reject('already-reposted');
				}
				Repost.create({
					type: 'repost',
					app: app !== null ? app.id : null,
					user: user.id,
					post: targetPostId
				}, (err: any, createdRepost: IRepost) => {
					if (err !== null) {
						return reject(err);
					}
					populateAll(createdRepost).then(populated => {
						resolve(populated);
					}, (populateErr: any) => {
						reject(populateErr);
					});
					post.repostsCount++;
					post.save();

					// User stream
					publishUserStream(user.id, {
						type: 'post',
						value: {
							id: createdRepost.id
						}
					});

					// 通知を作成
					createNotification(null, <string>post.user, 'repost', {
						postId: post.id,
						userId: user.id
					});
				});
			});
		});
	});
}
