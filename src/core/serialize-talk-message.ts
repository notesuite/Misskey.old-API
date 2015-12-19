import {IUser, ITalkMessage, ITalkUserMessage, IAlbumFile} from '../interfaces';

export default function(
	message: ITalkMessage,
	me: IUser
): Promise<Object> {
	'use strict';
	console.log(message);
	return new Promise<Object>((resolve, reject) => {
		console.log('kyoppie');
		console.log(message.type);
		switch (message.type) {
			case 'user-message':
				console.log('yuppie');
				message.populate({
					path: 'user recipient file',
					model: 'User'
				}, (err: any, message2: ITalkUserMessage) => {
					if (err !== null) {
						reject(err);
					}
					console.log(message2);

					const serializedMessage: any = message2.toObject();
					serializedMessage.user = (<IUser>message2.user).toObject();
					serializedMessage.recipient = (<IUser>message2.recipient).toObject();
					if (serializedMessage.file !== null) {
						serializedMessage.file = (<IAlbumFile>message2.file).toObject();
					}
					resolve(serializedMessage);
				});
				break;
			default:
				break;
		}
	});
}
