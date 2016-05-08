import {Match} from 'powerful';
import {UserFollowing} from '../../db/db';
import {IUser, IUserFollowing} from '../../db/interfaces';
import serializeUser from '../../core/serialize-user';

/**
 * 対象ユーザーのフォロワーの一覧を取得します。
 * @param me API利用ユーザー
 * @param userId 対象ユーザーのID
 * @param limit 取得するユーザーの最大数
 * @param sinceId 取得するユーザーを、設定されたカーソルよりも大きなカーソルを持つもののみに制限します
 * @param maxId 取得するユーザーを、設定されたカーソルよりも小さなカーソルを持つもののみに制限します
 * @return ユーザーオブジェクトの配列
 */
export default function(
	me: IUser,
	userId: string,
	limit: number = 30,
	sinceId: number = null,
	maxId: number = null
): Promise<Object[]> {
	limit = parseInt(<any>limit, 10);

	if (limit < 1) {
		return <Promise<any>>Promise.reject('1 kara');
	} else if (limit > 30) {
		return <Promise<any>>Promise.reject('30 made');
	}

	return new Promise<Object[]>((resolve, reject) => {
		const query = Object.assign({
			followee: userId
		}, new Match<void, any>(null)
			.when(() => sinceId !== null, () => {
				return { _id: { $gt: sinceId } };
			})
			.when(() => maxId !== null, () => {
				return { _id: { $lt: maxId } };
			})
			.getValue({})
		);

		UserFollowing
		.find(query)
		.sort({createdAt: -1})
		.limit(limit)
		.populate('follower')
		.exec((err: any, userFollowing: IUserFollowing[]) => {
			if (err !== null) {
				return reject(err);
			}

			Promise.all(userFollowing.map(follow => {
				return serializeUser(me, <IUser>follow.follower);
			})).then((followers: any[]) => {
				for (let i = 0; i < followers.length; i++) {
					followers[i].followingId = userFollowing[i]._id;
				}
				resolve(followers);
			});
		});
	});
};
