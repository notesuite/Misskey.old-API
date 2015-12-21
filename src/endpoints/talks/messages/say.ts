import {TalkUserMessage, TalkUserHistory, User} from '../../../models';
import {ITalkUserMessage, ITalkUserHistory, IApplication, IUser, IAlbumFile} from '../../../interfaces';
import getAlbumFile from '../../../core/get-album-file';
import publishStream from '../../../core/publish-streaming-message';

/**
 * Talkメッセージを作成します
 * @param app API利用App
 * @param user API利用ユーザー
 * @param userId 宛先のユーザーのID
 * @param text 本文
 * @param fileId 添付ファイルのID
 */
export default function(
	app: IApplication,
	user: IUser,
	text: string,
	fileId: string = null,
	userId: string = null,
	groupId: string = null
): Promise<Object> {
	'use strict';

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
			User.findById(otherpartyId, (checkErr: any, recipient: IUser) => {
				if (checkErr !== null) {
					return reject(checkErr);
				} else if (recipient === null) {
					return reject('recipient-notfound');
				}

				if (fileId !== null) {
					getAlbumFile(user.id, fileId).then(file => {
						createUserMessage(resolve, reject, user, recipient, text, file);
					}, reject);
				} else {
					createUserMessage(resolve, reject, user, recipient, text);
				}
			});
		});
	} else if (groupId !== null) {
		return <Promise<any>>Promise.reject('not-implemented');
	} else {
		return <Promise<any>>Promise.reject('empty-destination-query');
	}
}

function createUserMessage(
	resolve: any,
	reject: any,
	me: IUser,
	recipient: IUser,
	text: string,
	file: IAlbumFile = null
): void {
	'use strict';

	TalkUserMessage.create({
		user: me.id,
		recipient: recipient.id,
		text,
		file: file !== null ? file.id : null
	}, (createErr: any, createdMessage: ITalkUserMessage) => {
		if (createErr !== null) {
			return reject(createErr);
		}

		resolve(createdMessage.toObject());

		[ // Streaming messages
			[`user-stream:${recipient.id}`, 'talk-user-message'],
			[`talk-user-stream:${recipient.id}-${me.id}`, 'message'],
			[`talk-user-stream:${me.id}-${recipient.id}`, 'message']
		].forEach(([channel, type]) => {
			publishStream(channel, JSON.stringify({
				type: type,
				value: {
					id: createdMessage.id,
					userId: me.id,
					text: createdMessage.text
				}
			}));
		});

		// 履歴を作成しておく(自分)
		TalkUserHistory.findOne({
			type: 'user',
			user: me.id,
			recipient: recipient.id
		}, (findHistoryErr: any, history: ITalkUserHistory) => {
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
		}, (findHistoryErr: any, history: ITalkUserHistory) => {
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
	});
}
