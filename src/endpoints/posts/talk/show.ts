import {Post, Reply} from '../../../db/db';
import {IUser, IPost, IReply} from '../../../db/interfaces';
import serializePosts from '../../../core/serialize-posts';

/**
 * 指定された投稿を起点とした場合のそれ以前の会話のストリームを取得します
 * @param user API利用ユーザー
 * @param postId 投稿のID
 * @param limit 取得する投稿の最大数
 * @return 投稿オブジェクトの配列
 */
export default function(
	user: IUser,
	postId: string,
	limit: number = 30
): Promise<Object[]> {
	return new Promise<Object[]>((resolve, reject) => {
		// Init 'postId' parameter
		if (postId === undefined || postId === null || postId === '') {
			return reject('post-id-required');
		}

		Reply.findById(postId, (findErr: any, source: IReply) => {
			if (findErr !== null) {
				reject(findErr);
			} else if (source === null) {
				reject('not-found');
			} else if (source.type !== 'reply') {
				resolve([]);
			} else {
				get(<string>source.inReplyToPost).then(posts => {
					// Resolve promise
					serializePosts(posts, user).then(serializedTimeline => {
						resolve(serializedTimeline);
					}, (serializeErr: any) => {
						reject(serializeErr);
					});
				}, (err: any) => {
					reject(err);
				});
			}
		});
	});
}

function get(id: string): Promise<IPost[]> {
	return new Promise<IPost[]>((resolve, reject) => {
		Post.findById(id, (err: any, post: IPost) => {
			if (err !== null) {
				reject(err);
			} else if ((<any>post)._doc.type !== 'reply') {
				resolve([post]);
			} else {
				get((<any>post)._doc.inReplyToPost).then(nextPosts => {
					resolve([...nextPosts, post]);
				}, (getErr: any) => {
					reject(getErr);
				});
			}
		});
	});
}
