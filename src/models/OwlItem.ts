import mongoose from 'mongoose';
import { OwlItems } from 'owl-types/types/OwlItems';

export type OwlItemDocument = OwlItems & mongoose.Document;

const owlItemSchema = new mongoose.Schema(
  {
    items: Array,
    list_id: String,
  },
  { timestamps: true },
);

export const OwlItemM = mongoose.model<OwlItemDocument>(
  'OwlItem',
  owlItemSchema,
);
