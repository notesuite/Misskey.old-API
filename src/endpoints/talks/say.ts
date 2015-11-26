import {TalkMessage, TalkHistory, User} from '../../models';
import {ITalkMessage, ITalkHistory, IApplication, IUser} from '../../interfaces';
/**
 * Talkを作成します
 * @param app API利用App
 * @param user API利用ユーザー
 * @param otherpartyId Talkを作成する対象のユーザー
 * @param text 本文
 */
export default function say(app: IApplication, user: IUser, otherpartyId: string, text: string)
		: Promise<Object> {
	'use strict';

	const maxTextLength: number = 300;
	text = text.trim();

	if (text === "") {
		return <Promise<any>>Promise.reject('empty-text');
	}

	if (text.length > maxTextLength) {
		return <Promise<any>>Promise.reject('too-long-text');
	}

	if (otherpartyId === "")  {
		return <Promise<any>>Promise.reject('empty-otherparty-id');
	}

	return new Promise<Object>((resolve, reject) => {
		// 作成する対象のユーザーが実在するかチェック
		User.findById(otherpartyId, (checkErr: any, otherparty: IUser) => {
			if (checkErr !== null) {
				reject(checkErr);
			} else if (otherparty === null) {
				reject('otherpary-notfound');
			} else {
				TalkMessage.create({
					app: app !== null ? app.id : null,
					user: user.id,
					otherparty: otherparty.id,
					text
				}, (createErr: any, createdMessage: ITalkMessage) => {
					if (createErr !== null) {
						reject(createErr);
					} else {
						TalkHistory.create({
							message: createdMessage.id,
							otherparty: otherparty.id,
							user: user.id
						}, (addErr: any, createdHistory: ITalkHistory) => {
							if (addErr !== null) {
								reject(addErr);
							} else {
								resolve(createdMessage.toObject());
							}
						});
					}
				});
			}
		});
	});
}
