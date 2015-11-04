import {AlbumFile, AlbumFolder} from '../../../models';
import {IUser, IAlbumFile, IAlbumFolder} from '../../../interfaces';

export default function(user: IUser, fileId: string, name: string): Promise<Object[]> {
	'use strict';

	return new Promise<Object[]>((resolve, reject) => {
		AlbumFile.findById(fileId, (findErr: any, file: IFile) => {
		});
	});
}
