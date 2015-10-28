import {IAlbumFile} from '../../models/albumFile';
import {IApplication} from '../../models/application';
import add from '../../core/addFileToAlbum';

/**
 * アルバムにファイルを追加します
 * @app: API利用App
 * @user: API利用ユーザー
 * @fileName: ファイル名
 * @mimetype: ファイルの種類
 * @file: 内容
 */
export default function(app: IApplication, userId: string, fileName: string, mimetype: string, file: Buffer, size: number)
		: Promise<IAlbumFile> {
	'use strict';

	return new Promise((resolve: (albumFile: IAlbumFile) => void, reject: (err: any) => void) => {
		add(app.id, userId, fileName, mimetype, file, size).then((albumFile: IAlbumFile) => {
			resolve(albumFile);
		}, (err: any) => {
			reject(err);
		});
	});
}
