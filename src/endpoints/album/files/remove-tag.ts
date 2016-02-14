import {AlbumFile} from '../../../db/db';
import {IUser, IAlbumFile} from '../../../db/interfaces';

export default function(user: IUser, fileId: string, tagId: string): Promise<Object> {
	return new Promise<Object>((resolve, reject) => {
		AlbumFile.findOne({
			_id: fileId,
			user: user.id
		}, (findErr: any, file: IAlbumFile) => {
			if (findErr !== null) {
				return reject(findErr);
			} else if (file === null) {
				return reject('file-not-found');
			}
			file.tags = (<any[]>file.tags).filter(tag2 => tag2.toString() !== tagId);
			file.markModified('tags');
			file.save((err: any) => {
				if (err !== null) {
					return reject(err);
				}

				resolve(file.toObject());
			});
		});
	});
}
