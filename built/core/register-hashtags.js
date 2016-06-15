"use strict";
const db_1 = require('../db/db');
function default_1(me, hashtags) {
    hashtags.forEach(hashtag => {
        hashtag = hashtag.toLowerCase();
        db_1.Hashtag.findOne({
            name: hashtag
        }, (err, existHashtag) => {
            if (existHashtag === null) {
                db_1.Hashtag.create({
                    name: hashtag,
                    users: [me.id]
                });
            }
            else {
                const meExist = existHashtag.users.filter((id) => {
                    return id.toString() === me.id.toString();
                });
                if (meExist.length === 0) {
                    existHashtag.count++;
                    existHashtag.users.push(me.id);
                    existHashtag.markModified('users');
                    existHashtag.save();
                }
            }
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
