import {Match} from 'powerful';
import {PostLike} from '../../../db/db';
import {IUser, IPostLike} from '../../../db/interfaces';
import serializeUser from '../../../core/serialize-user';

/**
 * 投稿のLikeを取得します
 * @param user API利用ユーザー
 * @param postId 対象の投稿のID
 * @param limit 取得するLikeの最大数
 * @param sinceId 取得するLikeを、設定されたカーソルよりも大きなカーソルを持つもののみに制限します
 * @param maxId 取得するLikeを、設定されたカーソルよりも小さなカーソルを持つもののみに制限します
 * @return Likeオブジェクトの配列
 */
export default function(
	user: IUser,
	postId: string,
	limit: number = 10,
	sinceId: number = null,
	maxId: number = null
): Promise<Object[]> {
	return new Promise<Object[]>((resolve, reject) => {

		const query = Object.assign({
			post: postId
		}, new Match<void, any>(null)
			.when(() => sinceId !== null, () => {
				return { _id: { $gt: sinceId } };
			})
			.when(() => maxId !== null, () => {
				return { _id: { $lt: maxId } };
			})
			.getValue({})
		);

		PostLike
		.find(query)
		.sort({createdAt: -1})
		.limit(limit)
		.populate('user')
		.exec((err: any, likes: IPostLike[]) => {
			if (err !== null) {
				return reject(err);
			} else if (likes.length === 0) {
				return resolve([]);
			}

			Promise.all(likes.map(like =>
				new Promise<Object>((resolve2, reject2) => {
					const likeObj: any = like.toObject();
					serializeUser(user, <IUser>like.user).then(userObj => {
						likeObj.user = userObj;
						resolve2(likeObj);
					}, reject2);
				})
			)).then(resolve, reject);
		});
	});
}
