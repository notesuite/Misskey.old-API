import {BBSTopic, BBSWatching} from '../../../db/db';
import {IBBSTopic, IApplication, IUser} from '../../../db/interfaces';

/**
 * bbs topicを作成します
 * @param app API利用App
 * @param user API利用ユーザー
 * @param title タイトル
 * @return 作成されたbbs topicオブジェクト
 */
export default function(
	app: IApplication,
	user: IUser,
	title: string
): Promise<Object> {
	title = title.trim();

	if (title.length === 0) {
		return <Promise<any>>Promise.reject('empty-title');
	}

	if (title.length > 100) {
		return <Promise<any>>Promise.reject('too-long-title');
	}

	return new Promise<Object>((resolve, reject) => {
		BBSTopic.create({
			user: user.id,
			title
		}, (createErr: any, topic: IBBSTopic) => {
			if (createErr !== null) {
				return reject(createErr);
			}

			resolve(topic.toObject());

			// Watchしとく
			BBSWatching.create({
				user: user.id,
				topic: topic.id
			});
		});
	});
}
