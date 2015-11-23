import {UserFollowing} from '../models';
import {IUserFollowing} from '../interfaces';
import publishStreamingMessage from './publishStreamingMessage';

export default function publishUserStream<T>(publisherId: string, message: T): void {
	'use strict';
	const streamMessage = JSON.stringify(message);

	// 自分のストリーム
	publishStreamingMessage(`userStream:${publisherId}`, streamMessage);

	// 自分のフォロワーのストリーム
	UserFollowing.find({followee: publisherId}, (followerFindErr: any, followers: IUserFollowing[]) => {
		followers.forEach(follower => {
			publishStreamingMessage(`userStream:${follower.follower}`, streamMessage);
		});
	});
};
