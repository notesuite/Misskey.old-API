import {AlbumFile, AlbumFolder} from '../../../models';
import {IUser, IAlbumFile, IAlbumFolder} from '../../../interfaces';

export default function move(user: IUser, fileId: string, folderId: string): Promise<Object> {
	'use strict';

	return new Promise<Object>((resolve, reject) => {
		AlbumFile.findOne({
			_id: fileId,
			user: user.id
		}, (findErr: any, file: IAlbumFile) => {
			if (findErr !== null) {
				reject(findErr);
			} else if (file === null) {
				reject('file-not-found');
			} else {
				if (folderId !== null) {
					AlbumFolder.findOne({
						_id: folderId,
						user: user.id
					}, (folderFindErr: any, folder: IAlbumFolder) => {
						if (folderFindErr !== null) {
							reject(folderFindErr);
						} else if (folder === null) {
							reject('folder-not-found');
						} else {
							file.folder = folder.id;
							file.save((saveErr: any, moved: IAlbumFile) => {
								if (saveErr !== null) {
									return reject(saveErr);
								}
								resolve(moved.toObject());
							});
						}
					});
				} else {
					file.folder = null;
					file.save((saveErr: any, moved: IAlbumFile) => {
						if (saveErr !== null) {
							return reject(saveErr);
						}
						resolve(moved.toObject());
					});
				}
			}
		});
	});
}
