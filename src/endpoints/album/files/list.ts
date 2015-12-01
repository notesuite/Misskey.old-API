import {AlbumFile, AlbumFolder} from '../../../models';
import {IUser, IAlbumFile, IAlbumFolder} from '../../../interfaces';

/**
 * アルバムのファイルを取得します
 * @param user API利用ユーザー
 * @param folderId 対象フォルダID(nullでルート)
 * @param includeFolders フォルダを含めるか
 */
export default function list(user: IUser, folderId: string = null, includeFolders = true): Promise<Object[]> {
	'use strict';

	return new Promise<Object[]>((resolve, reject) => {
		AlbumFile.find({$and: [{user: user.id}, {folder: folderId}]}, (filesFindErr: any, files: IAlbumFile[]) => {
			if (filesFindErr !== null) {
				return reject(filesFindErr);
			}
			if (includeFolders) {
				AlbumFolder.find({$and: [{user: user.id}, {parent: folderId}]}, (foldersFindErr: any, folders: IAlbumFolder[]) => {
					if (foldersFindErr !== null) {
						return reject(foldersFindErr);
					}
					const fileObjs: Object[] = files.map(file => Object.assign(file.toObject(), {
						type: 'file'
					}));
					const folderObjs: Object[] = folders.map(folder => Object.assign(folder.toObject(), {
						type: 'folder'
					}));
					resolve([...fileObjs, folderObjs]);
				});
			} else {
				resolve(files.map<Object>(file => file.toObject()));
			}
		});
	});
}
