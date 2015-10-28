import {IAlbumFile} from '../../models/albumFile';
import {IUser} from '../../models/user';
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
export default function(app: IApplication, user: IUser, fileName: string, mimetype: string, file: Buffer, size: number)
		: Promise<IAlbumFile> {
	'use strict';
	
	return new Promise((resolve: (albumFile: IAlbumFile) => void, reject: (err: any) => void) => {
		const appId: string = app !== null ? app.id : null;
		add(appId, user.id, fileName, mimetype, file, size).then((albumFile: IAlbumFile) => {
			resolve(albumFile);
		}, (err: any) => {
			reject(err);
		});
	});
}
