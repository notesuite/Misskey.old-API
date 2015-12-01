import { PostMention } from '../models';
import { IPost, IPostMention } from '../interfaces';
import extractMentions from './extract-mentions';
import publishStreamingMessage from './publish-streaming-message';

export default function savePostMentions(post: IPost, text: string): void {
	'use strict';
	extractMentions(text).then(users => {
		users.forEach(user => {
			PostMention.create({
				user: user.id,
				post: post.id
			}, (createErr: any, createdMention: IPostMention) => {
				publishStreamingMessage(`user-stream:${user.id}`, JSON.stringify({
					type: 'mention',
					value: {
						id: post.id
					}
				}));
			});
		});
	});
}
