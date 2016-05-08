import {Match} from 'powerful';
import {AlbumFile, AlbumTag} from '../../../db/db';
import {IUser, IAlbumFile, IAlbumTag} from '../../../db/interfaces';

export default function(
	user: IUser,
	tagId: string,
	folderId: string = null,
	limit: number = 20,
	sinceId: number = null,
	maxId: number = null
): Promise<Object[]> {
	limit = parseInt(<any>limit, 10);

	if (limit < 1) {
		return <Promise<any>>Promise.reject('1 kara');
	} else if (limit > 100) {
		return <Promise<any>>Promise.reject('100 made');
	}

	return new Promise<Object[]>((resolve, reject) => {
		AlbumTag.findById(tagId, (tagFindErr: any, tag: IAlbumTag) => {
			if (tagFindErr !== null) {
				return reject(tagFindErr);
			} else if (tag === null) {
				return reject('tag-not-found');
			} else if (tag.user.toString() !== user.id.toString()) {
				return reject('tag-not-found');
			}

			let sort: any = {createdAt: -1};
			const query = Object.assign({
				user: user.id,
				tags: tag.id,
				folder: folderId,
				isHidden: false,
				isDeleted: false
			}, new Match<void, any>(null)
				.when(() => sinceId !== null, () => {
					sort = {createdAt: 1};
					return { _id: { $gt: sinceId } };
				})
				.when(() => maxId !== null, () => {
					return { _id: { $lt: maxId } };
				})
				.getValue({})
			);

			AlbumFile
			.find(query)
			.sort(sort)
			.limit(limit)
			.populate('tags')
			.exec(query, (filesFindErr: any, files: IAlbumFile[]) => {
				if (filesFindErr !== null) {
					return reject(filesFindErr);
				}
				resolve(files.map<Object>(file => file.toObject()));
			});
		});
	});
}
