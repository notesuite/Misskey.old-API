import {TalkGroup, TalkGroupMessage, TalkUserMessage, TalkUserHistory, User} from '../../../db/db';
import * as interfaces from '../../../db/interfaces';
import getAlbumFile from '../../../core/get-album-file';
import createNotification from '../../../core/create-notification';

/**
 * Talkメッセージを作成します
 * @param app API利用App
 * @param user API利用ユーザー
 * @param userId 宛先のユーザーのID
 * @param text 本文
 * @param fileId 添付ファイルのID
 * @return 作成されたTalkメッセージ
 */
export default function(
	app: interfaces.IApplication,
	user: interfaces.IUser,
	text: string,
	fileId: string = null,
	userId: string = null,
	groupId: string = null
): Promise<Object> {
	const maxTextLength = 500;
	text = text.trim();

	// ファイルが添付されていないかつテキストも空だったらエラー
	if (fileId === null && (text === undefined || text === null || text === '')) {
		return <Promise<any>>Promise.reject('empty-text');
	}

	if (text.length > maxTextLength) {
		return <Promise<any>>Promise.reject('too-long-text');
	}

	if (userId !== null) {
		const otherpartyId = userId;
		if (otherpartyId === user.id.toString())  {
			return <Promise<any>>Promise.reject('no-yourself');
		}

		return new Promise<Object>((resolve, reject) => {
			// 作成する対象のユーザーが実在するかチェック
			User.findById(otherpartyId, (checkErr: any, recipient: interfaces.IUser) => {
				if (checkErr !== null) {
					return reject(checkErr);
				} else if (recipient === null) {
					return reject('recipient-not-found');
				}

				if (fileId !== null) {
					// ファイルチェック & 取得
					getAlbumFile(user.id, fileId).then(file => {
						createUserMessage(resolve, reject, user, recipient, text, file);
					}, reject);
				} else {
					createUserMessage(resolve, reject, user, recipient, text);
				}
			});
		});
	} else if (groupId !== null) {
		return new Promise<Object>((resolve, reject) => {
			// グループ取得
			TalkGroup.findById(groupId, (checkErr: any, group: interfaces.ITalkGroup) => {
				if (checkErr !== null) {
					return reject(checkErr);
				} else if (group === null) {
					return reject('group-not-found');
				} else if (
					(<any[]>group.members)
					.map(member => member.toString())
					.indexOf(user.id.toString()) === -1
				) {
					return reject('access-denied');
				}

				if (fileId !== null) {
					// ファイルチェック & 取得
					getAlbumFile(user.id, fileId).then(file => {
						createGroupMessage(resolve, reject, user, group, text, file);
					}, reject);
				} else {
					createGroupMessage(resolve, reject, user, group, text);
				}
			});
		});
	} else {
		return <Promise<any>>Promise.reject('empty-destination-query');
	}
}

function createUserMessage(
	resolve: any,
	reject: any,
	me: interfaces.IUser,
	recipient: interfaces.IUser,
	text: string,
	file: interfaces.IAlbumFile = null
): void {
	TalkUserMessage.create({
		user: me.id,
		recipient: recipient.id,
		text,
		file: file !== null ? file.id : null
	}, (createErr: any, createdMessage: interfaces.ITalkUserMessage) => {
		if (createErr !== null) {
			return reject(createErr);
		}

		resolve(createdMessage.toObject());

		// 履歴を作成しておく(自分)
		TalkUserHistory.findOne({
			type: 'user',
			user: me.id,
			recipient: recipient.id
		}, (findHistoryErr: any, history: interfaces.ITalkUserHistory) => {
			if (findHistoryErr !== null) {
				return;
			}
			if (history === null) {
				TalkUserHistory.create({
					user: me.id,
					recipient: recipient.id,
					message: createdMessage.id
				});
			} else {
				history.updatedAt = <any>Date.now();
				history.message = createdMessage.id;
				history.save();
			}
		});

		// 履歴を作成しておく(相手)
		TalkUserHistory.findOne({
			type: 'user',
			user: recipient.id,
			recipient: me.id
		}, (findHistoryErr: any, history: interfaces.ITalkUserHistory) => {
			if (findHistoryErr !== null) {
				return;
			}
			if (history === null) {
				TalkUserHistory.create({
					user: recipient.id,
					recipient: me.id,
					message: createdMessage.id
				});
			} else {
				history.updatedAt = <any>Date.now();
				history.message = createdMessage.id;
				history.save();
			}
		});

		// 今から3秒後に未読であった場合通知する
		setTimeout(() => {
			TalkUserMessage.findById(createdMessage.id, (reloadErr: any, reloadedMessage: interfaces.ITalkUserMessage) => {
				if (reloadErr !== null) {
					return;
				} else if (reloadedMessage.isRead) {
					return;
				}
				// 通知を作成
				createNotification(null, recipient.id, 'talk-user-message', {
					messageId: createdMessage.id
				});
			});
		}, 3000);
	});
}

function createGroupMessage(
	resolve: any,
	reject: any,
	me: interfaces.IUser,
	group: interfaces.ITalkGroup,
	text: string,
	file: interfaces.IAlbumFile = null
): void {
	TalkGroupMessage.create({
		user: me.id,
		group: group.id,
		text,
		file: file !== null ? file.id : null
	}, (createErr: any, createdMessage: interfaces.ITalkGroupMessage) => {
		if (createErr !== null) {
			return reject(createErr);
		}

		resolve(createdMessage.toObject());
	});
}
