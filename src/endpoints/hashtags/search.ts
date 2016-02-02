import {List} from 'powerful';
const isEmpty = List.isEmpty;
import {Hashtag} from '../../db/db';
import {IHashtag} from '../../db/interfaces';
import escapeRegexp from '../../core/escape-regexp';

export default function(query: string): Promise<string[]> {
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
