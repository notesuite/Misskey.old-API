import {UserFollowing, User} from '../../db/db';
import {IUserFollowing, IUser} from '../../db/interfaces';

/**
 * ユーザーのフォローを解除します
 * @param follower: フォローを解除するユーザー
 * @param followeeId: フォローを解除されるユーザー
 */
export default function(follower: IUser, followeeId: string): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		if (follower.id.toString() === followeeId) {
			reject('followee-is-you');
		} else {
			User.findById(followeeId, (userFindErr: any, followee: IUser) => {
				if (userFindErr !== null) {
					reject(userFindErr);
				} else if (followee === null) {
					reject('followee-not-found');
				} else {
					UserFollowing.findOne({
						followee: followeeId,
						follower: follower.id
					}, (followingFindErr: any, userFollowing: IUserFollowing) => {
						if (followingFindErr !== null) {
							reject(followingFindErr);
						} else if (userFollowing === null) {
							reject("not-following");
						} else {
							userFollowing.remove((followingRemoveErr: any) => {
								if (followingRemoveErr !== null) {
									reject(followingRemoveErr);
								} else {
									follower.followingCount--;
									follower.save();
									followee.followersCount--;
									followee.save();
									resolve();
								}
							});
						}
					});
				}
			});
		}
	});
}
