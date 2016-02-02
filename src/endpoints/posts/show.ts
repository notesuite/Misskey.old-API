import {Post} from '../../db/db';
import {IUser, IPost} from '../../db/interfaces';
import serializePost from '../../core/serialize-post';
import readPost from '../../core/read-post';

/**
 * 対象の投稿を取得します
 * @param shower API利用ユーザー
 * @param postId 対象の投稿のID
 * @return 投稿オブジェクト
 */
export default function(shower: IUser, postId: string): Promise<Object> {
	return new Promise<Object>((resolve, reject) => {
		// Init 'postId' parameter
		if (postId === undefined || postId === null || postId === '') {
			return reject('post-id-required');
		}

		Post.findById(postId, (findErr: any, post: IPost) => {
			if (findErr !== null) {
				return reject(findErr);
			} else if (post === null) {
				return reject('not-found');
			}

			// Resolve promise
			serializePost(post, shower).then(serializedPost => {
				resolve(serializedPost);
			}, (err: any) => {
				reject(err);
			});

			// 既読にする
			if (shower !== null) {
				readPost(shower, post);
			}
		});
	});
}
