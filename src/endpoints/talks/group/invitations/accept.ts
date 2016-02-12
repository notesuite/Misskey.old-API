import {TalkGroup, TalkGroupInvitation, TalkGroupMemberJoinActivity} from '../../../../db/db';
import * as interfaces from '../../../../db/interfaces';
import event from '../../../../event';

/**
 * TalkGroupへの招待を承諾します
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
			// グループ取得
			TalkGroup.findById(<string>invitation.group, (groupFindErr: any, group: interfaces.ITalkGroup) => {
				if (groupFindErr !== null) {
					return reject(groupFindErr);
				} else if (group === null) {
					return reject('group-not-found');
				}
				// メンバー追加
				(<string[]>group.members).push(me.id);
				group.markModified('members');
				group.save((saveErr: any, saved: interfaces.ITalkGroup) => {
					if (saveErr !== null) {
						return reject(saveErr);
					}

					resolve();

					// 招待は削除しておく
					invitation.remove();

					// グループに参加イベントを投稿
					TalkGroupMemberJoinActivity.create({
						group: group.id,
						joiner: me.id
					}, (activityErr: any, createdActivity: interfaces.ITalkGroupMemberJoinActivity) => {
						if (activityErr !== null) {
							return;
						}
						event.publishGroupTalkMessage(<interfaces.ITalkMessage>createdActivity, group);
					});
				});
			});
		});
	});
}
