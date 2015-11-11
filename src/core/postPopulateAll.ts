import {User, Status, Reply, Repost} from '../models';
import {IPost} from '../interfaces';

/* tslint:disable:variable-name */
export default function postPopulateAll(sourcePost: IPost): Promise<IPost> {
	'use strict';
	const post: any = sourcePost.toObject();
	return new Promise((resolve: (post: IPost) => void, reject: (err: any) => void) => {
		switch (post.type) {
			case 'status':
				Status.populate(post, 'user', (err: any, _post: any) => {
					if (err !== null) {
						return reject(err);
					}
					_post.user = _post.user.toObject();
					resolve(_post);
				});
				break;
			case 'reply':
				Reply.populate(post, 'user inReplyToPost', (err: any, _post: any) => {
					if (err !== null) {
						return reject(err);
					}
					_post.user = _post.user.toObject();
					_post.inReplyToPost = _post.inReplyToPost.toObject();
					User.populate(_post, 'inReplyToPost.user', (_err: any, __post: any) => {
						if (_err !== null) {
							return reject(_err);
						}
						__post.inReplyToPost.user = __post.inReplyToPost.user.toObject();
						resolve(__post);
					});
				});
				break;
			case 'repost':
				Repost.populate(post, 'user post', (err: any, _post: any) => {
					if (err !== null) {
						return reject(err);
					}
					_post.user = _post.user.toObject();
					postPopulateAll(_post.post).then((__post: any) => {
						_post.post = __post;
						resolve(_post);
					}, (_err: any) => {
						reject(_err);
					});
				});
				break;
			default:
				reject('unknown-post-type');
				break;
		}
	});
}
