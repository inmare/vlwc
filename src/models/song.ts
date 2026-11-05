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
import type { Page } from './page';

export class Song extends Model<
  InferAttributes<Song>,
  InferCreationAttributes<Song>
> {
  declare id: CreationOptional<number>;
  declare title: string;
  declare originalTitle: string;
  declare pageId: ForeignKey<Page['id']>;
  declare page: NonAttribute<Page>;
}

Song.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    originalTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
  },
);
