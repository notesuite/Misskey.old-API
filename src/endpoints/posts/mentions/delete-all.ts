import {PostMention} from '../../../models';
import {IUser, IPostMention} from '../../../interfaces';

/**
 * Mentionを全て削除します
 * @param user API利用ユーザー
 * @return Promise<なし>
 */
export default function(user: IUser): Promise<void> {
	'use strict';
	return new Promise<void>((resolve, reject) => {
		PostMention.find({
			user: user.id
		}, (findErr: any, mentions: IPostMention[]) => {
			Promise.all(mentions.map(mention => {
				return new Promise((resolve2, reject2) => {
					mention.remove(() => {
						resolve2();
					});
				});
			})).then(() => {
				resolve();
			});
		});
	});
}
