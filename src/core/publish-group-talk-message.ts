import {TalkGroupHistory} from '../models';
import {ITalkGroup, ITalkMessage, ITalkGroupHistory} from '../interfaces';
import publishStream from './publish-streaming-message';

export default function(
	message: ITalkMessage,
	group: ITalkGroup
): void {
	'use strict';

	// Streaming messages
	(<string[]>group.members).map(member => [`user-stream:${member}`, 'talk-user-message']).concat([
		[`talk-group-stream:${group.id}`, 'message']
	]).forEach(([channel, type]) => {
		publishStream(channel, JSON.stringify({
			type: type,
			value: {
				id: message.id
			}
		}));
	});
	// 履歴を作成しておく
	(<string[]>group.members).forEach(member => {
		TalkGroupHistory.findOne({
			type: 'group',
			user: member,
			group: group.id
		}, (findHistoryErr: any, history: ITalkGroupHistory) => {
			if (findHistoryErr !== null) {
				return;
			}
			if (history === null) {
				TalkGroupHistory.create({
					user: member,
					group: group.id,
					message: message.id
				});
			} else {
				history.updatedAt = <any>Date.now();
				history.message = message.id;
				history.save();
			}
		});
	});
}
