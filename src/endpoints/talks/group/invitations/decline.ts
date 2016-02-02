import {TalkGroupInvitation} from '../../../../db/db';
import * as interfaces from '../../../../db/interfaces';

/**
 * TalkGroupへの招待を断ります
 * @param app API利用App
 * @param me API利用ユーザー
 * @param invitationId 招待ID
 */
export default function(
	app: interfaces.IApplication,
	me: interfaces.IUser,
	invitationId: string
): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		// 招待取得
		TalkGroupInvitation.findById(invitationId, (invitationFindErr: any, invitation: interfaces.ITalkGroupInvitation) => {
			if (invitationFindErr !== null) {
				return reject(invitationFindErr);
			} else if (invitation === null) {
				return reject('invitation-not-found');
			} else if (invitation.user.toString() !== me.id.toString()) {
				return reject('invitation-not-found');
			}

			invitation.isDeclined = true;
			invitation.save((saveErr: any, saved: interfaces.ITalkGroupInvitation) => {
				resolve();
			});
		});
	});
}
