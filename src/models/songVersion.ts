import {
  DataTypes,
  Model,
  type CreationOptional,
  type ForeignKey,
  type InferAttributes,
  type InferCreationAttributes,
  type NonAttribute,
} from 'sequelize';
import { sequelize } from '../db';
import type { Song } from './song';

export class SongVersion extends Model<
  InferAttributes<SongVersion>,
  InferCreationAttributes<SongVersion>
> {
  declare id: CreationOptional<number>;
  declare version: string | null;
  declare links: object;
  declare creditsRaw: string;
  declare songId: ForeignKey<Song['id']>;
  declare song: NonAttribute<Song>;
}

SongVersion.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    version: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    links: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    creditsRaw: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    songId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
  },
);
