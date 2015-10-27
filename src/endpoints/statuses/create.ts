import {PostStatus, IPostStatus} from '../../models/post';
import {IApplication} from '../../models/application';
import {UserFollowing, IUserFollowing} from '../../models/userFollowing';
import publishStreamingMessage from '../../core/publishStreamingMessage';

/**
 * Statusを作成します
 * @app: API利用App
 * @user: API利用ユーザー
 * @text: 本文
 * @inReplyToStatusId: 返信先StatusのID。nullを設定すると通常のStatusになります
 * @attachFileIds: 添付ファイルのIDの配列
 */
export default function(app: IApplication, userId: string, text: string, inReplyToStatusId: string = null, attachFileIds: string = null)
		: Promise<Object> {
	'use strict';

	const maxTextLength: number = 300;
	text = text.trim();

	return new Promise((resolve: (status: Object) => void, reject: (err: any) => void) => {
		if (text.length > maxTextLength) {
			reject('too-long-text');
			return;
		}

		PostStatus.create({
			app: app !== null ? app.id : null,
			user: userId,
			inReplyToStatus: inReplyToStatusId,
			text
		}, (err: any, createdStatus: IPostStatus) => {
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
						publishStreamingMessage(`userStream:${follower.followerId}`, streamMessage);
					});
				});
			}
		});
	});
}
