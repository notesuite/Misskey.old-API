import {UserMute, User} from '../../db/db';
import {IUserMute, IUser} from '../../db/interfaces';

/**
 * ユーザーのミュートを解除します
 * @param from: ミュートを解除するユーザー
 * @param toId: ミュートを解除されるユーザーID
 */
export default function(from: IUser, toId: string): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		if (from.id.toString() === toId) {
			reject('to-is-you');
		} else {
			User.findById(toId, (userFindErr: any, to: IUser) => {
				if (userFindErr !== null) {
					reject(userFindErr);
				} else if (to === null) {
					reject('to-not-found');
				} else {
					UserMute.findOne({
						to: toId,
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
