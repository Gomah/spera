export const name = 'app/account.created';

export interface AccountCreatedPayload {
  id: string;
}

export async function handler(payload: AccountCreatedPayload) {
  const { id } = payload;
  console.info(`Account created: ${id}`);
  return id;
}
