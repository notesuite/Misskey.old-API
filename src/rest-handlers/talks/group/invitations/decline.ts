import {IApplication, IUser} from '../../../../db/interfaces';
import decline from '../../../../endpoints/talks/group/invitations/decline';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	const invitationId: string = req.payload['invitation-id'];
	decline(
		app,
		user,
		invitationId
	).then(() => {
		res({kyoppie: 'yuppie'});
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
