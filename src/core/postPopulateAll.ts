import {User, Post, Status} from '../models';
import {IPost} from '../interfaces';

export default function postPopulateAll(post: IPost): Promise<IPost> {
	return new Promise((resolve: (post: IPost) => void, reject: (err: any) => void) => {
		switch (post.type) {
			case 'status':
				Status.populate(post, 'user inReplyToPost', (err: any, _post: any) => {
					if (err !== null) {
						return reject(err);
					}
					User.populate(_post, 'inReplyToPost.user', (_err: any, __post: any) => {
						if (_err !== null) {
							return reject(_err);
						}
						resolve(__post);
					});
				});
				break;
			default:
				break;
		}
	});
}
