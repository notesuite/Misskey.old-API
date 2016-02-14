import {Match} from 'powerful';
import {AlbumFile} from '../../../db/db';
import {IUser, IAlbumFile} from '../../../db/interfaces';

/**
 * アルバムのファイル一覧を取得します
 * @param user API利用ユーザー
 * @param folderId 対象フォルダID(nullでルート)
 * @return ファイルオブジェクトの配列
 */
export default function(
	user: IUser,
	folderId: string = null,
	limit: number = 20,
	sinceCursor: number = null,
	maxCursor: number = null
): Promise<Object[]> {
	limit = parseInt(<any>limit, 10);

	if (limit < 1) {
		return <Promise<any>>Promise.reject('1 kara');
	} else if (limit > 100) {
		return <Promise<any>>Promise.reject('100 made');
	}

	return new Promise<Object[]>((resolve, reject) => {

		let sort: any = {createdAt: -1};
		const query = Object.assign({
			user: user.id,
			folder: folderId,
			isHidden: false,
			isDeleted: false
		}, new Match<void, any>(null)
			.when(() => sinceCursor !== null, () => {
				sort = {createdAt: 1};
				return { cursor: { $gt: sinceCursor } };
			})
			.when(() => maxCursor !== null, () => {
				return { cursor: { $lt: maxCursor } };
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
}
