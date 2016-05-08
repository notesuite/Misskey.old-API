import {PostMention} from '../db/db';
import {IUser, IPost, IPostMention} from '../db/interfaces';

export default function(me: IUser, post: IPost): void {
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
