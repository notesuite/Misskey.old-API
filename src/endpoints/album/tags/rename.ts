import {AlbumTag} from '../../../db/db';
import {IUser, IAlbumTag} from '../../../db/interfaces';
import {isName} from '../../../spec/album-tag';

/**
 * アルバムのタグの名前を変更します
 * @param user API利用ユーザー
 * @param tagId 対象のタグID
 * @param name 新しいタグの名前
 * @return タグ
 */
export default function(
	user: IUser,
	tagId: string,
	name: string
): Promise<Object> {

	if (!isName(name)) {
		return <Promise<any>>Promise.reject('invalid-name');
	}

	return new Promise<Object>((resolve, reject) => {
		AlbumTag.findById(tagId, (tagFindErr: any, tag: IAlbumTag) => {
			if (tagFindErr !== null) {
				return reject(tagFindErr);
			} else if (tag === null) {
				return reject('tag-not-found');
			} else if (tag.user.toString() !== user.id.toString()) {
				return reject('tag-not-found');
			}
			AlbumTag.findOne({
				name: name,
				user: user.id
			}, (tagFindErr2: any, existTag: IAlbumTag) => {
				if (tagFindErr2 !== null) {
					return reject(tagFindErr2);
				} else if (existTag !== null) {
					return reject('already-exist-tag');
				}
				tag.name = name;
				tag.save((saveErr: any, renamed: IAlbumTag) => {
					if (saveErr !== null) {
						return reject(saveErr);
					}
					resolve(renamed.toObject());
				});
			});
		});
	});
}
