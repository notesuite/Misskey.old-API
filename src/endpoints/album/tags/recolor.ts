import {AlbumTag} from '../../../db/db';
import {IUser, IAlbumTag} from '../../../db/interfaces';
import {isColor} from '../../../spec/album-tag';

/**
 * アルバムのタグの色を変更します
 * @param user API利用ユーザー
 * @param tagId 対象のタグID
 * @param color 新しいタグの色
 * @return タグ
 */
export default function(
	user: IUser,
	tagId: string,
	color: string
): Promise<Object> {

	if (!isColor(color)) {
		return <Promise<any>>Promise.reject('invalid-color');
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
			tag.color = color;
			tag.save((saveErr: any, saved: IAlbumTag) => {
				if (saveErr !== null) {
					return reject(saveErr);
				}
				resolve(saved.toObject());
			});
		});
	});
}
