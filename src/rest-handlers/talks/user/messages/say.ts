import { IApplication, IUser } from '../../../../interfaces';
import say from '../../../../endpoints/talks/user/messages/say';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	'use strict';
	const otherpartyId = req.payload['otherparty-id'];
	const text: string = req.payload['text'];
	const fileId = req.payload['file'];
	say(
		app,
		user,
		otherpartyId,
		text,
		fileId
	).then(message => {
		res(message);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
