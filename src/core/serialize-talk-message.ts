import {IUser, ITalkMessage, ITalkUserMessage, IAlbumFile} from '../interfaces';

export default function(
	message: ITalkMessage,
	me: IUser
): Promise<Object> {
	'use strict';

	return new Promise<Object>((resolve, reject) => {
		switch (message.type) {
			case 'user-message':
				message.populate({
					path: 'user otherparty file',
					model: 'User'
				}, (err: any, message2: ITalkUserMessage) => {
					const serializedMessage: any = message2.toObject();
					serializedMessage.user = (<IUser>message2.user).toObject();
					serializedMessage.otherparty = (<IUser>message2.otherparty).toObject();
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
