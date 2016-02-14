import {Schema, Connection, Document, Model} from 'mongoose';
import * as mongooseAutoIncrement from 'mongoose-auto-increment';

export default function(db: Connection): Model<Document> {
	mongooseAutoIncrement.initialize(db);

	const schema = new Schema({
		bookmarksCount: { type: Number, required: false, default: 0 },
		createdAt: { type: Date, required: true, default: Date.now },
		cursor: { type: Number },
		pinnedPost: { type: Schema.Types.ObjectId, required: false, default: null, ref: 'BBSPost' },
		title: { type: String, required: true },
		user: { type: Schema.Types.ObjectId, required: true, ref: 'User' }
	});

	if (!(<any>schema).options.toObject) {
		(<any>schema).options.toObject = {};
	}
	(<any>schema).options.toObject.transform = (doc: any, ret: any) => {
		ret.id = doc.id;
		delete ret._id;
		delete ret.__v;
	};

	// Auto increment
	schema.plugin(mongooseAutoIncrement.plugin, {
		model: 'BBSTopic',
		field: 'cursor'
	});

	return db.model('BBSTopic', schema, 'BBSTopics');
}
