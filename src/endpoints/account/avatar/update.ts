import {AlbumFile} from '../../../db/db';
import {IUser, IAlbumFile} from '../../../db/interfaces';

/**
 * ユーザーのアイコンを更新します
 * @param user: API利用ユーザー
 * @param fileId: アイコンに使用するファイルのID
 * @return ユーザーオブジェクト
 */
export default function(user: IUser, fileId: string): Promise<Object> {
	return new Promise<Object>((resolve, reject) => {
		AlbumFile.findById(fileId, (findErr: any, file: IAlbumFile) => {
			if (findErr !== null) {
				return reject(findErr);
			} else if (file === null) {
				return reject('file-not-found');
			} else if (file.user.toString() !== user.id.toString()) {
				return reject('file-not-found');
			} else if (file.isDeleted) {
				return reject('file-not-found');
			}
			user.avatar = file.id;
			user.avatarPath = file.serverPath;
			user.save((saveErr: any, saved: IUser) => {
				if (saveErr !== null) {
					reject(saveErr);
				} else {
					resolve(saved.toObject());
				}
			});
		});
	});
}
