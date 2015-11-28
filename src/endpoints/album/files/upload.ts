import {IApplication, IUser, IAlbumFile} from '../../../interfaces';
import add from '../../../core/add-file-to-album';

/**
 * アルバムにファイルを追加します
 * @param app API利用App
 * @param user API利用ユーザー
 * @param fileName ファイル名
 * @param mimetype ファイルの種類
 * @param file 内容
 * @param unconditional trueに設定すると、ハッシュが同じファイルが見つかった場合でも無視してアルバムに登録します
 */
export default function upload(
	app: IApplication,
	user: IUser,
	fileName: string,
	mimetype: string,
	file: Buffer,
	size: number,
	unconditional: boolean = false)
		: Promise<Object> {
	'use strict';
	if (fileName.length > 100) {
		return <Promise<any>>Promise.reject('too-long-filename');
	} else {
		return new Promise<Object>((resolve, reject) => {
			const appId = app !== null ? app.id : null;
			add(appId, user.id, fileName, mimetype, file, size, unconditional).then((createdFile: IAlbumFile) => {
				resolve(createdFile.toObject());
			}, (err: any) => {
				reject(err);
			});
		});
	}
}
