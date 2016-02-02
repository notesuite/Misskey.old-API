import {BBSTopic, BBSPost, BBSWatching} from '../../../db/db';
import {IBBSTopic, IBBSPost, IBBSWatching, IApplication, IUser} from '../../../db/interfaces';
import createNotification from '../../../core/create-notification';

/**
 * bbs postを作成します
 * @param app API利用App
 * @param user API利用ユーザー
 * @param topicId topicのID
 * @param text 本文
 * @param inReplyToPostId 返信先投稿のID
 * @return 作成したbbs postオブジェクト
 */
export default function(
	app: IApplication,
	user: IUser,
	topicId: string,
	text: string,
	inReplyToPostId: string = null
): Promise<Object> {
	text = text.trim();

	if (text.length === 0) {
		return <Promise<any>>Promise.reject('empty-text');
	}

	if (text.length > 1000) {
		return <Promise<any>>Promise.reject('too-long-text');
	}

	return new Promise<Object>((resolve, reject) => {
		BBSTopic.findById(topicId, (topicFindErr: any, topic: IBBSTopic) => {
			if (topicFindErr !== null) {
				return reject(topicFindErr);
			} else if (topic === null) {
				return reject('topic-not-found');
			}

			if (inReplyToPostId !== null) {
				// リプライ先に指定されている投稿が実在するかチェック
				BBSPost.findById(inReplyToPostId, (err: any, reply: IBBSPost) => {
					if (err !== null) {
						reject(err);
					} else if (reply === null) {
						reject('reply-source-not-found');
					} else if (reply.isDeleted) {
						reject('reply-source-not-found');
					} else if (reply.topic.toString() !== topicId) {
						reject('reply-source-not-found');
					} else {
						create(reply);
					}
				});
			} else {
				create();
			}

			function create(reply: IBBSPost = null): void {
				BBSPost
				.find({
					topic: topic.id,
				})
				.count((countErr: any, count: number) => {
					if (countErr !== null) {
						return reject(countErr);
					}

					BBSPost.create({
						app: app !== null ? app.id : null,
						user: user.id,
						topic: topic.id,
						number: count,
						text,
						inReplyToPost: reply !== null ? reply.id : null,
					}, (createErr: any, post: IBBSPost) => {
						if (createErr !== null) {
							return reject(createErr);
						}

						resolve(post.toObject());

						if (count === 0) {
							topic.pinnedPost = post.id;
							topic.save();
						}

						if (reply !== null) {
							reply.repliesCount++;
							reply.save();
						}

						BBSWatching.find({
							topic: topic.id
						}, (watchersFindErr: any, watchs: IBBSWatching[]) => {
							watchs.forEach(watch => {
								// 自分自身は通知しない
								if (user.id.toString() === watch.user.toString()) {
									return;
								}

								createNotification(null, <string>watch.user, 'bbs-post', {
									topicId: topic.id,
									postId: post.id,
									userId: user.id
								});
							});
						});
					});
				});
			}
		});
	});
}
