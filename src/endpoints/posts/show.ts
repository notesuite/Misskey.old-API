import {Post} from '../../models';
import {IUser, IPost} from '../../interfaces';
import serializePost from '../../core/serialize-post';
import populateAll from '../../core/post-populate-all';
import readPost from '../../core/read-post';

export default function show(shower: IUser, id: string): Promise<Object> {
	'use strict';
	return new Promise<Object>((resolve, reject) => {
		Post.findById(id, (findErr: any, post: IPost) => {
			if (findErr !== null) {
				return reject(findErr);
			} else if (post === null) {
				return reject('not-found');
			}
			populateAll(post).then((populatedPost: IPost) => {
				serializePost(populatedPost, shower).then((serializedPost: any) => {
					resolve(serializedPost);
				}, (err: any) => {
					reject(err);
				});
			}, (populatedErr: any) => {
				reject(populatedErr);
			});

			// 既読にする
			readPost(shower, post);
		});
	});
}
