import {UserFollowing} from '../db/db';
import {IUserFollowing} from '../db/interfaces';
import publishStreamingMessage from './publish-streaming-message';

export default function<T>(publisherId: string, message: T): void {
	'use strict';
	const streamMessage = JSON.stringify(message);

	// 自分のストリーム
	publishStreamingMessage(`user-stream:${publisherId}`, streamMessage);

	// 自分のフォロワーのストリーム
	UserFollowing.find({followee: publisherId}, (followerFindErr: any, followers: IUserFollowing[]) => {
		followers.forEach(follower => {
			publishStreamingMessage(`user-stream:${follower.follower}`, streamMessage);
		});
	});
};
