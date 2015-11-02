import {Post} from '../../models';
import {IUser, IPost} from '../../interfaces';
import serializePost from '../../core/serializePost';

export default function(shower: IUser, id: string): Promise<Object> {
	'use strict';
	return new Promise((resolve: (post: Object) => void, reject: (err: any) => void) => {
		Post.findById(id).populate('user').exec((findErr: any, post: IPost) => {
			if (findErr) {
				return reject(findErr);
			}
			serializePost(post, shower).then((serializedPost: any) => {
				resolve(serializedPost);
			}, (err: any) => {
				reject(err);
			});
		});
	});
}
