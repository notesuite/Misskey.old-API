import {TalkGroupInvitation} from '../../../../models';
import {IApplication, IUser, ITalkGroupInvitation} from '../../../../interfaces';

/**
 * TalkGroupへの招待一覧を取得します
 * @param app API利用App
 * @param me API利用ユーザー
 */
export default function(
	app: IApplication,
	me: IUser
): Promise<Object[]> {
	'use strict';

	return new Promise<Object[]>((resolve, reject) => {
		// 招待取得
		TalkGroupInvitation.find({
			user: me.id
		}, (invitationsFindErr: any, invitations: ITalkGroupInvitation[]) => {
			if (invitationsFindErr !== null) {
				return reject(invitationsFindErr);
			} else if (invitations.length === 0) {
				return resolve([]);
			}
			resolve(invitations.map(invitation => invitation.toObject()));
		});
	});
}
