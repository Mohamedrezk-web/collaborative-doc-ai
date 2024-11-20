import { Liveblocks } from '@liveblocks/node';

const key = process.env.LIVEBLOCKS_KRY;

if (!key) {
  throw new Error('LIVEBLOCKS_KRY is not defined');
}

const liveblocks = new Liveblocks({
  secret: key,
});
export default liveblocks;
