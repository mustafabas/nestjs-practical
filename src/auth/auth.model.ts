import { Document } from 'mongoose';

export interface User extends Document {
  readonly userName: string;
  readonly password: number;
}
