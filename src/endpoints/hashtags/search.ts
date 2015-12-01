import { List } from 'powerful';
const isEmpty = List.isEmpty;
import {Hashtag} from '../../models';
import {IHashtag} from '../../interfaces';

export default function search(query: string): Promise<string[]> {
	'use strict';
	return new Promise<string[]>((resolve, reject) => {
		Hashtag.find({
			name: new RegExp(query, 'i')
		}, (searchErr: any, hashtags: IHashtag[]) => {
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
