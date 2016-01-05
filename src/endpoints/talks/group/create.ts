import {TalkGroup} from '../../../models';
import {IApplication, IUser, ITalkGroup} from '../../../interfaces';

/**
 * TalkGroupを作成します
 * @param app API利用App
 * @param me API利用ユーザー
 * @param name グループ名
 * @return 作成されたTalkGroupオブジェクト
 */
export default function(
	app: IApplication,
	me: IUser,
	name: string
): Promise<Object> {
	'use strict';

	name = name.trim();

	if (name.length > 30) {
		return <Promise<any>>Promise.reject('too-long-name');
	}

	if (name.length === 0) {
		return <Promise<any>>Promise.reject('empty-name');
	}

	return new Promise<Object>((resolve, reject) => {
		TalkGroup.create({
			owner: me.id,
			members: [me.id],
			name
		}, (createErr: any, group: ITalkGroup) => {
			if (createErr !== null) {
				return reject(createErr);
			}

			resolve(group.toObject());
		});
	});
}
