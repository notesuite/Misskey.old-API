import {Status} from '../../models';
import {IApplication, IStatus} from '../../interfaces';
import publishUserStream from '../../core/publishUserStream';

/**
 * Statusを作成します
 * @app: API利用App
 * @user: API利用ユーザー
 * @text: 本文
 * @inReplyToPostId: 返信先投稿のID。nullを設定すると通常の投稿になります
 * @attachFileIds: 添付ファイルのIDの配列
 */
export default function(app: IApplication, user: string, text: string, inReplyToPostId: string = null, attachFileIds: string = null)
		: Promise<Object> {
	'use strict';

	const maxTextLength: number = 300;
	text = text.trim();

	if (text.length > maxTextLength) {
		return <Promise<any>>Promise.reject('too-long-text');
	}

	return new Promise((resolve: (status: Object) => void, reject: (err: any) => void) => {
		Status.create({
			type: 'status',
			app: app !== null ? app.id : null,
			user: user.id,
			inReplyToPost: inReplyToPostId,
			text
		}, (err: any, createdStatus: IStatus) => {
			if (err !== null) {
				reject(err);
			} else {
				resolve(createdStatus.toObject());

				user.postsCount++;
				user.save();

				publishUserStream(userId, {
					type: 'post',
					value: {
						id: createdStatus.id
					}
				});
			}
		});
	});
}
