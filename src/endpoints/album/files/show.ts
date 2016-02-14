import {AlbumFile} from '../../../db/db';
import {IUser, IAlbumFile} from '../../../db/interfaces';

/**
 * アルバムのファイルを取得します
 * @param user API利用ユーザー
 * @param fileId 対象のファイルID
 * @return ファイルオブジェクト
 */
export default function(user: IUser, fileId: string): Promise<Object> {
	return new Promise<Object>((resolve, reject) => {
		AlbumFile
		.findById(fileId)
		.populate('tags')
		.exec((findErr: any, file: IAlbumFile) => {
			if (findErr !== null) {
				reject(findErr);
			} else if (file === null) {
				reject('file-not-found');
			} else if (file.user.toString() !== user.id) {
				reject('file-not-found');
			} else {
				resolve(file.toObject());
			}
		});
	});
}
