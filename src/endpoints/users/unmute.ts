import {UserMute, User} from '../../db/db';
import {IUserMute, IUser} from '../../db/interfaces';

/**
 * ユーザーのミュートを解除します
 * @param from: ミュートを解除するユーザー
 * @param targetId: ミュートを解除されるユーザーID
 */
export default function(from: IUser, targetId: string): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		if (from.id.toString() === targetId) {
			reject('target-is-you');
		} else {
			User.findById(targetId, (userFindErr: any, target: IUser) => {
				if (userFindErr !== null) {
					reject(userFindErr);
				} else if (target === null) {
					reject('target-not-found');
				} else {
					UserMute.findOne({
						target: targetId,
						from: from.id
					}, (muteFindErr: any, userMute: IUserMute) => {
						if (muteFindErr !== null) {
							reject(muteFindErr);
						} else if (userMute === null) {
							reject("not-mute");
						} else {
							userMute.remove((muteRemoveErr: any) => {
								if (muteRemoveErr !== null) {
									reject(muteRemoveErr);
								} else {
									resolve();
								}
							});
						}
					});
				}
			});
		}
	});
}
