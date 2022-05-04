import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';

export type SubRedditDocument = SubReddit & Document;

@Schema()
export class SubReddit {
  title: string;
  name:string;
  display_name: string;
  id: string;
  subscribers: number;
  created: number;
  created_at: Date;
}

export const SubRedditSchema = new mongoose.Schema(
  {
    display_name: String,
    title: String,
    name: { type: String, required: true, unique: true }, 
    id: { type: String, required: true, unique: true },
    created_at: { type: Date, required: true, default: Date.now },
    created: { type: Number },
  },
  { strict: false },
);
