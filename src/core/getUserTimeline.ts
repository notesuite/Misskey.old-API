import {TimelineItem, ITimelineItem} from '../models/timelineItem';
import {Status, IStatus, serializeStatus} from '../models/status';
import {StatusRepost, IStatusRepost, serializeStatusRepost} from '../models/statusRepost';

/**
 * ユーザーのタイムラインを取得します
 * @userIds: タイムライン取得対象のユーザーのIDの配列
 * @itemTypes: 含めるコンテンツのタイプ。nullですべての種類を取得します
 * @limit: 取得するタイムラインのコンテンツの最大数
 * @sinceCursor: 取得するコンテンツを、設定されたカーソルよりも大きなカーソルを持つもののみに制限します
 * @maxCursor: 取得するコンテンツを、設定されたカーソルよりも小さなカーソルを持つもののみに制限します
 */
export default function(userIds: string[], itemTypes?: string[], limit?: number, sinceCursor?: number, maxCursor?: number)
		: Promise<Object[]> {
	'use strict';
	itemTypes = itemTypes ? itemTypes : ['status', 'status-repost'];
	limit = limit ? limit : 10;

	return new Promise((resolve: (statuses: Object[]) => void, reject: (err: any) => void) => {
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
			if (err) {
				reject(err);
			} else {
				// タイムラインを実体化
				entityizeTimeline(timeline).then((entityizedTimeline: any[]) => {
					resolve(entityizedTimeline);
				});
			}
		});
	});
}

function entityizeTimeline(timeline: ITimelineItem[]): Promise<any[]> {
	return Promise.all(timeline.map((item: ITimelineItem): Object => {
		const type: string = item.contentType;
		const id: string = item.contentId.toString();
		return new Promise((resolve: (obj: Object) => void, reject: (err: any) => void) => {
			switch (type) {
				case 'status':
					Status.findById(id, (err: any, status: IStatus) => {
						
						resolve(status.toObject());
					});
					break;
				case 'status-repost':
					StatusRepost.findById(id, (err: any, statusRepost: IStatusRepost) => {
						resolve(statusRepost.toObject());
					});
					break;
			}
		});
	}));
}