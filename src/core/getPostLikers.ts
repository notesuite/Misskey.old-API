import {PostLike} from '../models';
import {IUser, IPostLike} from '../interfaces';

export default function getPostLikers(
	postId: string,
	limit: number = 10,
	sinceCursor: number = null,
	maxCursor: number = null)
		: Promise<IUser[]> {
	'use strict';

	return new Promise<IUser[]>((resolve, reject) => {
		const query: any = ((): any => {
			if (sinceCursor === null && maxCursor === null) {
				return {post: postId};
			} else if (sinceCursor) {
				return {$and: [
					{post: postId},
					{cursor: {$gt: sinceCursor}}
				]};
			} else if (maxCursor) {
				return {$and: [
					{post: postId},
					{cursor: {$lt: maxCursor}}
				]};
			}
		})();

		PostLike.find(query)
		.sort('-createdAt')
		.limit(limit)
		.populate('user')
		.exec((likesFindErr: any, likes: IPostLike[]) => {
			if (likesFindErr !== null) {
				reject(likesFindErr);
			} else if (likes.length === 0) {
				resolve(null);
			} else {
				resolve(likes.map(like => <IUser>like.user));
			}
		});
	});
}
