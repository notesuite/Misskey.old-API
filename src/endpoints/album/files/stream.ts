import {List, Match} from 'powerful';
const isEmpty = List.isEmpty;
import {AlbumFile} from '../../../db/db';
import {IUser, IAlbumFile} from '../../../db/interfaces';

/**
 * アルバムのファイル ストリームを取得します
 * @param user API利用ユーザー
 * @param folderId 対象フォルダID(nullでルート)
 * @param limit 取得するファイルの最大数
 * @param sinceId 取得するファイルを、設定されたカーソルよりも大きなカーソルを持つもののみに制限します
 * @param maxId 取得するファイルを、設定されたカーソルよりも小さなカーソルを持つもののみに制限します
 * @return ファイルオブジェクト
 */
export default function(
	user: IUser,
	folderId: string = null,
	limit: number = 50,
	sinceId: number = null,
	maxId: number = null
): Promise<Object[]> {
	return new Promise<Object[]>((resolve, reject) => {

		const query = Object.assign({
			user: user.id,
			folder: folderId,
			isHidden: false,
			isDeleted: false
		}, new Match<void, any>(null)
			.when(() => sinceId !== null, () => {
				return { _id: { $gt: sinceId } };
			})
			.when(() => maxId !== null, () => {
				return { _id: { $lt: maxId } };
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
