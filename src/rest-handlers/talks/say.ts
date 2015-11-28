import * as hapi from 'hapi';
import { IApplication, IUser } from '../../interfaces';
import say from '../../endpoints/talks/say';

export default function photoPost(
	app: IApplication,
	user: IUser,
	req: hapi.Request,
	res: hapi.IReply
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
	).then((message: Object) => {
		res(message);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
