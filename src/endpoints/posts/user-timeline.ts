import {Post} from '../../models';
import {IUser, IPost} from '../../interfaces';
import serializeTimeline from '../../core/serialize-timeline';
import populateAll from '../../core/post-populate-all';

/**
 * 特定のユーザーの投稿のタイムラインを取得します
 * @param user API利用ユーザー
 * @param targetUserId 対象のユーザーID
 * @param limit 取得する投稿の最大数
 * @param sinceCursor 取得する投稿を、設定されたカーソルよりも大きなカーソルを持つもののみに制限します
 * @param maxCursor 取得する投稿を、設定されたカーソルよりも小さなカーソルを持つもののみに制限します
 */
export default function userTimeline(
	user: IUser,
	targetUserId: string,
	limit: number = 10,
	sinceCursor: number = null,
	maxCursor: number = null)
		: Promise<Object[]> {
	'use strict';

	return new Promise<Object[]>((resolve, reject) => {

		// タイムライン取得用のクエリを生成
		const query: any = ((): any => {
			if (sinceCursor === null && maxCursor === null) {
				return {user: targetUserId};
			} else if (sinceCursor !== null) {
				return {$and: [
					{user: targetUserId},
					{cursor: {$gt: sinceCursor}}
				]};
			} else if (maxCursor !== null) {
				return {$and: [
					{user: targetUserId},
					{cursor: {$lt: maxCursor}}
				]};
			}
		})();

		// クエリを発行してタイムラインを取得
		Post
			.find(query)
			.sort('-createdAt')
			.limit(limit)
			.exec((err: any, timeline: IPost[]) => {
			if (err !== null) {
				return reject(err);
			}
			// すべてpopulateする
			Promise.all(timeline.map(post => populateAll(post)))
			.then((populatedTimeline: IPost[]) => {
				// 整形
				serializeTimeline(populatedTimeline, user).then((serializedTimeline: Object[]) => {
					resolve(serializedTimeline);
				}, (serializeErr: any) => {
					reject(serializeErr);
				});
			}, (populatedErr: any) => {
				reject(populatedErr);
			});
		});
	});
}
