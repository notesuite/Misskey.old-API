import {TalkGroup} from '../../../db/db';
import {ITalkGroup, IUser} from '../../../db/interfaces';

/**
 * Groupを取得します
 * @param user API利用ユーザー
 * @param groupId 対象のGroupのID
 * @return Groupオブジェクト
 */
export default function(
	user: IUser,
	groupId: string
): Promise<Object> {
	return new Promise<Object>((resolve, reject) => {
		TalkGroup
		.findById(groupId)
		.populate('owner members')
		.exec((findErr: any, group: ITalkGroup) => {
			if (findErr !== null) {
				return reject(findErr);
			} else if (group === null) {
				return reject('group-not-found');
			} else if (
				(<IUser[]>group.members)
				.map(member => member.id.toString())
				.indexOf(user.id.toString()) === -1
			) {
				return reject('access-denied');
			}

			resolve(group.toObject());
		});
	});
}
