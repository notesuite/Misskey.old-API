import {StatusPost, PhotoPost, Repost} from '../models';
import {IPost, IRepost} from '../interfaces';

/* tslint:disable:variable-name */
export default function postPopulateAll(sourcePost: IPost | IRepost, populateReply: boolean = true): Promise<IPost> {
	'use strict';
	const post: any = sourcePost.toObject();
	return new Promise<IPost>((resolve, reject) => {
		switch (post.type) {
			case 'status':
				StatusPost.populate(post, `user ${populateReply ? 'inReplyToPost' : ''}`.trim(), (err: any, _post: any) => {
					if (err !== null) {
						return reject(err);
					}
					_post.user = _post.user.toObject();
					if (_post.inReplyToPost !== null && populateReply) {
						postPopulateAll(_post.inReplyToPost, false).then((__post: any) => {
							_post.inReplyToPost = __post;
							resolve(_post);
						}, (_err: any) => {
							reject(_err);
						});
					} else {
						resolve(_post);
					}
				});
				break;
			case 'photo':
				PhotoPost.populate(post, `user ${populateReply ? 'inReplyToPost' : ''}`.trim(), (err: any, _post: any) => {
					if (err !== null) {
						return reject(err);
					}
					_post.user = _post.user.toObject();
					if (_post.inReplyToPost !== null && populateReply) {
						postPopulateAll(_post.inReplyToPost, false).then((__post: any) => {
							_post.inReplyToPost = __post;
							resolve(_post);
						}, (_err: any) => {
							reject(_err);
						});
					} else {
						resolve(_post);
					}
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
