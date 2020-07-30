import mongoose from 'mongoose';

export type ListDocument = mongoose.Document & {
  name: string;
};

const listSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true },
  },
  { timestamps: true },
);

export const List = mongoose.model<ListDocument>('List', listSchema);
