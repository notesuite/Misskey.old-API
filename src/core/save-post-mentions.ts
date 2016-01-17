import {PostMention} from '../models';
import {IUser, IPost, IPostMention} from '../interfaces';
import extractMentions from './extract-mentions';
import createNotification from './create-notification';

export default function(author: IUser, post: IPost, text: string): void {
	'use strict';

	extractMentions(text).then(users => {
		users.forEach(user => {
			PostMention.create({
				user: user.id,
				post: post.id,
				cursor: post.cursor
			}, (createErr: any, createdMention: IPostMention) => {
				// 通知を作成
				createNotification(null, user.id, 'mention', {
					postId: post.id
				});
			});
		});
	});
}
