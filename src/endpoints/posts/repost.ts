import {Post, Repost} from '../../models';
import {IApplication, IPost, IRepost} from '../../interfaces';
import publishUserStream from '../../core/publishUserStream';
import populateAll from '../../core/postPopulateAll';

export default function(app: IApplication, userId: string, targetPostId: string)
		: Promise<Object> {
	'use strict';

	return new Promise<Object>((resolve, reject) => {
		Post.findById(targetPostId, (findErr: any, post: IPost) => {
			if (findErr !== null) {
				return reject(findErr);
			} else if (post === null) {
				return reject('not-found');
			} else if (post.user === userId) {
				return reject('your-post');
			} else if (post.type === 'repost') {
				return reject('no-rerepost');
			}
			Repost.findOne({
				user: userId,
				type: 'repost',
				post: targetPostId
			}, (findOldErr: any, oldRepost: IRepost) => {
				if (findOldErr !== null) {
					return reject(findOldErr);
				} else if (post !== null) {
					return reject('already-reposted');
				}
				Repost.create({
					type: 'repost',
					app: app !== null ? app.id : null,
					user: userId,
					post: targetPostId
				}, (err: any, createdRepost: IRepost) => {
					if (err !== null) {
						reject(err);
					} else {
						populateAll(createdRepost).then((populated: Object) => {
							resolve(populated);
						}, (populateErr: any) => {
							reject(populateErr);
						});
						post.repostsCount++;
						post.save();
						publishUserStream(userId, {
							type: 'post',
							value: {
								id: createdRepost.id
							}
						});
					}
				});
			});
		});
	});
}
