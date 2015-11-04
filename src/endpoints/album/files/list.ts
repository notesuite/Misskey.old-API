import {AlbumFile, AlbumFolder} from '../../../models';
import {IUser, IAlbumFile, IAlbumFolder} from '../../../interfaces';

/**
 * アルバムのファイルを取得します
 * @user: API利用ユーザー
 * @folderId: 対象フォルダID(nullでルート)
 * @includeFolders: フォルダを含めるか
 */
export default function(user: IUser, folderId: string = null, includeFolders = true)
		: Promise<Object[]> {
	'use strict';

	return new Promise((resolve: (files: Object[]) => void, reject: (err: any) => void) => {
		AlbumFile.find({$and: [{user: user.id}, {folder: folderId}]}, (filesFindErr: any, files: IAlbumFile[]) => {
			if (filesFindErr !== null) {
				return reject(filesFindErr);
			}
			if (includeFolders) {
				AlbumFolder.find({$and: [{user: user.id}, {parent: folderId}]}, (foldersFindErr: any, folders: IAlbumFolder[]) => {
					if (foldersFindErr !== null) {
						return reject(foldersFindErr);
					}
					const fileObjs: Object[] = files.map((file: IAlbumFile) => {
						const obj: any = file.toObject();
						obj.type = 'file';
						return obj;
					});
					const folderObjs: Object[] = folders.map((folder: IAlbumFolder) => {
						const obj: any = folder.toObject();
						obj.type = 'folder';
						return obj;
					});
					resolve(fileObjs.concat(folderObjs));
				});
			} else {
				resolve(files.map((file: IAlbumFile) => {
					return file.toObject();
				}));
			}
		});
	});
}
