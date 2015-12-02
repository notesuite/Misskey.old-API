import { Match } from 'powerful';
import {Post} from '../../../models';
import {IUser, IPost} from '../../../interfaces';
import serializeTimeline from '../../../core/serialize-timeline';
import populateAll from '../../../core/post-populate-all';

/**
 * 投稿の返信を取得します
 * @param user API利用ユーザー
 * @param id 対象の投稿のID
 * @param limit 取得する投稿の最大数
 * @param sinceCursor 取得する投稿を、設定されたカーソルよりも大きなカーソルを持つもののみに制限します
 * @param maxCursor 取得する投稿を、設定されたカーソルよりも小さなカーソルを持つもののみに制限します
 */
export default function show(user: IUser, id: string, limit: number = 10, sinceCursor: number = null, maxCursor: number = null)
		: Promise<Object[]> {
	'use strict';
	return new Promise<Object[]>((resolve, reject) => {
		const query = Object.assign({inReplyToPost: id}, new Match<void, any>(null)
				.when(() => sinceCursor !== null, () => { return {cursor: {$gt: sinceCursor}}; })
				.when(() => maxCursor !== null, () => { return {cursor: {$lt: maxCursor}}; })
				.getValue({})
		);

		Post
		.find(query)
		.sort('-createdAt')
		.limit(limit)
		.exec((err: any, replies: IPost[]) => {
			if (err !== null) {
				return reject(err);
			} else if (replies.length === 0) {
				return resolve([]);
			}
			// すべてpopulateする
			Promise.all(replies.map(post => populateAll(post)))
			.then(populatedTimeline => {
				// 整形
				serializeTimeline(populatedTimeline, user).then(serializedTimeline => {
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
