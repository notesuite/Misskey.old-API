import { Match } from 'powerful';
import { PostLike } from '../../../models';
import { IUser, IPostLike } from '../../../interfaces';
import serializeUser from '../../../core/serialize-user';

/**
 * 投稿のLikeを取得します
 * @param user API利用ユーザー
 * @param postId 対象の投稿のID
 * @param limit 取得するLikeの最大数
 * @param sinceCursor 取得するLikeを、設定されたカーソルよりも大きなカーソルを持つもののみに制限します
 * @param maxCursor 取得するLikeを、設定されたカーソルよりも小さなカーソルを持つもののみに制限します
 */
export default function show(
	user: IUser,
	postId: string,
	limit: number = 10,
	sinceCursor: number = null,
	maxCursor: number = null
): Promise<Object[]> {
	'use strict';

	return new Promise<Object[]>((resolve, reject) => {

		const query = new Match<void, any>(null)
			.when(() => sinceCursor !== null, () => {
				return {
					post: postId,
					cursor: {$gt: sinceCursor}
				};
			})
			.when(() => maxCursor !== null, () => {
				return {
					post: postId,
					cursor: {$lt: maxCursor}
				};
			})
			.getValue({post: postId});

		PostLike
		.find(query)
		.sort('-createdAt')
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
