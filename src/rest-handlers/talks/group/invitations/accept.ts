import {IApplication, IUser} from '../../../../interfaces';
import accept from '../../../../endpoints/talks/group/invitations/accept';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	'use strict';
	const invitationId: string = req.payload['invitation-id'];
	accept(
		app,
		user,
		invitationId
	).then(() => {
		res({kyoppie: 'yuppie'});
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
