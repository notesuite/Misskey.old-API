import {Repost} from '../../models';
import {IApplication, IRepost} from '../../interfaces';
import publishUserStream from '../../core/publishUserStream';

export default function(app: IApplication, userId: string, targetPostId: string)
		: Promise<Object> {
	'use strict';

	return new Promise((resolve: (status: Object) => void, reject: (err: any) => void) => {
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

				publishUserStream(userId, {
					type: 'post',
					value: {
						id: createdRepost.id
					}
				});
			}
		});
	});
}
