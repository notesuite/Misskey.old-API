import {PhotoPost} from '../../models';
import {IApplication, IUser, IPhotoPost} from '../../interfaces';
import publishUserStream from '../../core/publishUserStream';

/**
 * PhotoPostを作成します
 * @app: API利用App
 * @user: API利用ユーザー
 * @photos: 添付する写真のIDの配列
 * @text: 本文
 * @inReplyToPostId: 返信先投稿のID
 */
export default function(app: IApplication, user: IUser, photos: string[], text: string, inReplyToPostId: string = null)
		: Promise<Object> {
	'use strict';

	const maxTextLength: number = 300;
	text = text.trim();

	if (text.length > maxTextLength) {
		return <Promise<any>>Promise.reject('too-long-text');
	}

	return new Promise<Object>((resolve, reject) => {
		if (inReplyToPostId !== null) {
			// リプライ先に指定されている投稿が実在するかチェック
			StatusPost.findById(inReplyToPostId, (err: any, reply: IStatusPost) => {
				if (err !== null) {
					reject(err);
				} else if (reply === null) {
					reject('reply-source-not-found');
				} else if (reply.isDeleted) {
					reject('reply-source-not-found');
				} else {
					checkPhotos();
				}
			});
		} else {
			checkPhotos();
		}
		
		function checkPhotos() {

		}
		
		function create() {
			PhotoPost.create({
				type: 'photo',
				app: app !== null ? app.id : null,
				user: user.id,
				inReplyToPost: inReplyToPostId,
				text
			}, (createErr: any, createdStatus: IStatusPost) => {
				if (createErr !== null) {
					reject(createErr);
				} else {
					resolve(createdStatus.toObject());
	
					user.postsCount++;
					user.save();
	
					publishUserStream(user.id, {
						type: 'post',
						value: {
							id: createdStatus.id
						}
					});
				}
			});
		}
	});
}