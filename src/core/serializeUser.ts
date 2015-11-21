import {IUser} from '../interfaces';
import lookupFollowState from './lookupFollowState';

export default function(me: IUser, user: IUser): Promise<Object> {
	'use strict';
	const userObj: any = user.toObject();
	return new Promise<Object>((resolve, reject) => {
		if (me !== undefined && me !== null) {
			lookupFollowState(me.id, user.id).then((isFollowing: boolean) => {
				lookupFollowState(user.id, me.id).then((isFollowingMe: boolean) => {
					userObj.isFollowing = isFollowing;
					userObj.isFollowingMe = isFollowingMe;
					resolve(userObj);
				}, (err: any) => {
					reject(err);
				});
			}, (err: any) => {
				reject(err);
			});
		} else {
			resolve(userObj);
		}
	});
}
