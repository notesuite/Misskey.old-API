import {AlbumFile, AlbumFolder} from '../../../models';
import {IUser, IAlbumFile, IAlbumFolder} from '../../../interfaces';

export default function(user: IUser, parentFolderId: string, name: string = null): Promise<Object> {
	'use strict';

	return new Promise<Object>((resolve, reject) => {
		if (parentFolderId !== undefined && parentFolderId !== null) {
			AlbumFolder.findOne({
				_id: parentFolderId,
				user: user.id
			}, (folderFindErr: any, parent: IAlbumFolder) => {
				if (folderFindErr !== null) {
					reject(folderFindErr);
				} else if (parent === null) {
					reject('folder-not-found');
				} else {
					AlbumFolder.create({
						user: user.id,
						color: '#57aee5',
						parent: parent
					}, (createErr: any, folder: IAlbumFolder) => {
						if (createErr !== null) {
							return reject(createErr);
						}

						resolve(folder.toObject());
					});
				}
			});
		} else {
			AlbumFolder.create({
				user: user.id,
				color: '#57aee5'
			}, (createErr: any, folder: IAlbumFolder) => {
				if (createErr !== null) {
					return reject(createErr);
				}

				resolve(folder.toObject());
			});
		}
	});
}
