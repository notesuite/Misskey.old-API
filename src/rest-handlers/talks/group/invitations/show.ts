import {IApplication, IUser} from '../../../../db/interfaces';
import show from '../../../../endpoints/talks/group/invitations/show';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	show(
		app,
		user
	).then(invitations => {
		res(invitations);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
