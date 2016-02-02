import {IApplication, IUser} from '../../../db/interfaces';
import deleteMessage from '../../../endpoints/talks/messages/delete';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	deleteMessage(
		user,
		req.payload['message-id']
	).then(() => {
		res({status: 'success'});
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
