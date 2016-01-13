import {User, Post, TalkUserMessage} from '../models';
import {IUser, IPost, ITalkUserMessage} from '../interfaces';
import serializeTalkMessage from '../core/serialize-talk-message';

export default function(
	notification: any,
	me: IUser
): Promise<Object> {
	'use strict';

	const type: string = notification.type;
	const content: any = notification.content;

	return new Promise<Object>((resolve, reject) => {
		switch (type) {
			case 'like':
			case 'repost':
				User.findById(content.userId, (userErr: any, user: IUser) => {
					Post.findById(content.postId, (postErr: any, post: IPost) => {
						notification.content.user = user.toObject();
						notification.content.post = post.toObject();
						resolve(notification);
					});
				});
				break;
			case 'follow':
				User.findById(content.userId, (userErr: any, user: IUser) => {
					notification.content.user = user.toObject();
					resolve(notification);
				});
				break;
			case 'talk-user-message':
				TalkUserMessage.findById(content.messageId, (messageErr: any, message: ITalkUserMessage) => {
					serializeTalkMessage(message, me).then((message2: ITalkUserMessage) => {
						notification.content.message = message2;
						resolve(notification);
					}, reject);
				});
				break;
			default:
				reject('unknown-notification-type');
				break;
		}
	});
}
