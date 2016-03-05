import {UserMute, User} from '../../db/db';
import {IUserMute, IUser} from '../../db/interfaces';

/**
 * ユーザーをミュートします
 * @param from ミュートするユーザー
 * @param targetId ミュートされるユーザーID
 */
export default function(from: IUser, targetId: string): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		if (from.id.toString() === targetId) {
			return reject('target-is-you');
		}
		User.findById(targetId, (userFindErr: any, target: IUser) => {
			if (userFindErr !== null) {
				return reject(userFindErr);
			} else if (target === null) {
				return reject('target-not-found');
			}
			UserMute.findOne({
				target: targetId,
				from: from.id
			}, (muteFindErr: any, userMute: IUserMute) => {
				if (muteFindErr !== null) {
					return reject(muteFindErr);
				} else if (userMute !== null) {
					return reject('already-mute');
				}
				UserMute.create({
					target: targetId,
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
