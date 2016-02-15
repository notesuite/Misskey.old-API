import * as request from 'request';
import {AlbumFile} from '../../../db/db';
import {IUser, IAlbumFile} from '../../../db/interfaces';
import {isName} from '../../../spec/album-file';
import config from '../../../config';

/**
 * アルバムのファイルをリネームします
 * @param user API利用ユーザー
 * @param fileId 対象のファイルID
 * @param name 新しい名前
 * @return ファイルオブジェクト
 */
export default function(user: IUser, fileId: string, name: string): Promise<Object> {
	if (!isName(name)) {
		return <Promise<any>>Promise.reject('invalid-file-name');
	}

	return new Promise<Object>((resolve, reject) => {
		AlbumFile.findById(fileId, (findErr: any, file: IAlbumFile) => {
			if (findErr !== null) {
				reject(findErr);
			} else if (file === null) {
				reject('file-not-found');
			} else if (file.user.toString() !== user.id) {
				reject('file-not-found');
			} else {
				request.put({
					url: `http://${config.fileServer.ip}:${config.fileServer.port}/rename`,
					form: {
						passkey: config.fileServer.passkey,
						'old-path': file.serverPath,
						'new-name': name
					}
				}, (err: any, _: any, path: any) => {
					if (err !== null) {
						return reject(err);
					}
					file.name = name;
					file.serverPath = path;
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
