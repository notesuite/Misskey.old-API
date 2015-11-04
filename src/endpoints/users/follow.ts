import { UserFollowing, User } from '../../models';
import { IUserFollowing, IUser } from '../../interfaces';

/**
 * ユーザーをフォローします
 * @followee: フォローされるユーザーID
 * @follower: フォローするユーザーID
 */

export default function(followee: string, follower: string) :Promise<void> {
	'use strict';
	return new Promise((resolve: () => void, reject: (err:any) => void) => {
		if (followee !== undefined && followee !== null) {
			if (followee === follower) {
				reject("followee-is-you");
			} else {
				User.findById(followee, (userFindErr: any, user: IUser) => {
					if (userFindErr !== null) {
						reject(userFindErr);
					} else if (user === null){
						reject("followee-not-found");
					} else {
						UserFollowing.findOne({followee,follower}, (followingFindErr: any, UserFollowing: IUserFollowing) => {
							if (followingFindErr !== null) {
								reject(followingFindErr);
							} else if(UserFollowing !== null) {
								reject("already-following");
							} else {
								UserFollowing.create({
									followee,
									follower
								}, (createErr: any, createdUserFollowing) => {
									if (createErr) {
										reject(createErr);
									} else {
										resolve();
									}
								});
							}
						});
					}
				});
			}
		} else {
			reject("empty-folowee-id");
		}
	});
}
