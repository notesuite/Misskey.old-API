import {PostMention} from '../models';
import {IUser, IPost, IPostMention} from '../interfaces';

export default function(me: IUser, post: IPost): void {
	'use strict';

	if (me.timelineReadCursor < post.cursor) {
		me.timelineReadCursor = post.cursor;
		me.save();
	}
	PostMention.findOne({
		user: me.id,
		post: post.id
	}, (mentionFindErr: any, mention: IPostMention) => {
		if (mentionFindErr !== null) {
			return;
		} else if (mention === null) {
			return;
		}
		mention.isRead = true;
		mention.save();
	});
}
