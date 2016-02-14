import {AlbumTag} from '../../../db/db';
import {IUser, IAlbumTag} from '../../../db/interfaces';

/**
 * アルバムのタグ一覧を取得します
 * @param user API利用ユーザー
 * @return タグの配列
 */
export default function(user: IUser): Promise<Object[]> {
	return new Promise<Object[]>((resolve, reject) => {
		AlbumTag.find({
			user: user.id,
		}, (findErr: any, tags: IAlbumTag[]) => {
			if (findErr !== null) {
				return reject(findErr);
			}
			resolve(tags.map<Object>(tag => tag.toObject()));
		});
	});
}
