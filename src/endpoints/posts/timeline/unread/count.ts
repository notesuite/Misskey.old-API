import {List} from 'powerful';
const isEmpty = List.isEmpty;
import {Post, UserFollowing} from '../../../../db/db';
import {IUser, IUserFollowing} from '../../../../db/interfaces';

/**
 * タイムラインにある未読の投稿の件数を取得します
 * @param user API利用ユーザー
 * @return タイムラインにある未読の投稿の件数
 */
export default function(user: IUser): Promise<number> {
	return new Promise<number>((resolve, reject) => {
		// 自分がフォローしているユーザーの関係を取得
		UserFollowing.find({follower: user.id}, (followingFindErr: any, following: IUserFollowing[]) => {
			if (followingFindErr !== null) {
				return reject(followingFindErr);
			} else if (isEmpty(following)) {
				return resolve(0);
			}

			// 自分がフォローしているユーザーのIDのリストを生成
			const followingIds = following.map(follow => follow.followee.toString());

			// タイムライン取得用のクエリ
			const query: any = {
				user: {$in: followingIds},
				cursor: {$gt: user.timelineReadCursor}
			};

			// クエリを発行して件数を取得
			Post
			.find(query)
			.limit(100)
			.count((err: any, count: number) => {
				if (err !== null) {
					return reject(err);
				}
				resolve(count);
			});
		});
	});
}
