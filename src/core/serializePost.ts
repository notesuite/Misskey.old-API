import serializeStatus from './serializeStatus';
import {IUser, IStatus} from '../interfaces';

export default function serializePost(post: any, me: IUser = null): Promise<Object> {
	'use strict';
	const type: string = post.type;
	return new Promise((resolve: (obj: Object) => void, reject: (err: any) => void) => {
		switch (type) {
			case 'status':
				serializeStatus(<IStatus>post, me).then((serializedStatus: Object) => {
					resolve(serializedStatus);
				}, (serializeErr: any) => {
					reject(serializeErr);
				});
				break;
			case 'repost':
				serializePost(post.post, me).then((serializedPost: any) => {
					post.post = serializedPost;
					resolve(post);
				});
				break;
			default:
				reject('unknown-timeline-item-type');
				break;
		}
	});
}
