import {IUser, ITalkMessage, ITalkUserMessage, ITalkGroupMessage} from '../interfaces';

export default function(
	message: ITalkMessage,
	me: IUser,
	includeGroup: boolean = false
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
			case 'group-message':
				const q = message
				.populate({
					path: 'user',
					model: 'User'
				});
				if (includeGroup) {
					q.populate({
						path: 'group',
						model: 'TalkGroup'
					});
				}
				q.populate({
					path: 'file',
					model: 'AlbumFile'
				}, (err: any, message2: ITalkGroupMessage) => {
					if (err !== null) {
						reject(err);
					}
					resolve(message2.toObject());
				});
				break;
			case 'group-send-invitation-activity':
				let q2: any = message;
				if (includeGroup) {
					q2 = message.populate({
						path: 'group',
						model: 'TalkGroup'
					});
				}
				q2.populate({
					path: 'invitee inviter',
					model: 'User'
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
