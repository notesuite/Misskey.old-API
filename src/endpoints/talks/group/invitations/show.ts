import {TalkGroupInvitation} from '../../../../db/db';
import {IApplication, IUser, ITalkGroupInvitation} from '../../../../db/interfaces';

/**
 * TalkGroupへの招待一覧を取得します
 * @param app API利用App
 * @param me API利用ユーザー
 * @return 招待オブジェクトの配列
 */
export default function(
	app: IApplication,
	me: IUser
): Promise<Object[]> {
	return new Promise<Object[]>((resolve, reject) => {
		// 招待取得
		TalkGroupInvitation.find({
			user: me.id,
			isDeclined: false
		})
		.populate('group')
		.exec((invitationsFindErr: any, invitations: ITalkGroupInvitation[]) => {
			if (invitationsFindErr !== null) {
				return reject(invitationsFindErr);
			} else if (invitations.length === 0) {
				return resolve([]);
			}
			resolve(invitations.map(invitation => invitation.toObject()));
		});
	});
}
