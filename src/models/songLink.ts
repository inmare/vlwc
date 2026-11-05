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

export class SongLink extends Model<
  InferAttributes<SongLink>,
  InferCreationAttributes<SongLink>
> {
  declare id: CreationOptional<number>;
  declare url: string;
  declare platform: string | null;
  declare songId: ForeignKey<Song['id']>;
  declare song: NonAttribute<Song>;
}

SongLink.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    platform: {
      type: DataTypes.STRING,
      allowNull: true,
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
