import { spera } from '../../.spera';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // Send some stuff in the background
  await spera.send('app/account.created', {
    id: body.id,
  });

  return {
    success: true,
  };
});
