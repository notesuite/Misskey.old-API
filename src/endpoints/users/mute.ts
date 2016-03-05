import {UserMute, User} from '../../db/db';
import {IUserMute, IUser} from '../../db/interfaces';

/**
 * ユーザーをミュートします
 * @param from ミュートするユーザー
 * @param toId ミュートされるユーザーID
 */
export default function(from: IUser, toId: string): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		if (from.id.toString() === toId) {
			return reject('to-is-you');
		}
		User.findById(toId, (userFindErr: any, to: IUser) => {
			if (userFindErr !== null) {
				return reject(userFindErr);
			} else if (to === null) {
				return reject('to-not-found');
			}
			UserMute.findOne({
				to: toId,
				from: from.id
			}, (muteFindErr: any, userMute: IUserMute) => {
				if (muteFindErr !== null) {
					return reject(muteFindErr);
				} else if (userMute !== null) {
					return reject('already-mute');
				}
				UserMute.create({
					to: toId,
					from: from.id
				}, (createErr: any, createdUserMute: IUserMute) => {
					if (createErr !== null) {
						return reject(createErr);
					}
					resolve();
				});
			});
		});
	});
}
