import {AlbumFile, AlbumFolder} from '../../../models';
import {IUser, IAlbumFile, IAlbumFolder} from '../../../interfaces';

export default function(user: IUser, fileId: string, name: string): Promise<Object> {
	'use strict';

	return new Promise<Object>((resolve, reject) => {
		AlbumFile.findById(fileId, (findErr: any, file: IAlbumFile) => {
			if (findErr !== null) {
				reject(findErr);
			} else if (file === null) {
				reject('file-not-found');
			} else if (file.user.toString() !== user.id) {
				reject('file-not-found');
			} else {
				file.name = name;
			}
		});
	});
}
