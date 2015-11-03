import {Post} from '../../models';
import {IUser, IPost} from '../../interfaces';
import serializePost from '../../core/serializePost';
import populateAll from '../../core/postPopulateAll';

export default function(shower: IUser, id: string): Promise<Object> {
	'use strict';
	return new Promise((resolve: (post: Object) => void, reject: (err: any) => void) => {
		Post.findById(id, (findErr: any, post: IPost) => {
			if (findErr) {
				return reject(findErr);
			}
			populateAll(post).then((populatedPost: IPost) => {
				serializePost(populatedPost, shower).then((serializedPost: any) => {
					resolve(serializedPost);
				}, (err: any) => {
					reject(err);
				});
			}, (populatedErr: any) => {
				reject(populatedErr);
			});;
		});
	});
}
