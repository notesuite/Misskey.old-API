import {Status, IStatus} from '../../models/status';
import {TimelineItem, ITimelineItem} from '../../models/timelineItem';
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

		// 直近のStatusを取得
		Status.findOne({userId}).sort('-createdAt').exec((recentStatusFindErr: any, recentStatus: IStatus) => {
			if (recentStatusFindErr !== null) {
				reject(recentStatusFindErr);
				return;
			}

			// 内容が重複していた場合はエラー
			if (recentStatus !== null && recentStatus.text === text) {
				reject('duplicate-content');
				return;
			}

			// 返信先が指定されている場合、返信先のStatusが本当に存在するか確認する
			if (inReplyToStatusId !== undefined && inReplyToStatusId !== null) {
				Status.findById(inReplyToStatusId, (findReplyTargetErr: any, replyTarget: IStatus) => {
					if (findReplyTargetErr !== null) {
						reject(findReplyTargetErr);
						return;
					}

					if (replyTarget === null) {
						reject('reply-target-not-found');
					} else {
						create();
					}
				});
			} else {
				create();
			}
		});

		function create(): void {
			Status.create({
				appId: app !== null ? app.id : null,
				userId,
				inReplyToStatusId,
				text
			}, (err: any, createdStatus: IStatus) => {
				if (err !== null) {
					reject(err);
				} else {
					resolve(createdStatus.toObject());

					// ストリーミングイベント用メッセージオブジェクト
					const streamMessage: string = JSON.stringify({
						type: 'status',
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

					// タイムラインに追加
					TimelineItem.create({
						userId,
						contentType: 'status',
						contentId: createdStatus.id
					}, (timelineItemCreateErr: any, createdTimelineItem: ITimelineItem) => {
						if (timelineItemCreateErr !== null) {
							reject(timelineItemCreateErr);
						}
					});
				}
			});
		}
	});
}
