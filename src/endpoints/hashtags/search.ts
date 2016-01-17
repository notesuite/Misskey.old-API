import {List} from 'powerful';
const isEmpty = List.isEmpty;
import {Hashtag} from '../../models';
import {IHashtag} from '../../interfaces';
import escapeRegexp from '../../core/escape-regexp';

export default function(query: string): Promise<string[]> {
	'use strict';
	return new Promise<string[]>((resolve, reject) => {
		Hashtag.find({
			name: new RegExp(escapeRegexp(query), 'i')
		})
		.sort({
			count: -1
		})
		.limit(30)
		.exec((searchErr: any, hashtags: IHashtag[]) => {
			if (searchErr !== null) {
				reject('something-happened');
			} else if (isEmpty(hashtags)) {
				resolve([]);
			} else {
				resolve(hashtags.map(hashtag => hashtag.name));
			}
		});
	});
}
