import { Match } from 'powerful';
import {PostMention} from '../../models';
import {IUser, IPost, IPostMention} from '../../interfaces';
import serializeTimeline from '../../core/serialize-timeline';
import populateAll from '../../core/post-populate-all';

/**
 * メンションを取得します
 * @param user API利用ユーザー
 * @param limit 取得する投稿の最大数
 * @param sinceCursor 取得する投稿を、設定されたカーソルよりも大きなカーソルを持つもののみに制限します
 * @param maxCursor 取得する投稿を、設定されたカーソルよりも小さなカーソルを持つもののみに制限します
 */
export default function timeline(user: IUser, limit: number = 10, sinceCursor: number = null, maxCursor: number = null)
		: Promise<Object[]> {
	'use strict';

	const query = new Match<void, any>(null)
		.when(() => sinceCursor !== null, () => {
			return {
				user: user.id,
				cursor: {$gt: sinceCursor}
			};
		})
		.when(() => maxCursor !== null, () => {
			return {
				user: user.id,
				cursor: {$lt: maxCursor}
			};
		})
		.getValue({user: user.id});

	return new Promise<Object[]>((resolve, reject) => {
		// メンションドキュメントを取得
		PostMention.find(query)
		.sort('-createdAt')
		.limit(limit)
		.populate('post')
		.exec((err: any, mentions: IPostMention[]) => {
			if (err !== null) {
				return reject(err);
			}

			const posts = mentions.map(mention => <IPost>mention.post);

			// すべてpopulateする
			Promise.all(posts.map(post => populateAll(post)))
			.then(populatedPosts => {
				// 整形
				serializeTimeline(populatedPosts, user).then(serializedTimeline => {
					resolve(serializedTimeline);
				}, (serializeErr: any) => {
					reject(serializeErr);
				});
			}, (populatedErr: any) => {
				reject(populatedErr);
			});

			// 全て既読にする
			mentions.forEach(mention => {
				mention.isRead = true;
				mention.save();
			});
		});
	});
}
