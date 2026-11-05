import {
  DataTypes,
  Model,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
  type NonAttribute,
} from 'sequelize';
import { sequelize } from '../db';
import type { PageData } from '../schemas/page';
import type { Song } from './song';

export class Page extends Model<
  InferAttributes<Page>,
  InferCreationAttributes<Page>
> {
  declare id: CreationOptional<number>;
  declare url: string;
  declare rawHtml: string;
  declare fetchedAt: Date;
  declare parseStatus: PageData['parseStatus'];
  declare song?: NonAttribute<Song>;
}

Page.init(
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
    rawHtml: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    fetchedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    parseStatus: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
  },
);
