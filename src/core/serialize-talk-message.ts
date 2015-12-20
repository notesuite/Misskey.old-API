import {IUser, ITalkMessage, ITalkUserMessage} from '../interfaces';

export default function(
	message: ITalkMessage,
	me: IUser
): Promise<Object> {
	'use strict';
	return new Promise<Object>((resolve, reject) => {
		switch (message.type) {
			case 'user-message':
				message
				.populate({
					path: 'user recipient',
					model: 'User'
				})
				.populate({
					path: 'file',
					model: 'AlbumFile'
				}, (err: any, message2: ITalkUserMessage) => {
					if (err !== null) {
						reject(err);
					}
					resolve(message2.toObject());
				});
				break;
			default:
				break;
		}
	});
}
