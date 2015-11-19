import {Post} from '../../models';
import {IUser, IPost} from '../../interfaces';
import serializeTimeline from '../../core/serializeTimeline';
import populateAll from '../../core/postPopulateAll';

/**
 * 投稿の返信を取得します
 * @user: API利用ユーザー
 * @id: 対象の投稿のID
 * @limit: 取得する投稿の最大数
 * @sinceCursor: 取得する投稿を、設定されたカーソルよりも大きなカーソルを持つもののみに制限します
 * @maxCursor: 取得する投稿を、設定されたカーソルよりも小さなカーソルを持つもののみに制限します
 */
export default function(user: IUser, id: string, limit: number = 10, sinceCursor: number = null, maxCursor: number = null)
		: Promise<Object[]> {
	'use strict';
	return new Promise<Object[]>((resolve, reject) => {
		const query: any = ((): any => {
			if (sinceCursor === null && maxCursor === null) {
				return {inReplyToPost: id};
			} else if (sinceCursor !== null) {
				return {
					inReplyToPost: id,
					cursor: {$gt: sinceCursor}
				};
			} else if (maxCursor !== null) {
				return {
					inReplyToPost: id,
					cursor: {$lt: maxCursor}
				};
			}
		})();

		Post
			.find(query)
			.sort('-createdAt')
			.limit(limit)
			.exec((err: any, replies: IPost[]) => {
			if (err !== null) {
				return reject(err);
			}
			// すべてpopulateする
			Promise.all(replies.map((post: IPost) => {
				return populateAll(post);
			})).then((populatedTimeline: IPost[]) => {
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
