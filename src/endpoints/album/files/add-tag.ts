import {AlbumFile, AlbumTag} from '../../../db/db';
import {IUser, IAlbumFile, IAlbumTag} from '../../../db/interfaces';

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
			AlbumTag.findById(tagId, (tagFindErr: any, tag: IAlbumTag) => {
				if (tagFindErr !== null) {
					return reject(tagFindErr);
				} else if (tag === null) {
					return reject('tag-not-found');
				} else if (tag.user.toString() !== user.id.toString()) {
					return reject('tag-not-found');
				}

				if ((<any[]>file.tags).filter(tag2 => tag2.toString() === tag.id.toString()).length !== 0) {
					return reject('already-added-tag');
				}

				(<any[]>file.tags).push(tag.id);
				file.markModified('tags');
				file.save((err: any) => {
					if (err !== null) {
						return reject(err);
					}

					resolve(file.toObject());
				});
			});
		});
	});
}
