import {Hashtag} from '../../models';
import {IHashtag} from '../../interfaces';

export default function(query: string): Promise<string[]> {
	'use strict';
	return new Promise<string[]>((resolve, reject) => {
		Hashtag.find({
			name: new RegExp(query, 'i')
		}, (searchErr: any, hashtags: IHashtag[]) => {
			if (searchErr !== null) {
				reject('something-happened');
			} else if (hashtags.length === 0) {
				resolve(null);
			} else {
				resolve(hashtags.map((hashtag: IHashtag) => {
					return hashtag.name;
				}));
			}
		});
	});
}
