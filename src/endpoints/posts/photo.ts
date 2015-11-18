import {AlbumFile, Post, PhotoPost} from '../../models';
import {IApplication, IAlbumFile, IUser, IPost, IPhotoPost} from '../../interfaces';
import publishUserStream from '../../core/publishUserStream';
import populateAll from '../../core/postPopulateAll';

/**
 * PhotoPostを作成します
 * @app: API利用App
 * @user: API利用ユーザー
 * @photos: 添付する写真のIDの配列
 * @text: 本文
 * @inReplyToPostId: 返信先投稿のID
 */
export default function(app: IApplication, user: IUser, photos: string[], text: string = null, inReplyToPostId: string = null)
		: Promise<Object> {
	'use strict';

	const maxTextLength: number = 300;
	if (text !== null) {
		text = text.trim();

		if (text.length > maxTextLength) {
			return <Promise<any>>Promise.reject('too-long-text');
		}
	}

	if (photos === undefined || photos === null || photos.length === 0) {
		return <Promise<any>>Promise.reject('photos-required');
	}

	return new Promise<Object>((resolve, reject) => {
		if (inReplyToPostId !== null) {
			// リプライ先に指定されている投稿が実在するかチェック
			Post.findById(inReplyToPostId, (err: any, reply: IPost) => {
				if (err !== null) {
					reject(err);
				} else if (reply === null) {
					reject('reply-source-not-found');
				} else if (reply.isDeleted) {
					reject('reply-source-not-found');
				} else if (reply.type === 'repost') {
					reject('reply-to-repost-is-not-allowed');
				} else {
					checkPhotos(reply);
				}
			});
		} else {
			checkPhotos();
		}

		function checkPhotos(reply: IPost = null): void {
			Promise.all(photos.map((photo: string) => {
				return new Promise<Object>((checkFileResolve, checkFileReject) => {
					AlbumFile.findById(photo, (findErr: any, file: IAlbumFile) => {
						if (findErr !== null) {
							checkFileReject(findErr);
						} else if (file === null) {
							checkFileReject('file-not-found');
						} else if (file.user.toString() !== user.id.toString()) {
							checkFileReject('file-not-found');
						} else if (file.isDeleted) {
							checkFileReject('file-not-found');
						} else {
							checkFileResolve(file);
						}
					});
				});
			})).then((photoFiles: IAlbumFile[]) => {
				create(reply);
			}, (photosCheckErr: any) => {
				reject(photosCheckErr);
			});
		}

		function create(reply: IPost = null): void {
			PhotoPost.create({
				type: 'photo',
				app: app !== null ? app.id : null,
				user: user.id,
				inReplyToPost: inReplyToPostId,
				photos,
				text
			}, (createErr: any, createdPhotoPost: IPhotoPost) => {
				if (createErr !== null) {
					reject(createErr);
				} else {
					populateAll(createdPhotoPost, false).then((populated: Object) => {
						resolve(populated);
					}, (populateErr: any) => {
						reject(populateErr);
					});

					user.postsCount++;
					user.save();

					if (reply !== null) {
						reply.repliesCount++;
						reply.save();
					}

					publishUserStream(user.id, {
						type: 'post',
						value: {
							id: createdPhotoPost.id
						}
					});
				}
			});
		}
	});
}
