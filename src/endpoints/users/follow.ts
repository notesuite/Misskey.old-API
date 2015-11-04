import {UserFollowing,User} from '../../models';
import {IUserFollowing,IUser} from '../../interfaces';

/**
 * ユーザーをフォローします
 * @followeeId: フォローされるユーザーID
 * @followerId: フォローするユーザーID
 */
export default function(followeeId: string,followerId: string) :Promise<IUserFollowing> {
	'use strict';
	return new Promise((resolve: () => void, reject: (err:any) => void) => {
		if (followeeId !== undefined && followeeId !== null) {
			if (followeeId === followerId) {
				reject("followee-is-you");
			} else {
				User.findById(followeeId, (userFindErr: any, user: IUser) => {
					if (userFindErr !== null) {
						reject(userFindErr);
					} else if (user === null){
						reject("followee-not-found");
					} else {
						UserFollowing.findOne({followee:followeeId,follower:followerId}, (followingFindErr: any, UserFollowing: IUserFollowing) => {
							if (followingFindErr !== null) {
								reject(followingFindErr);
							} else if(UserFollowing !== null) {
								reject("already-following");
							} else {
								UserFollowing.create({
									followeeId,
									followerId
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
