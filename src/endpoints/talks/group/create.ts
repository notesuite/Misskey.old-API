import {TalkGroup} from '../../../db/db';
import {IApplication, IUser, ITalkGroup} from '../../../db/interfaces';
import {isName} from '../../../spec/talk-group';

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

	if (!isName(name)) {
		return <Promise<any>>Promise.reject('invalid-name');
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
