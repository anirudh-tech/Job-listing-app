import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  subcategories: string[];
  createdAt: Date;
}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true, unique: true, trim: true },
  subcategories: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
});

if (mongoose.models.Category) {
  delete mongoose.models.Category;
}

export default mongoose.model<ICategory>('Category', CategorySchema);


