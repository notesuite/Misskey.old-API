import * as request from 'request';
import {AlbumFile, IAlbumFile} from '../models/albumFile';
import config from '../config';

/**
 * アルバムにファイルを追加します
 * @appId 経由AppのID
 * @userId 利用ユーザーのID
 * @fileName ファイル名
 * @mimetype ファイルのMIME Type
 * @file 内容
 * @size ファイルサイズ(byte)
 */
export default function(appId: string, userId: string, fileName: string, mimetype: string, file: Buffer, size: number)
		: Promise<IAlbumFile> {
	'use strict';

	return new Promise((resolve: (albumFile: IAlbumFile) => void, reject: (err: any) => void) => {

		// アルバム使用量を取得するためにすべてのファイルを取得
		AlbumFile.find({user: userId}, (albumFilesFindErr: any, albumFiles: IAlbumFile[]) => {
			if (albumFilesFindErr !== null) {
				reject(albumFilesFindErr);
				return;
			}

			// 現時点でのアルバム使用量を算出(byte)
			const used: number = albumFiles.length > 0
				? albumFiles.map((albumFile: IAlbumFile) => {
					return albumFile.dataSize;
				}).reduce((x: number, y: number) => { return x + y; })
				: 0;

			if (used + size > 100000000) { // 100MBを超える場合
				reject('no-free-space-of-album');
			} else { // 100MB以下
				// ファイルをサーバーにアップロード
				request.post({
					url: `http://${config.userContentsServer.ip}:${config.userContentsServer.port}/register`,
					formData: {
						passkey: config.userContentsServer.passkey,
						file: {
							value: file,
							options: {
								filename: fileName
							}
						}
					}
				}, (err: any, _: any, path: any) => {
					if (err !== null) {
						reject(err);
					} else {
						// AlbumFileドキュメントを作成
						AlbumFile.create({
							app: appId !== null ? appId : null,
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
					}
				});
			}
		});
	});
}
