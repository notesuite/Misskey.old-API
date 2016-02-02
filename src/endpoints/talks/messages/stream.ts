import {List, Match} from 'powerful';
const isEmpty = List.isEmpty;
import {TalkGroup, TalkGroupMessageBase, TalkUserMessage} from '../../../db/db';
import {ITalkGroup, ITalkMessage, IUser} from '../../../db/interfaces';
import serialize from '../../../core/serialize-talk-message';
import readTalkMessage from '../../../core/read-talk-message';

/**
 * Talkのストリームを取得します
 * @param me API利用ユーザー
 * @param limit 取得する投稿の最大数
 * @param sinceCursor 取得するメッセージを、設定されたカーソルよりも大きなカーソルを持つもののみに制限します
 * @param maxCursor 取得するメッセージを、設定されたカーソルよりも小さなカーソルを持つもののみに制限します
 * @param userId 相手のユーザーのID
 * @param groupId
 * @return トークメッセージの配列
 */
export default function(
	me: IUser,
	limit: number = 10,
	sinceCursor: number = null,
	maxCursor: number = null,
	userId: string = null,
	groupId: string = null
): Promise<Object[]> {
	limit = parseInt(<any>limit, 10);

	if (limit < 1) {
		return <Promise<any>>Promise.reject('1 kara');
	} else if (limit > 30) {
		return <Promise<any>>Promise.reject('30 made');
	}

	return new Promise<Object[]>((resolve, reject) => {
		if (userId !== null) {
			getUserStream();
		} else if (groupId !== null) {
			getGroupStream();
		} else {
			reject('empty-destination-query');
		}

		function getUserStream(): void {
			const query = Object.assign({
				$or: [{
					user: me.id,
					recipient: userId
				}, {
					user: userId,
					recipient: me.id
				}]
			}, new Match<void, any>(null)
				.when(() => sinceCursor !== null, () => {
					return { cursor: { $gt: sinceCursor } };
				})
				.when(() => maxCursor !== null, () => {
					return { cursor: { $lt: maxCursor } };
				})
				.getValue({})
			);

			TalkUserMessage
			.find(query)
			.sort({createdAt: -1})
			.limit(limit)
			.exec((err: any, messages: ITalkMessage[]) => {
				if (err !== null) {
					return reject(err);
				} else if (isEmpty(messages)) {
					return resolve([]);
				}

				Promise.all(messages.map(message =>
					serialize(message, me)
				)).then(resolve, reject);

				// 既読にする
				messages.forEach(message => {
					readTalkMessage(me, message);
				});
			});
		}

		function getGroupStream(): void {
			TalkGroup
			.findById(groupId)
			.exec((groupFindErr: any, group: ITalkGroup) => {
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

				const query = Object.assign({
					group: group.id,
				}, new Match<void, any>(null)
					.when(() => sinceCursor !== null, () => {
						return { cursor: { $gt: sinceCursor } };
					})
					.when(() => maxCursor !== null, () => {
						return { cursor: { $lt: maxCursor } };
					})
					.getValue({})
				);

				TalkGroupMessageBase
				.find(query)
				.sort({createdAt: -1})
				.limit(limit)
				.exec((err: any, messages: ITalkMessage[]) => {
					if (err !== null) {
						return reject(err);
					} else if (isEmpty(messages)) {
						return resolve([]);
					}

					Promise.all(messages.map(message =>
						serialize(message, me)
					)).then(resolve, reject);

					// 既読にする
					messages.forEach(message => {
						readTalkMessage(me, message);
					});
				});
			});
		}
	});
}
