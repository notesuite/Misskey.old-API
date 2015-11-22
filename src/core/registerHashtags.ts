import { Hashtag } from '../models';
import { IHashtag } from '../interfaces';

export default function(hashtags: string[]): void {
	'use strict';
	hashtags.forEach((hashtag: string) => {
		Hashtag.findOne({name: hashtag}, (err: any, existHashtag: IHashtag) => {
			if (existHashtag === null) {
				Hashtag.create({
					name: hashtag
				});
			}
		});
	});
}
