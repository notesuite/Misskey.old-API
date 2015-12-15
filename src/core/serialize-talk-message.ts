import {IUser, ITalkMessage, IAlbumFile} from '../interfaces';

export default function(
	message: ITalkMessage,
	me: IUser
): Promise<Object> {
	'use strict';

	const serializedMessage: any = message.toObject();

	return new Promise<Object>((resolve, reject) => {
		switch (message.type) {
			case 'user-message':
				
		}

		serializedMessage.user = (<IUser>message.user).toObject();
		serializedMessage.otherparty = (<IUser>message.otherparty).toObject();
		if (serializedMessage.file !== null) {
			serializedMessage.file = (<IAlbumFile>message.file).toObject();
		}
		resolve(serializedMessage);
	});
}
