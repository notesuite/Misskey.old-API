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
				User.findById(followeeId, (err: any, user: IUser) => {
					if (err !== null) {
						reject(err);
					} else if (user === null){
						reject("followee-not-found");
					} else {
						UserFollowing.findOne({followee:followeeId,follower:followerId}, (err: any, UserFollowing: IUserFollowing) => {
							if (err !== null) {
								reject(err);
							} else if(UserFollowing !== null) {
								reject("already-following");
							} else {
								UserFollowing.create({
									followeeId:followeeId,
									followerId:followerId
								}, (err: any, createdUserFollowing) => {
									if (err) {
										reject(err);
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
