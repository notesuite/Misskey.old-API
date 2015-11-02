import {Status, UserFollowing} from '../../models';
import {IApplication, IStatus, IUserFollowing} from '../../interfaces';
import publishStreamingMessage from '../../core/publishStreamingMessage';

/**
 * Statusを作成します
 * @app: API利用App
 * @user: API利用ユーザー
 * @text: 本文
 * @inReplyToStatusId: 返信先StatusのID。nullを設定すると通常のStatusになります
 * @attachFileIds: 添付ファイルのIDの配列
 */
export default function(app: IApplication, userId: string, text: string, inReplyToPostId: string = null, attachFileIds: string = null)
		: Promise<Object> {
	'use strict';

	const maxTextLength: number = 300;
	text = text.trim();

	return new Promise((resolve: (status: Object) => void, reject: (err: any) => void) => {
		if (text.length > maxTextLength) {
			reject('too-long-text');
			return;
		}

		Status.create({
			type: 'status',
			app: app !== null ? app.id : null,
			user: userId,
			inReplyToPost: inReplyToPostId,
			text
		}, (err: any, createdStatus: IStatus) => {
			if (err !== null) {
				reject(err);
			} else {
				resolve(createdStatus.toObject());

				// ストリーミングイベント用メッセージオブジェクト
				const streamMessage: string = JSON.stringify({
					type: 'post',
					value: {
						id: createdStatus.id
					}
				});

				// 自分のストリーム
				publishStreamingMessage(`userStream:${userId}`, streamMessage);

				// 自分のフォロワーのストリーム
				UserFollowing.find({followeeId: userId}, (followerFindErr: any, followers: IUserFollowing[]) => {
					followers.forEach((follower: IUserFollowing) => {
						publishStreamingMessage(`userStream:${follower.follower}`, streamMessage);
					});
				});
			}
		});
	});
}
