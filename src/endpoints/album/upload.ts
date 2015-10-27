import {AlbumFile, IAlbumFile} from '../../models/albumFile';
import {IApplication} from '../../models/application';
import upload from '../../core/uploadFileToContentsServer';

/**
 * アルバムにファイルを追加します
 * @app: API利用App
 * @user: API利用ユーザー
 * @fileName: ファイル名
 * @mimetype: ファイルの種類
 * @file: 内容
 */
export default function(app: IApplication, userId: string, fileName: string, mimetype: string, file: Buffer)
		: Promise<string> {
	'use strict';

	return new Promise((resolve: (path: string) => void, reject: (err: any) => void) => {
		upload(fileName, file).then((path: string) => {
			resolve(path);
		}, (err: any) => {
			reject(err);
		});
	});
}
