import {TalkUserMessage, TalkUserHistory, User} from '../../../../models';
import {ITalkUserMessage, ITalkUserHistory, IApplication, IUser} from '../../../../interfaces';
import getAlbumFile from '../../../../core/get-album-file';
import publishStream from '../../../../core/publish-streaming-message';

/**
 * Talkを作成します
 * @param app API利用App
 * @param user API利用ユーザー
 * @param otherpartyId 宛先のユーザーのID
 * @param text 本文
 * @param fileId 添付ファイルのID
 */
export default function(
	app: IApplication,
	user: IUser,
	otherpartyId: string,
	text: string,
	fileId: string = null
): Promise<Object> {
	'use strict';

	const maxTextLength = 500;
	text = text.trim();

	if (otherpartyId === '')  {
		return <Promise<any>>Promise.reject('empty-otherparty-id');
	}

	if (otherpartyId === user.id.toString())  {
		return <Promise<any>>Promise.reject('no-yourself');
	}

	// ファイルが添付されていないかつテキストも空だったらエラー
	if (fileId === null && (text === '' || text === null || text === '')) {
		return <Promise<any>>Promise.reject('empty-text');
	}

	if (text.length > maxTextLength) {
		return <Promise<any>>Promise.reject('too-long-text');
	}

	return new Promise<Object>((resolve, reject) => {
		// 作成する対象のユーザーが実在するかチェック
		User.findById(otherpartyId, (checkErr: any, otherparty: IUser) => {
			if (checkErr !== null) {
				return reject(checkErr);
			} else if (otherparty === null) {
				return reject('otherpary-notfound');
			}

			if (fileId !== null) {
				getAlbumFile(user.id, fileId).then(file => {
					create();
				}, reject);
			} else {
				create();
			}
		});

		function create(): void {
			TalkUserMessage.create({
				type: 'user-message',
				user: user.id,
				otherparty: otherpartyId,
				text,
				file: fileId
			}, (createErr: any, createdMessage: ITalkUserMessage) => {
				if (createErr !== null) {
					return reject(createErr);
				}

				resolve(createdMessage.toObject());

				// ストリーミングメッセージ
				[
					[`user-stream:${otherpartyId}`, 'talk-user-message'],
					[`talk-user-stream:${otherpartyId}-${user.id}`, 'otherparty-message'],
					[`talk-user-stream:${user.id}-${otherpartyId}`, 'me-message']
				].forEach(([channel, type]) => {
					publishStream(channel, JSON.stringify({
						type: type,
						value: {
							id: createdMessage.id,
							userId: user.id,
							text: createdMessage.text
						}
					}));
				});

				// 履歴を作成しておく(自分)
				TalkUserHistory.findOne({
					type: 'user',
					user: user.id,
					otherparty: otherpartyId
				}, (findHistoryErr: any, history: ITalkUserHistory) => {
					if (findHistoryErr !== null) {
						return;
					}
					if (history === null) {
						TalkUserHistory.create({
							type: 'user',
							user: user.id,
							otherparty: otherpartyId,
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
					user: otherpartyId,
					otherparty: user.id
				}, (findHistoryErr: any, history: ITalkUserHistory) => {
					if (findHistoryErr !== null) {
						return;
					}
					if (history === null) {
						TalkUserHistory.create({
							type: 'user',
							user: otherpartyId,
							otherparty: user.id,
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
	});
}
