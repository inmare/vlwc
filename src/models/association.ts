import { Lyrics } from './lyrics';
import { Page } from './page';
import { Song } from './song';
import { SongLink } from './songLink';
import { SongVersion } from './songVersion';

Page.hasOne(Song);
Song.belongsTo(Page);

Song.hasMany(SongVersion);
SongVersion.belongsTo(Song);

SongVersion.hasMany(SongLink);
SongLink.belongsTo(SongVersion);

SongVersion.hasOne(Lyrics);
Lyrics.belongsTo(SongVersion);
