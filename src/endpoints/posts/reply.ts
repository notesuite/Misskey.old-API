import {Status} from '../../models';
import {IApplication, IUser, IStatus} from '../../interfaces';
import publishUserStream from '../../core/publishUserStream';

/**
 * 返信を作成します
 * @app: API利用App
 * @user: API利用ユーザー
 * @text: 本文
 * @inReplyToPostId: 返信先投稿のID
 * @attachFileIds: 添付ファイルのIDの配列
 */
export default function(app: IApplication, user: IUser, text: string, inReplyToPostId: string, attachFileIds: string = null)
		: Promise<Object> {
	'use strict';

	const maxTextLength: number = 300;
	text = text.trim();

	if (text.length > maxTextLength) {
		return <Promise<any>>Promise.reject('too-long-text');
	}

	return new Promise<Object>((resolve, reject) => {
		Status.create({
			type: 'reply',
			app: app !== null ? app.id : null,
			user: user.id,
			inReplyToPost: inReplyToPostId,
			text
		}, (err: any, createdReply: IStatus) => {
			if (err !== null) {
				reject(err);
			} else {
				resolve(createdReply.toObject());

				user.postsCount++;
				user.save();

				publishUserStream(user.id, {
					type: 'post',
					value: {
						id: createdReply.id
					}
				});
			}
		});
	});
}
