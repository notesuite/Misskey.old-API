import {AlbumFolder} from '../../../db/db';
import {IUser, IAlbumFolder} from '../../../db/interfaces';

/**
 * アルバムのフォルダ一覧を取得します
 * @param user API利用ユーザー
 * @param folderId 対象フォルダID(nullでルート)
 * @return フォルダオブジェクトの配列
 */
export default function(user: IUser, folderId: string = null): Promise<Object[]> {
	return new Promise<Object[]>((resolve, reject) => {
		AlbumFolder.find({
			user: user.id,
			parent: folderId
		}, (foldersFindErr: any, folders: IAlbumFolder[]) => {
			if (foldersFindErr !== null) {
				return reject(foldersFindErr);
			}
			resolve(folders.map<Object>(folder => folder.toObject()));
		});
	});
}
