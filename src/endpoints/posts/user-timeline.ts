import {Post} from '../../db/db';
import {IUser, IPost} from '../../db/interfaces';
import serializePosts from '../../core/serialize-posts';

/**
 * 指定ユーザーの投稿のタイムラインを取得します
 * @param user API利用ユーザー
 * @param targetUserId 対象のユーザーID
 * @param includeReplies リプライを含めるかどうか
 * @param types ,で区切った取得する投稿の種類 ex: "status, photo, video"
 * @param limit 取得する投稿の最大数
 * @param sinceCursor 取得する投稿を、設定されたカーソルよりも大きなカーソルを持つもののみに制限します
 * @param maxCursor 取得する投稿を、設定されたカーソルよりも小さなカーソルを持つもののみに制限します
 * @return 投稿オブジェクトの配列
 */
export default function(
	user: IUser,
	targetUserId: string,
	types: string = null,
	limit: number = 10,
	sinceCursor: number = null,
	maxCursor: number = null
): Promise<Object[]> {
	limit = parseInt(<any>limit, 10);

	if (limit < 1) {
		return <Promise<any>>Promise.reject('1 kara');
	} else if (limit > 100) {
		return <Promise<any>>Promise.reject('100 made');
	}

	return new Promise<Object[]>((resolve, reject) => {
		// タイムライン取得用のクエリを生成
		let query: any = {user: targetUserId};
		let sort: any = {createdAt: -1};

		// cursor指定時
		if (sinceCursor !== null) {
			query.cursor = {$gt: sinceCursor};
			sort = {createdAt: 1};
		} else if (maxCursor !== null) {
			query.cursor = {$lt: maxCursor};
		}

		// types指定時
		if (types !== null) {
			const typesArray: string[] = types
				.split(',')
				.map(type => type.trim())
				.filter(type => type !== '');
			query.type = {$in: typesArray};
		}

		// クエリを発行してタイムラインを取得
		Post
		.find(query)
		.sort(sort)
		.limit(limit)
		.exec((err: any, timeline: IPost[]) => {
			if (err !== null) {
				return reject(err);
			}

			// Resolve promise
			serializePosts(timeline, user).then(serializedTimeline => {
				resolve(serializedTimeline);
			}, (serializeErr: any) => {
				reject(serializeErr);
			});
		});
	});
}
