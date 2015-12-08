import { List } from 'powerful';
const isEmpty = List.isEmpty;
import {Post, PhotoPost} from '../../models';
import {IApplication, IUser, IPost, IPhotoPost} from '../../interfaces';
import publishUserStream from '../../core/publish-user-stream';
import populateAll from '../../core/post-populate-all';
import serializePost from '../../core/serialize-post';
import savePostMentions from '../../core/save-post-mentions';
import extractHashtags from '../../core/extract-hashtags';
import registerHashtags from '../../core/register-hashtags';
import getAlbumFile from '../../core/get-album-file';

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

	const maxTextLength = 300;
	if (text !== null) {
		text = text.trim();

		if (text.length > maxTextLength) {
			return <Promise<any>>Promise.reject('too-long-text');
		}
	}

	if (photos === undefined || photos === null || isEmpty(photos)) {
		return <Promise<any>>Promise.reject('photos-required');
	}

	if (photos.length > 4) {
		return <Promise<any>>Promise.reject('too-many-photos');
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
			Promise.all(photos.map(photo => getAlbumFile(user.id, photo)))
			.then(photoFiles => {
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
					populateAll(createdPhotoPost).then(populated => {
						serializePost(populated, user).then(serialized => {
							resolve(serialized);
						}, (serializeErr: any) => {
							reject(serializeErr);
						});
					}, (populateErr: any) => {
						reject(populateErr);
					});

					user.postsCount++;
					user.save();

					registerHashtags(user, hashtags);

					if (reply !== null) {
						reply.repliesCount++;
						reply.save();
					}

					savePostMentions(user, createdPhotoPost, text);

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
