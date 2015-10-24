import {TimelineItem, ITimelineItem} from '../models/timelineItem';

/**
 * タイムラインを取得します
 * @userIds: タイムライン取得対象のユーザーのIDの配列
 * @itemTypes: 含めるコンテンツのタイプ。nullですべての種類を取得します
 * @limit: 取得するタイムラインのコンテンツの最大数
 * @sinceCursor: 取得するコンテンツを、設定されたカーソルよりも大きなカーソルを持つもののみに制限します
 * @maxCursor: 取得するコンテンツを、設定されたカーソルよりも小さなカーソルを持つもののみに制限します
 */
export default function(userIds: string[], itemTypes: string[] = ['status', 'status-repost'], limit: number = 10, sinceCursor: number = null, maxCursor: number = null)
		: Promise<ITimelineItem[]> {
	'use strict';

	return new Promise((resolve: (timeline: ITimelineItem[]) => void, reject: (err: any) => void) => {
		// タイムライン取得用のクエリを生成
		const query: any = ((): any => {
			if (sinceCursor === null && maxCursor === null) {
				return {$and: [
					{userId: {$in: userIds}},
					{contentType: {$in: [itemTypes]}}
				]};
			} else if (sinceCursor) {
				return {$and: [
					{$and: [
						{userId: {$in: userIds}},
						{contentType: {$in: [itemTypes]}}
					]},
					{cursor: {$gt: sinceCursor}}
				]};
			} else if (maxCursor) {
				return {$and: [
					{$and: [
						{userId: {$in: userIds}},
						{contentType: {$in: [itemTypes]}}
					]},
					{cursor: {$lt: maxCursor}}
				]};
			}
		})();

		// クエリを発行してタイムラインを取得
		TimelineItem.find(query).sort('-createdAt').limit(limit)
				.exec((err: any, timeline: ITimelineItem[]) => {
			if (err !== null) {
				reject(err);
			} else {
				resolve(timeline);
			}
		});
	});
}
