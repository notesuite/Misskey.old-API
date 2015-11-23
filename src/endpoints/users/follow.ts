import { UserFollowing, User } from '../../models';
import { IUserFollowing, IUser } from '../../interfaces';

/**
 * ユーザーをフォローします
 * @param follower フォローするユーザー
 * @param followeeId フォローされるユーザーID
 */
export default function follow(follower: IUser, followeeId: string): Promise<void> {
	'use strict';
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
						} else if (userFollowing !== null) {
							reject('already-following');
						} else {
							UserFollowing.create({
								followee: followeeId,
								follower: follower.id
							}, (createErr: any, createdUserFollowing: IUserFollowing) => {
								if (createErr !== null) {
									reject(createErr);
								} else {
									follower.followingsCount++;
									follower.save();
									followee.followersCount++;
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
