import serializePost from './serialize-post';
import {IUser} from '../interfaces';

export default function(posts: any[], me: IUser = null): Promise<Object[]> {
	'use strict';
	return Promise.all(posts.map(post => serializePost(post, me)));
}
