import serializePost from './serialize-post';
import {IUser, IPost} from '../interfaces';

export default function(posts: IPost[], me: IUser = null): Promise<Object[]> {
	'use strict';
	return Promise.all(posts.map(post => serializePost(post, me)));
}
