import { Document } from 'mongoose';

export interface UserModelInterface extends Document {
  name: string;
  email: string;
  password: string;
}
