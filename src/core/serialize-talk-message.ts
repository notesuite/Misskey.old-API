import {IUser, ITalkMessage, IAlbumFile} from '../interfaces';

export default function serialize(
	message: ITalkMessage,
	me: IUser
): Promise<Object> {
	'use strict';

	return new Promise<Object>((resolve, reject) => {
		const serializedMessage: any = message.toObject();
		serializedMessage.user = (<IUser>message.user).toObject();
		serializedMessage.otherparty = (<IUser>message.otherparty).toObject();
		if (serializedMessage.file !== null) {
			serializedMessage.file = (<IAlbumFile>message.file).toObject();
		}
		resolve(serializedMessage);
	});
}
