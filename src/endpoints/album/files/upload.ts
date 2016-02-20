import {IApplication, IUser} from '../../../db/interfaces';
import add from '../../../core/add-file-to-album';
import {isName} from '../../../spec/album-file';

/**
 * アルバムにファイルを追加します
 * @param app API利用App
 * @param user API利用ユーザー
 * @param fileName ファイル名
 * @param mimetype ファイルの種類
 * @param file 内容
 * @param folder フォルダ
 * @param unconditional trueに設定すると、ハッシュが同じファイルが見つかった場合でも無視してアルバムに登録します
 * @return アップロードされたファイルオブジェクト
 */
export default function(
	app: IApplication,
	user: IUser,
	fileName: string,
	mimetype: string,
	file: Buffer,
	size: number,
	folderId: string = null,
	unconditional: boolean = false
): Promise<Object> {
	if (!isName(fileName)) {
		return <Promise<any>>Promise.reject('invalid-file-name');
	}
	return new Promise<Object>((resolve, reject) => {
		// Check user
		if (user === undefined || user === null) {
			return reject('plz-authenticate');
		} else if (user.isSuspended) {
			return reject('access-denied');
		}

		const appId = app !== null ? app.id : null;
		add(appId, user.id, fileName, mimetype, file, size, folderId, unconditional).then(createdFile => {
			resolve(createdFile.toObject());
		}, (err: any) => {
			reject(err);
		});
	});
}
