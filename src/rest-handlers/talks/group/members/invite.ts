import {IApplication, IUser} from '../../../../db/interfaces';
import invite from '../../../../endpoints/talks/group/members/invite';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	const groupId: string = req.payload['group-id'];
	const userId: string = req.payload['user-id'];
	const text: string = req.payload['text'];
	invite(
		app,
		user,
		groupId,
		userId,
		text
	).then(group => {
		res(group);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
