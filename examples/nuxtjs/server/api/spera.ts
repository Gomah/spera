import { Receiver } from '@spera/plugin-qstash';
import { spera } from '../../.spera';
import { withSpera } from '@spera/nuxtjs';

const isDev = process.env['NODE_ENV'] === 'development';

function handler() {
  // This should be displayed after the background function is processed :)
  console.log('Hey there!');
  return {
    success: true,
  };
}

export default withSpera(handler, spera);
