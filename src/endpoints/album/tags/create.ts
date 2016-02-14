import {AlbumTag} from '../../../db/db';
import {IUser, IAlbumTag} from '../../../db/interfaces';
import {isName, isColor} from '../../../spec/album-tag';

/**
 * アルバムのタグを作成します
 * @param user API利用ユーザー
 * @param name タグの名前
 * @param color タグの色
 * @return タグ
 */
export default function(
	user: IUser,
	name: string,
	color: string
): Promise<Object> {

	if (!isName(name)) {
		return <Promise<any>>Promise.reject('invalid-name');
	}

	if (!isColor(color)) {
		return <Promise<any>>Promise.reject('invalid-color');
	}

	return new Promise<Object>((resolve, reject) => {
		AlbumTag.findOne({
			name: name,
			user: user.id
		}, (tagFindErr: any, existTag: IAlbumTag) => {
			if (tagFindErr !== null) {
				return reject(tagFindErr);
			} else if (existTag !== null) {
				return reject('already-exist-tag');
			}
			AlbumTag.create({
				user: user.id,
				name: name,
				color: color
			}, (createErr: any, tag: IAlbumTag) => {
				if (createErr !== null) {
					return reject(createErr);
				}

				resolve(tag.toObject());
			});
		});
	});
}
