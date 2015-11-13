import {Status} from '../../models';
import {IApplication, IUser, IStatus} from '../../interfaces';
import publishUserStream from '../../core/publishUserStream';

/**
 * Statusを作成します
 * @app: API利用App
 * @user: API利用ユーザー
 * @text: 本文
 */
export default function(app: IApplication, user: IUser, text: string)
		: Promise<Object> {
	'use strict';

	const maxTextLength: number = 300;
	text = text.trim();

	if (text.length > maxTextLength) {
		return <Promise<any>>Promise.reject('too-long-text');
	}

	return new Promise<Object>((resolve, reject) => {
		Status.create({
			type: 'status',
			app: app !== null ? app.id : null,
			user: user.id,
			text
		}, (err: any, createdStatus: IStatus) => {
			if (err !== null) {
				reject(err);
			} else {
				resolve(createdStatus.toObject());

				user.postsCount++;
				user.save();

				publishUserStream(user.id, {
					type: 'post',
					value: {
						id: createdStatus.id
					}
				});
			}
		});
	});
}
