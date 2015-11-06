import { UserFollowing, User } from '../../models';
import { IUserFollowing, IUser } from '../../interfaces';

/**
 * ユーザーのフォローを解除します
 * @follower: フォローを解除するユーザー
 * @followeeId: フォローを解除されるユーザー
 */
export default function(follower: IUser, followeeId: string): Promise<void> {
	'use strict';
	return new Promise((resolve: () => void, reject: (err: any) => void) => {
		if (follower.id.toString() === followeeId) {
			reject('followee-is-you');
		} else {
			User.findById(followeeId, (userFindErr: any, followee: IUser) => {
				if (userFindErr !== null) {
					reject(userFindErr);
				} else if(followee === null) {
					reject('followee-not-found');
				} else {
					UserFollowing.findOne({
						followee: followeeId,
						follower: follower.id
					}, (followingFindErr: any, UserFollowing: IUserFollowing) => {
						if (followingFindErr !== null) {
							reject(followingFindErr);
						} else if( UserFollowing === null) {
							reject("not-following");
						} else {
							UserFollowing.findOneAndRemove({
								followee: followeeId,
								follower: follower.id
							}, (followingRemoveErr: any) => {
								if (followingRemoveErr !== null) {
									reject(followingRemoveErr);
								} else {
									follower.followingsCount--;
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
