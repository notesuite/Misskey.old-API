import {AlbumFile, AlbumFolder} from '../../../models';
import {IUser, IAlbumFile, IAlbumFolder} from '../../../interfaces';

export default function(user: IUser, fileId: string, name: string)
		: Promise<Object[]> {
	'use strict';

	return new Promise((resolve: (renamedFile: Object) => void, reject: (err: any) => void) => {
		AlbumFile.findById(fileId, (findErr: any, file: IFile) => {
		});
	});
}
