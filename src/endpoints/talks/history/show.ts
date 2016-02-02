import {List} from 'powerful';
const isEmpty = List.isEmpty;
import {TalkHistory} from '../../../db/db';
import {ITalkMessage, IUser, ITalkHistory} from '../../../db/interfaces';
import serialize from '../../../core/serialize-talk-message';

/**
 * Talkの履歴を取得します
 * @param user API利用ユーザー
 * @param limit 取得する投稿の最大数
 * @return Talkの履歴オブジェクトの配列
 */
export default function(
	user: IUser,
	type: string = null,
	limit: number = 30
): Promise<Object[]> {
	return new Promise<Object[]>((resolve, reject) => {
		let query: any = {
			user: user.id
		};
		switch (type) {
			case 'user':
				query.type = 'user';
				break;
			case 'group':
				query.type = 'group';
				break;
			default:
				break;
		}

		(<any>TalkHistory)
		.find(query)
		.sort('-updatedAt')
		.limit(limit)
		.populate('message')
		.exec((err: any, histories: ITalkHistory[]) => {
			if (err !== null) {
				return reject(err);
			} else if (isEmpty(histories)) {
				return resolve([]);
			}

			const messages = histories.map(history => <ITalkMessage>history.message);

			Promise.all(messages.map(message =>
				serialize(message, user, true)
			)).then(resolve, reject);
		});
	});
}
