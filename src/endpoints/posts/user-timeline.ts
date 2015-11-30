import {Post} from '../../models';
import {IUser, IPost} from '../../interfaces';
import serializeTimeline from '../../core/serialize-timeline';
import populateAll from '../../core/post-populate-all';

/**
 * 指定ユーザーの投稿のタイムラインを取得します
 * @param user API利用ユーザー
 * @param targetUserId 対象のユーザーID
 * @param includeReplies リプライを含めるかどうか
 * @param types ,で区切った取得する投稿の種類 ex: "status, photo, video"
 * @param limit 取得する投稿の最大数
 * @param sinceCursor 取得する投稿を、設定されたカーソルよりも大きなカーソルを持つもののみに制限します
 * @param maxCursor 取得する投稿を、設定されたカーソルよりも小さなカーソルを持つもののみに制限します
 */
export default function userTimeline(
	user: IUser,
	targetUserId: string,
	includeReplies: boolean = false,
	types: string = null,
	limit: number = 10,
	sinceCursor: number = null,
	maxCursor: number = null
): Promise<Object[]> {
	'use strict';

	return new Promise<Object[]>((resolve, reject) => {
		// タイムライン取得用のクエリを生成
		let query: any = {user: targetUserId};

		// cursor指定時
		if (sinceCursor !== null) {
			query.cursor = {$gt: sinceCursor};
		} else if (maxCursor !== null) {
			query.cursor = {$lt: maxCursor};
		}

		// includeRepliesしない場合
		if (!includeReplies) {
			query.inReplyToPost = null;
		}

		// types指定時
		if (types !== null) {
			const typesArray: string[] = types.split(',').map(type => {
				return type.trim();
			}).filter(type => {
				return type !== '';
			});
			query.type = {$in: typesArray};
		}

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
