import { getSongFromId, listSongs, searchSongs } from '../db/query';
import { app } from './app';

type SongListsQuery = {
  afterId?: number;
  limit?: number;
  q?: string;
};

const songListsSchema = {
  querystring: {
    type: 'object',
    properties: {
      afterId: { type: 'integer', minimum: 0, default: 0 },
      limit: {
        type: 'integer',
        minimum: 1,
        maximum: 100,
        default: 100,
      },
    },
  },
};

// Get song lists from database
app.get<{ Querystring: SongListsQuery }>(
  '/api/songlists',
  { schema: songListsSchema },
  async (request) => {
    const { afterId = 0, limit = 100 } = request.query;
    const rows = listSongs(afterId, limit + 1);
    const items = rows.slice(0, limit);

    return {
      items,
      nextCursor: rows.length > limit ? items.at(-1)!.id : null,
    };
  },
);

type SearchQuery = {
  afterId?: number;
  limit?: number;
  q?: string;
};

const serachSchema = {
  querystring: {
    type: 'object',
    properties: {
      q: { type: 'string', maxLength: 100, default: '' },
      afterId: {
        type: 'integer',
        minimum: 0,
        default: 0,
      },
      limit: {
        type: 'integer',
        minimum: 1,
        maximum: 100,
        default: 10,
      },
    },
  },
};

// Search songs from query
app.get<{ Querystring: SearchQuery }>(
  '/api/search',
  { schema: serachSchema },
  async (request) => {
    const { afterId = 0, limit = 10, q = '' } = request.query;
    const rows = searchSongs(q, afterId, limit + 1);
    const items = rows.slice(0, limit);

    return {
      items,
      nextCursor: rows.length > limit ? items.at(-1)!.id : null,
    };
  },
);

// Get songs from id
app.get<{
  Querystring: {
    id: number;
  };
}>(
  '/api/song',
  {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          id: {
            type: 'number',
            minimum: 0,
          },
        },
      },
    },
  },
  async (request) => {
    const { id } = request.query;
    const song = getSongFromId(id);
    return song;
  },
);
