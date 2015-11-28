import {PostMention} from '../models';
import {IUser, IPost, IPostMention} from '../interfaces';

export default function readPost(me: IUser, post: IPost): Promise<void> {
	'use strict';

	return new Promise<void>((resolve, reject) => {
		PostMention.findOne({
			user: me.id,
			post: post.id
		}, (mentionFindErr: any, mention: IPostMention) => {
			if (mentionFindErr !== null) {
				return reject(mentionFindErr);
			} else if (mention === null) {
				return resolve();
			}
			mention.isRead = true;
			mention.save((err: any, saved: IPostMention) => {
				if (err !== null) {
					return reject(mentionFindErr);
				}
				resolve();
			});
		});
	});
}