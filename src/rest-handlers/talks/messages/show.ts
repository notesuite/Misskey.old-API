import {IApplication, IUser} from '../../../db/interfaces';
import showMessage from '../../../endpoints/talks/messages/show';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	showMessage(
		user,
		req.payload['message-id']
	).then(message => {
		res(message);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
