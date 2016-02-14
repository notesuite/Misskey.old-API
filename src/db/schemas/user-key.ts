import {Schema, Connection, Document, Model} from 'mongoose';

export default function(db: Connection): Model<Document> {
	const schema = new Schema({
		app: { type: Schema.Types.ObjectId, required: false, default: null, ref: 'Application' },
		key: { type: String, required: true, unique: true },
		user: { type: Schema.Types.ObjectId, required: true, ref: 'User' }
	});

	return db.model('UserKey', schema, 'UserKeys');
}
