import {Post} from '../../models';
import {IUser, IPost} from '../../interfaces';
import serializeTimeline from '../../core/serializeTimeline';
import populateAll from '../../core/postPopulateAll';

/**
 * 指定された投稿を起点とした場合のそれ以前の会話のストリームを取得します
 * @user: API利用ユーザー
 * @id: 投稿のID
 * @limit: 取得する投稿の最大数
 */
export default function(user: IUser, id: string, limit: number = 30): Promise<Object[]> {
	'use strict';
	return new Promise<Object[]>((resolve, reject) => {
		get(id).then((posts: IPost[]) => {
			// すべてpopulateする
			Promise.all(posts.map((post: IPost) => {
				return populateAll(post);
			})).then((populatedTimeline: IPost[]) => {
				// 整形
				serializeTimeline(populatedTimeline, user).then((serializedTimeline: Object[]) => {
					resolve(serializedTimeline);
				}, (serializeErr: any) => {
					reject(serializeErr);
				});
			}, (populatedErr: any) => {
				reject(populatedErr);
			});
		}, (err: any) => {
			reject(err);
		});
	});
}

function get(id: string): Promise<IPost[]> {
	'use strict';
	return new Promise<IPost[]>((resolve, reject) => {
		Post.findById(id, (err: any, post: IPost) => {
			if (err !== null) {
				reject(err);
			} else if (post.inReplyToPost === null) {
				resolve([post]);
			} else {
				get(<string>post.inReplyToPost).then((nextPosts: IPost[]) => {
					resolve([...nextPosts, post]);
				}, (getErr: any) => {
					reject(getErr);
				});
			}
		});
	});
}
