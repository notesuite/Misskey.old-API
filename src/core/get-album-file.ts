import {AlbumFile} from '../models';
import {IAlbumFile} from '../interfaces';

export default function getAlbumFile(
	meId: string,
	fileId: string
): Promise<IAlbumFile> {
	'use strict';

	return new Promise<IAlbumFile>((resolve, reject) => {
		AlbumFile.findById(fileId, (findErr: any, file: IAlbumFile) => {
			if (findErr !== null) {
				reject(findErr);
			} else if (file === null) {
				reject('file-not-found');
			} else if (file.user !== meId) {
				reject('file-not-found');
			} else if (file.isDeleted) {
				reject('file-not-found');
			} else {
				resolve(file);
			}
		});
	});
}
