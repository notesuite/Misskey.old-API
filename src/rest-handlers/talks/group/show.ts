import {IApplication, IUser} from '../../../db/interfaces';
import show from '../../../endpoints/talks/group/show';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	const groupId: string = req.payload['group-id'];
	show(
		user,
		groupId
	).then(group => {
		res(group);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
