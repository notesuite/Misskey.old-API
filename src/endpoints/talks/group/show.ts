import {TalkGroup} from '../../../models';
import {ITalkGroup, IUser} from '../../../interfaces';

/**
 * Groupを取得します
 * @param user API利用ユーザー
 * @param groupId 対象のGroupのID
 */
export default function(
	user: IUser,
	groupId: string
): Promise<Object> {
	'use strict';

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
