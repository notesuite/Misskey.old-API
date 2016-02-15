import {AlbumFile, AlbumTag} from '../../../db/db';
import {IUser, IAlbumFile, IAlbumTag} from '../../../db/interfaces';

export default function(user: IUser, fileId: string, tagsString: string): Promise<Object> {
	return new Promise<Object>((resolve, reject) => {
		if (tagsString !== undefined && tagsString !== null) {
			const tagIds = tagsString
				.split(',')
				.map(tagId => tagId.trim())
				.filter(tagId => tagId !== '')
				.filter((x, i, self) => self.indexOf(x) === i);

			if (tagIds.length > 0) {
				Promise.all(tagIds.map(tagId => new Promise<void>((resolve2, reject2) => {
					AlbumTag.findById(tagId, (tagFindErr: any, tag: IAlbumTag) => {
						if (tagFindErr !== null) {
							reject2(tagFindErr);
						} else if (tag === null) {
							reject2('tag-not-found');
						} else if (tag.user.toString() !== user.id.toString()) {
							reject2('tag-not-found');
						} else {
							resolve2();
						}
					});
				})))
				.then(files => {
					update(tagIds);
				}, (err: any) => {
					reject(err);
				});
			} else {
				update([]);
			}
		} else {
			update([]);
		}

		function update(tags: any[]): void {
			AlbumFile.findOne({
				_id: fileId,
				user: user.id
			}, (findErr: any, file: IAlbumFile) => {
				if (findErr !== null) {
					return reject(findErr);
				} else if (file === null) {
					return reject('file-not-found');
				}

				file.tags = tags;
				file.markModified('tags');
				file.save((err: any) => {
					if (err !== null) {
						return reject(err);
					}

					resolve(file.toObject());
				});
			});
		}
	});
}
