import {List, Match} from 'powerful';
const isEmpty = List.isEmpty;
import {AlbumFile} from '../../../db/db';
import {IUser, IAlbumFile} from '../../../db/interfaces';

/**
 * アルバムのファイル ストリームを取得します
 * @param user API利用ユーザー
 * @param folderId 対象フォルダID(nullでルート)
 * @param limit 取得するファイルの最大数
 * @param sinceCursor 取得するファイルを、設定されたカーソルよりも大きなカーソルを持つもののみに制限します
 * @param maxCursor 取得するファイルを、設定されたカーソルよりも小さなカーソルを持つもののみに制限します
 * @return ファイルオブジェクト
 */
export default function(
	user: IUser,
	folderId: string = null,
	limit: number = 50,
	sinceCursor: number = null,
	maxCursor: number = null
): Promise<Object[]> {
	return new Promise<Object[]>((resolve, reject) => {

		const query = Object.assign({
			user: user.id,
			folder: folderId,
			isHidden: false,
			isDeleted: false
		}, new Match<void, any>(null)
			.when(() => sinceCursor !== null, () => {
				return { cursor: { $gt: sinceCursor } };
			})
			.when(() => maxCursor !== null, () => {
				return { cursor: { $lt: maxCursor } };
			})
			.getValue({})
		);

		AlbumFile
		.find(query)
		.sort({createdAt: -1})
		.limit(limit)
		.populate('tags')
		.exec((err: any, files: IAlbumFile[]) => {
			if (err !== null) {
				return reject(err);
			} else if (isEmpty(files)) {
				return resolve([]);
			}
			resolve(files.map<Object>(file => file.toObject()));
		});
	});
}
