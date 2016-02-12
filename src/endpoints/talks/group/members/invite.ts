import {TalkGroup, TalkGroupInvitation, TalkGroupSendInvitationActivity, User} from '../../../../db/db';
import * as interfaces from '../../../../db/interfaces';
import event from '../../../../event';

/**
 * TalkGroupにユーザーを招待します
 * @param app API利用App
 * @param user API利用ユーザー
 * @param groupId グループID
 * @param userId 招待するユーザーのID
 * @param text 招待についてのメッセージ
 * @return 作成された招待オブジェクト
 */
export default function(
	app: interfaces.IApplication,
	me: interfaces.IUser,
	groupId: string,
	userId: string,
	text: string = null
): Promise<Object> {
	if (text !== null) {
		text = text.trim();

		if (text.length > 200) {
			return <Promise<any>>Promise.reject('too-long-message');
		}

		if (text === '') {
			text = null;
		}
	}

	return new Promise<Object>((resolve, reject) => {
		// 自分自身
		if (me.id.toString() === userId) {
			return reject('invitee-is-youself');
		}
		// グループ取得
		TalkGroup.findById(groupId, (groupFindErr: any, group: interfaces.ITalkGroup) => {
			if (groupFindErr !== null) {
				return reject(groupFindErr);
			} else if (group === null) {
				return reject('group-not-found');
			} else if (
				(<string[]>group.members)
				.map(member => member.toString())
				.indexOf(me.id.toString()) === -1
			) {
				return reject('access-denied');
			}
			// 招待する対象のユーザーが実在するかチェック
			User.findById(userId, (inviteeFindErr: any, invitee: interfaces.IUser) => {
				if (inviteeFindErr !== null) {
					return reject(inviteeFindErr);
				} else if (invitee === null) {
					return reject('invitee-not-found');
				} else if (
					(<string[]>group.members)
					.map(member => member.toString())
					.indexOf(invitee.id.toString()) > -1
				) {
					return reject('invitee-is-already-joined');
				}
				// 招待が既にあるかチェック
				TalkGroupInvitation.findOne({
					group: group.id,
					user: invitee.id
				}, (invitationFindErr: any, existInvitation: interfaces.ITalkGroupInvitation) => {
					if (invitationFindErr !== null) {
						return reject(invitationFindErr);
					} else if (existInvitation !== null && existInvitation.isDeclined) {
						return reject('invitation-is-already-declined');
					} else if (existInvitation !== null && !existInvitation.isDeclined) {
						return reject('already-invite');
					}
					// 招待作成
					TalkGroupInvitation.create({
						group: group.id,
						user: invitee.id,
						text: text
					}, (createErr: any, invitation: interfaces.ITalkGroupInvitation) => {
						if (createErr !== null) {
							return reject(createErr);
						}

						resolve(invitation.toObject());

						// グループに招待イベントを投稿
						TalkGroupSendInvitationActivity.create({
							group: group.id,
							invitee: invitee.id,
							inviter: me.id,
							invitation: invitation.id
						}, (activityErr: any, createdActivity: interfaces.ITalkGroupSendInvitationActivity) => {
							if (activityErr !== null) {
								return;
							}
							event.publishGroupTalkMessage(<interfaces.ITalkMessage>createdActivity, group);
						});
					});
				});
			});
		});
	});
}
