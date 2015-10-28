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
export default function(app: IApplication, userId: string, fileName: string, mimetype: string, file: Buffer, size: number)
		: Promise<IAlbumFile> {
	'use strict';

	return new Promise((resolve: (albumFile: IAlbumFile) => void, reject: (err: any) => void) => {
		AlbumFile.find({user: userId}, (albumFilesFindErr: any, albumFiles: IAlbumFile[]) => {
			if (albumFilesFindErr !== null) {
				reject(albumFilesFindErr);
				return;
			}

			// 現時点でのアルバム使用量を取得(byte)
			const used = albumFiles.length > 0
				? albumFiles.map((albumFile: IAlbumFile) => {
					return albumFile.dataSize;
				}).reduce((x: number, y: number) => { return x + y; })
				: 0;

			if (used + size > 100000000) { // 100MBを超える場合
				reject('no-free-space-of-album');
			} else {
				// ファイルをサーバーにアップロード
				upload(fileName, file).then((path: string) => {
					// AlbumFileドキュメントを作成
					AlbumFile.create({
						app: app !== null ? app.id : null,
						user: userId,
						dataSize: size,
						mimeType: mimetype,
						name: fileName,
						serverPath: path,
						hash: null // TODO
					}, (albumFileCreateErr: any, albumFile: IAlbumFile) => {
						if (albumFileCreateErr !== null) {
							reject(albumFileCreateErr);
						} else {
							resolve(albumFile);
						}
					});
				}, (err: any) => {
					reject(err);
				});
			}
		});
	});
}
