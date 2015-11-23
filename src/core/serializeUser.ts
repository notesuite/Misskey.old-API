import {IUser} from '../interfaces';
import lookupFollowState from './lookupFollowState';

export default function(me: IUser, user: IUser): Promise<Object> {
	'use strict';
	const userObj: any = user.toObject();
	return (me !== undefined && me !== null) ?
		Promise.all([lookupFollowState(me.id, user.id), lookupFollowState(user.id, me.id)])
		.then(([isFollowing, isFollowed]) => {
				userObj.isFollowing = isFollowing;
				userObj.isFollowed = isFollowed;
				return userObj;
		})
	:
		Promise.resolve(userObj);
}
