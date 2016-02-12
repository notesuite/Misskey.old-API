import {AlbumFolder} from '../../../db/db';
import {IUser, IAlbumFolder} from '../../../db/interfaces';

/**
 * アルバムのフォルダを取得します
 * @param user API利用ユーザー
 * @param folderId 対象のフォルダID
 * @return フォルダオブジェクト
 */
export default function(user: IUser, folderId: string): Promise<Object> {
	return new Promise<Object>((resolve, reject) => {
		AlbumFolder.findById(folderId, (findErr: any, folder: IAlbumFolder) => {
			if (findErr !== null) {
				reject(findErr);
			} else if (folder === null) {
				reject('folder-not-found');
			} else if (folder.user.toString() !== user.id) {
				reject('folder-not-found');
			} else {
				let folderObj: any = folder.toObject();
				if (folder.parent === null) {
					resolve(folderObj);
				} else {
					get(<string>folder.parent).then((parent: Object) => {
						folderObj.parent = parent;
						resolve(folderObj);
					});
				}
			}
		});
	});
}

function get(id: string): Promise<Object> {
	return new Promise<Object>((resolve, reject) => {
		AlbumFolder.findById(id, (err: any, folder: IAlbumFolder) => {
			if (err !== null) {
				reject(err);
			} else if (folder.parent === null) {
				resolve(folder.toObject());
			} else {
				get(<string>folder.parent).then(parent => {
					let folderObj: any = folder.toObject();
					folderObj.parent = parent;
					resolve(folderObj);
				}, (getErr: any) => {
					reject(getErr);
				});
			}
		});
	});
}
