import {List, Match} from 'powerful';
const isEmpty = List.isEmpty;
import {PostLike} from '../db/db';
import {IUser, IPostLike} from '../db/interfaces';

export default function(
	postId: string,
	limit: number = 10,
	sinceId: number = null,
	maxId: number = null
): Promise<IUser[]> {
	return new Promise<IUser[]>((resolve, reject) => {
		const query = new Match<void, any>(null)
			.when(() => sinceId !== null, () => {
				return {$and: [
					{post: postId},
					{_id: {$gt: sinceId}}
				]};
			})
			.when(() => maxId !== null, () => {
				return {$and: [
					{post: postId},
					{_id: {$lt: maxId}}
				]};
			})
			.getValue({post: postId});

		PostLike.find(query)
		.sort({createdAt: -1})
		.limit(limit)
		.populate('user')
		.exec((likesFindErr: any, likes: IPostLike[]) => {
			if (likesFindErr !== null) {
				reject(likesFindErr);
			} else if (isEmpty(likes)) {
				resolve(null);
			} else {
				resolve(likes.map(like => <IUser>like.user));
			}
		});
	});
}
