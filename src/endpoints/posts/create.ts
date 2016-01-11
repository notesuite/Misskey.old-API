import {Status} from '../../models';
import {IApplication, IUser, IStatus, IAlbumFile} from '../../interfaces';
import publishUserStream from '../../core/publish-user-stream';
import serializePost from '../../core/serialize-post';
import savePostMentions from '../../core/save-post-mentions';
import extractHashtags from '../../core/extract-hashtags';
import registerHashtags from '../../core/register-hashtags';
import getAlbumFile from '../../core/get-album-file';

/**
 * 投稿を作成します
 * @param app API利用App
 * @param user API利用ユーザー
 * @param text 本文
 * @param filesString 添付するファイルのIDを,で区切った文字列
 * @return 作成された投稿オブジェクト
 */
export default function(
	app: IApplication,
	user: IUser,
	text?: string,
	filesString?: string
): Promise<Object> {
	'use strict';

	const maxTextLength = 300;
	const maxFileLength = 4;

	return new Promise<Object>((resolve, reject) => {
		// Init 'text' parameter
		if (text !== undefined && text !== null) {
			text = text.trim();
			if (text.length === 0) {
				text = null;
			} else if (text.length > maxTextLength) {
				return reject('too-long-text');
			}
		} else {
			text = null;
		}

		// Init 'filesString' parameter
		let fileIds: string[] = null;
		if (filesString !== undefined && filesString !== null) {
			fileIds = filesString
				.split(',')
				.map(fileId => fileId.trim())
				.filter(fileId => fileId !== '');
			if (fileIds.length === 0) {
				fileIds = null;
			} else if (fileIds.length > maxFileLength) {
				return reject('too-many-files');
			}
		} else {
			fileIds = null;
		}

		// テキストが無いかつ添付ファイルも無かったらエラー
		if (text === null && fileIds === null) {
			return reject('text-or-files-is-required');
		}

		// 添付ファイルがあれば添付ファイルのバリデーションを行う
		if (fileIds !== null) {
			Promise.all(fileIds.map(fileId => getAlbumFile(user.id, fileId)))
			.then(files => {
				create(files);
			}, (filesCheckErr: any) => {
				reject(filesCheckErr);
			});
		} else {
			create(null);
		}

		function create(files: IAlbumFile[]): void {
			// ハッシュタグ抽出
			const hashtags: string[] = extractHashtags(text);

			// 作成
			Status.create({
				app: app !== null ? app.id : null,
				user: user.id,
				files: files !== null ? files.map(file => file.id) : null,
				text: text,
				hashtags: hashtags
			}, (createErr: any, createdStatus: IStatus) => {
				if (createErr !== null) {
					return reject(createErr);
				}

				// Resolve promise
				serializePost(createdStatus, user).then(serialized => {
					resolve(serialized);
				}, (serializeErr: any) => {
					reject(serializeErr);
				});

				// 投稿数インクリメント
				user.postsCount++;
				user.save();

				// ハッシュタグをデータベースに登録
				registerHashtags(user, hashtags);

				// メンションを抽出してデータベースに登録
				savePostMentions(user, createdStatus, createdStatus.text);

				// Streaming
				publishUserStream(user.id, {
					type: 'post',
					value: {
						id: createdStatus.id
					}
				});
			});
		}
	});
}
