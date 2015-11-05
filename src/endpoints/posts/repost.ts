import {Post, Repost} from '../../models';
import {IApplication, IPost, IRepost} from '../../interfaces';
import publishUserStream from '../../core/publishUserStream';

export default function(app: IApplication, userId: string, targetPostId: string)
		: Promise<Object> {
	'use strict';

	return new Promise<Object>((resolve, reject) => {
		Post.findById(targetPostId, (findErr: any, post: IPost) => {
			if (findErr !== null) {
				reject(findErr);
			} else if (post === null) {
				reject('not-found');
			} else if (post.user === userId) {
				reject('your-post');
			} else if (post.type === 'repost') {
				reject('no-rerepost');
			} else {
				Repost.create({
					type: 'repost',
					app: app !== null ? app.id : null,
					user: userId,
					post: targetPostId
				}, (err: any, createdRepost: IRepost) => {
					if (err !== null) {
						reject(err);
					} else {
						resolve(createdRepost.toObject());

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
			}
		});
	});
}
