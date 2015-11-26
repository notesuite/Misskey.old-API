import {Post} from '../../models';
import {IUser, IPost} from '../../interfaces';
import serializePost from '../../core/serialize-post';
import populateAll from '../../core/post-populate-all';

export default function show(shower: IUser, id: string): Promise<Object> {
	'use strict';
	return new Promise<Object>((resolve, reject) => {
		Post.findById(id, (findErr: any, post: IPost) => {
			if (findErr !== null) {
				reject(findErr);
			} else if (post === null) {
				reject('not-found');
			} else {
				populateAll(post).then((populatedPost: IPost) => {
					serializePost(populatedPost, shower).then((serializedPost: any) => {
						resolve(serializedPost);
					}, (err: any) => {
						reject(err);
					});
				}, (populatedErr: any) => {
					reject(populatedErr);
				});
			}
		});
	});
}
