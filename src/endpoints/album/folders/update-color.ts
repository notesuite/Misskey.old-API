import {AlbumFolder} from '../../../db/db';
import {IUser, IAlbumFolder} from '../../../db/interfaces';
import {isColor} from '../../../spec/user';

export default function(user: IUser, folderId: string, color: string): Promise<Object> {
	if (!isColor(color)) {
		return <Promise<any>>Promise.reject('invalid-format');
	}

	return new Promise<Object>((resolve, reject) => {
		AlbumFolder.findOne({
			_id: folderId,
			user: user.id
		}, (folderFindErr: any, folder: IAlbumFolder) => {
			if (folderFindErr !== null) {
				reject(folderFindErr);
			} else if (folder === null) {
				reject('folder-not-found');
			} else {
				folder.color = color;
				folder.save((saveErr: any, recolored: IAlbumFolder) => {
					if (saveErr !== null) {
						return reject(saveErr);
					}
					resolve(recolored.toObject());
				});
			}
		});
	});
}
