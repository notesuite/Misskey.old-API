import {AlbumFile, AlbumTag} from '../../../db/db';
import {IUser, IAlbumFile, IAlbumTag} from '../../../db/interfaces';

/**
 * アルバムのタグを削除します
 * @param user API利用ユーザー
 * @param tagId 対象のタグID
 * @return
 */
export default function(
	user: IUser,
	tagId: string
): Promise<Object> {
	return new Promise<Object>((resolve, reject) => {
		AlbumTag.findById(tagId, (tagFindErr: any, tag: IAlbumTag) => {
			if (tagFindErr !== null) {
				return reject(tagFindErr);
			} else if (tag === null) {
				return reject('tag-not-found');
			} else if (tag.user.toString() !== user.id.toString()) {
				return reject('tag-not-found');
			}
			tag.remove(() => {
				resolve('kyoppie');
			});
			AlbumFile.find({
				tags: tag.id
			}, (findErr: any, files: IAlbumFile[]) => {
				if (findErr === null && files.length > 0) {
					files.forEach(file => {
						file.tags = (<any[]>file.tags).filter(tag2 => tag2.toString() !== tag.id.toString());
						file.markModified('tags');
						file.save();
					});
				}
			});
		});
	});
}
