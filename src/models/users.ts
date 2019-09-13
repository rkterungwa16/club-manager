import { DatasourceConnection } from '../datasource';
import { UserModelInterface } from './model.types';

const mongooseConnection = DatasourceConnection.databaseConnection;

import { Schema } from 'mongoose';

class UserSchema {
  static get schema() {
    return new Schema({
      name: {
        type: String,
      },
      email: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
      roles: {
        type: [String],
      },
    });
  }
}

export const Users = mongooseConnection.model<UserModelInterface>('Users', UserSchema.schema);
