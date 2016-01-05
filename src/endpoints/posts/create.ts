import { List } from 'powerful';
const isEmpty = List.isEmpty;
import {Post, StatusPost, PhotoPost} from '../../models';
import {IApplication, IUser, IPost, IStatusPost, IPhotoPost} from '../../interfaces';
import publishUserStream from '../../core/publish-user-stream';
import populateAll from '../../core/post-populate-all';
import serializePost from '../../core/serialize-post';
import savePostMentions from '../../core/save-post-mentions';
import extractHashtags from '../../core/extract-hashtags';
import registerHashtags from '../../core/register-hashtags';
import getAlbumFile from '../../core/get-album-file';

/**
 * 投稿を作成します
 * @param app API利用App
 * @param user API利用ユーザー
 * @param inReplyToPostId 返信先投稿のID
 * @param type 投稿のタイプ
 * @param text 本文
 * @return 作成された投稿オブジェクト
 */
export default function(
	app: IApplication,
	user: IUser,
	inReplyToPostId: string = null,
	type: string = 'text',
	text?: string,
	photos?: string
): Promise<Object> {
	'use strict';

	return new Promise<Object>((resolve, reject) => {
		switch (type) {
			case 'text':
				createTextPost(app, user, resolve, reject, inReplyToPostId, text);
				break;
			case 'photo':
				createPhotoPost(app, user, resolve, reject, inReplyToPostId, text, photos);
				break;
			default:
				reject('unknown-post-type');
				break;
		}
	});
}

function createTextPost(
	app: IApplication,
	user: IUser,
	resolve: any,
	reject: any,
	inReplyToPostId: string = null,
	text: string
): void {
	'use strict';

	const maxTextLength = 300;

	if (text === undefined || text === null) {
		return reject('text-is-required');
	}

	text = text.trim();

	if (isEmpty(text)) {
		return reject('empty-text');
	} else if (text.length > maxTextLength) {
		return reject('too-long-text');
	}

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
				create(reply);
			}
		});
	} else {
		create();
	}

	function create(reply: IPost = null): void {
		const hashtags = extractHashtags(text);
		StatusPost.create({
			type: 'status',
			app: app !== null ? app.id : null,
			user: user.id,
			inReplyToPost: inReplyToPostId,
			text,
			hashtags
		}, (createErr: any, createdStatus: IStatusPost) => {
			if (createErr !== null) {
				reject(createErr);
			} else {
				populateAll(createdStatus).then(populated => {
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

				if (reply !== null) {
					reply.repliesCount++;
					reply.save();
				}

				registerHashtags(user, hashtags);

				savePostMentions(user, createdStatus, text);

				publishUserStream(user.id, {
					type: 'post',
					value: {
						id: createdStatus.id
					}
				});
			}
		});
	}
}

function createPhotoPost(
	app: IApplication,
	user: IUser,
	resolve: any,
	reject: any,
	inReplyToPostId: string = null,
	text: string = null,
	photosStr: string
): void {
	'use strict';

	const maxTextLength = 300;

	if (text !== undefined && text !== null) {
		text = text.trim();
		if (text.length > maxTextLength) {
			return reject('too-long-text');
		}
	}

	if (photosStr === undefined || photosStr === null) {
		return reject('photos-required');
	}

	const photos: string[] = JSON.parse(photosStr);

	if (isEmpty(photos)) {
		return reject('photos-required');
	}

	if (photos.length > 4) {
		return reject('too-many-photos');
	}

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
}
