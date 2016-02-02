import {IApplication, IUser} from '../../../db/interfaces';
import readMessage from '../../../endpoints/talks/messages/read';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	readMessage(
		user,
		req.payload['message-id']
	).then(() => {
		res({status: 'success'});
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
