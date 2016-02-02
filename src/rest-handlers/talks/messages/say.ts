import {IApplication, IUser} from '../../../db/interfaces';
import say from '../../../endpoints/talks/messages/say';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	const userId = req.payload['user-id'];
	const groupId = req.payload['group-id'];
	const text: string = req.payload['text'];
	const fileId = req.payload['file'];
	say(
		app,
		user,
		text,
		fileId,
		userId,
		groupId
	).then(message => {
		res(message);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
