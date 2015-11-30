import * as crypto from 'crypto';
import * as request from 'request';
import {AlbumFile} from '../models';
import {IAlbumFile} from '../interfaces';
import config from '../config';

/**
 * アルバムにファイルを追加します
 * @param appId 経由AppのID
 * @param userId 利用ユーザーのID
 * @param fileName ファイル名
 * @param mimetype ファイルのMIME Type
 * @param file 内容
 * @param size ファイルサイズ(byte)
 * @param unconditional trueに設定すると、ハッシュが同じファイルが見つかった場合でも無視してアルバムに登録します
 */
export default function addFileToAlbum(
	appId: string,
	userId: string,
	fileName: string,
	mimetype: string,
	file: Buffer,
	size: number,
	unconditional: boolean = false
): Promise<IAlbumFile> {
	'use strict';

	// ハッシュ生成
	const hash: string = crypto
		.createHash('sha256')
		.update(file)
		.digest('hex');

	return new Promise<IAlbumFile>((resolve, reject) => {
		if (!unconditional) {
			// 同じハッシュ(と同じファイルサイズ)を持つファイルが既に存在するか確認
			AlbumFile.findOne({
				user: userId,
				hash: hash,
				dataSize: size
			}, (hashmuchFileFindErr: any, hashmuchFile: IAlbumFile) => {
				if (hashmuchFileFindErr !== null) {
					return reject('something-happend');
				}

				// 無かったら新規登録
				if (hashmuchFile === null) {
					register();
				} else {
					// あったら登録せずにそれを返却
					resolve(hashmuchFile);
				}
			});
		} else {
			// unconditionalがtrueの場合は強制登録
			register();
		}

		function register(): void {
			// アルバム使用量を取得するためにすべてのファイルを取得
			AlbumFile.find({user: userId}, (albumFilesFindErr: any, albumFiles: IAlbumFile[]) => {
				if (albumFilesFindErr !== null) {
					return reject(albumFilesFindErr);
				}

				// 現時点でのアルバム使用量を算出(byte)
				const used = albumFiles.map(albumFile => albumFile.dataSize).reduce((x, y) => x + y, 0);

				// 100MBを超える場合
				if (used + size > ((1024 * 1024) * 100)) {
					return reject('no-free-space-of-album');
				}

				// AlbumFileドキュメントを作成
				AlbumFile.create({
					app: appId !== null ? appId : null,
					user: userId,
					dataSize: size,
					mimeType: mimetype,
					name: fileName,
					serverPath: null,
					hash: hash
				}, (albumFileCreateErr: any, albumFile: IAlbumFile) => {
					if (albumFileCreateErr !== null) {
						return reject(albumFileCreateErr);
					}
					// ファイルをサーバーにアップロード
					request.post({
						url: `http://${config.fileServer.ip}:${config.fileServer.port}/register`,
						formData: {
							'file-id': albumFile.id,
							'passkey': config.fileServer.passkey,
							file: {
								value: file,
								options: {
									filename: fileName
								}
							}
						}
					}, (uploadErr: any, _: any, path: any) => {
						if (uploadErr !== null) {
							return reject(uploadErr);
						}
						// 最終的にファイルが登録されたサーバーのパスを保存
						albumFile.serverPath = path;
						albumFile.save((saveErr: any, saved: IAlbumFile) => {
							if (saveErr !== null) {
								return reject(saveErr);
							}
							resolve(saved);
						});
					});
				});
			});
		}
	});
}
