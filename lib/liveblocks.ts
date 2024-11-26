import { Liveblocks } from '@liveblocks/node';

const key = process.env.LIVEBLOCKS_KEY;

if (!key) {
  throw new Error('LIVEBLOCKS_KEY is not defined');
}

const liveblocks = new Liveblocks({
  secret: key,
});
export default liveblocks;
