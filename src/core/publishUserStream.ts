import {UserFollowing} from '../models';
import {IUserFollowing} from '../interfaces';
import publishStreamingMessage from './publishStreamingMessage';

export default function(publisherId: string, msg: Object): void {
	'use strict';
	const streamMessage: string = JSON.stringify(msg);

	// 自分のストリーム
	publishStreamingMessage(`userStream:${publisherId}`, streamMessage);

	// 自分のフォロワーのストリーム
	UserFollowing.find({followeeId: publisherId}, (followerFindErr: any, followers: IUserFollowing[]) => {
		followers.forEach((follower: IUserFollowing) => {
			publishStreamingMessage(`userStream:${follower.follower}`, streamMessage);
		});
	});
};
