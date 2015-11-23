import { PostMention } from '../models';
import { IPost, IPostMention } from '../interfaces';
import extractMentions from './extractMentions';
import publishStreamingMessage from './publishStreamingMessage';

export default function(post: IPost, text: string): void {
	'use strict';
	extractMentions(text).then(users => {
		users.forEach(user => {
			PostMention.create({
				user: user.id,
				post: post.id
			}, (createErr: any, createdMention: IPostMention) => {
				publishStreamingMessage(`userStream:${user.id}`, JSON.stringify({
					type: 'mention',
					value: {
						id: post.id
					}
				}));
			});
		});
	});
}
