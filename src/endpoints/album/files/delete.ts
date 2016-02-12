import * as request from 'request';
import {AlbumFile} from '../../../db/db';
import {IUser, IAlbumFile} from '../../../db/interfaces';
import config from '../../../config';

/**
 * アルバムのファイルを削除します
 * @param user API利用ユーザー
 * @param fileId 対象のファイルID
 * @return ファイルオブジェクト
 */
export default function(user: IUser, fileId: string): Promise<Object> {
	return new Promise<Object>((resolve, reject) => {
		AlbumFile.findById(fileId, (findErr: any, file: IAlbumFile) => {
			if (findErr !== null) {
				reject(findErr);
			} else if (file === null) {
				reject('file-not-found');
			} else if (file.user.toString() !== user.id) {
				reject('file-not-found');
			} else {
				request.del({
					url: `http://${config.fileServer.ip}:${config.fileServer.port}/delete`,
					form: {
						passkey: config.fileServer.passkey,
						path: file.serverPath
					}
				}, (err: any, _: any, res: any) => {
					if (err !== null) {
						return reject(err);
					}
					file.isDeleted = true;
					file.save((saveErr: any, saved: IAlbumFile) => {
						if (saveErr !== null) {
							return reject(saveErr);
						}
						resolve(saved.toObject());
					});
				});
			}
		});
	});
}
