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

export class Lyrics extends Model<
  InferAttributes<Lyrics>,
  InferCreationAttributes<Lyrics>
> {
  declare id: CreationOptional<number>;
  declare lyricsJson: object;
  declare rawLyrics: string;
  declare songId: ForeignKey<Song['id']>;
  declare song: NonAttribute<Song>;
}

Lyrics.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    lyricsJson: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    rawLyrics: {
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
