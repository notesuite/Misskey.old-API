import {AlbumFile, Post, PhotoPost} from '../../models';
import {IApplication, IAlbumFile, IUser, IPost, IPhotoPost} from '../../interfaces';
import publishUserStream from '../../core/publish-user-stream';
import populateAll from '../../core/post-populate-all';
import serializePost from '../../core/serialize-post';
import savePostMentions from '../../core/save-post-mentions';
import extractHashtags from '../../core/extract-hashtags';
import registerHashtags from '../../core/register-hashtags';

/**
 * PhotoPostを作成します
 * @param app API利用App
 * @param user API利用ユーザー
 * @param photos 添付する写真のIDの配列
 * @param text 本文
 * @param inReplyToPostId 返信先投稿のID
 */
export default function photo(app: IApplication, user: IUser, photos: string[], text: string = null, inReplyToPostId: string = null)
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
			const hashtags: string[] = extractHashtags(text);
			PhotoPost.create({
				type: 'photo',
				app: app !== null ? app.id : null,
				user: user.id,
				inReplyToPost: inReplyToPostId,
				photos,
				text,
				hashtags
			}, (createErr: any, createdPhotoPost: IPhotoPost) => {
				if (createErr !== null) {
					reject(createErr);
				} else {
					populateAll(createdPhotoPost).then((populated: Object) => {
						serializePost(populated, user).then((serialized: Object) => {
							resolve(serialized);
						}, (serializeErr: any) => {
							reject(serializeErr);
						});
					}, (populateErr: any) => {
						reject(populateErr);
					});

					user.postsCount++;
					user.save();

					registerHashtags(hashtags);

					if (reply !== null) {
						reply.repliesCount++;
						reply.save();
					}

					savePostMentions(createdPhotoPost, text);

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
