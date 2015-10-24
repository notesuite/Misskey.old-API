import {ITimelineItem} from '../models/timelineItem';
import {Status, IStatus, serializeStatus} from '../models/status';
import {StatusRepost, IStatusRepost, serializeStatusRepost} from '../models/statusRepost';

export default function(timeline: ITimelineItem[]): Promise<Object[]> {
	'use strict';
	return Promise.all(timeline.map((item: ITimelineItem) => {
		const type: string = item.contentType;
		const id: string = item.contentId.toString();
		return new Promise((resolve: (obj: Object) => void, reject: (err: any) => void) => {
			switch (type) {
				case 'status':
					Status.findById(id, (err: any, status: IStatus) => {
						serializeStatus(status).then((serializedStatus: Object) => {
							resolve(serializedStatus);
						}, (serializeErr: any) => {
							reject(serializeErr);
						});
					});
					break;
				case 'status-repost':
					StatusRepost.findById(id, (err: any, statusRepost: IStatusRepost) => {
						serializeStatusRepost(statusRepost).then((serializedStatusRepost: Object) => {
							resolve(serializedStatusRepost);
						}, (serializeErr: any) => {
							reject(serializeErr);
						});
					});
					break;
				default:
					reject('unknown-timeline-item-type');
					break;
			}
		});
	}));
}
