export default function Web() {
  async function createFakeUser() {
    await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify({ id: 'foo' }),
    });
  }

  return (
    <div>
      <h1>Web</h1>
      <button onClick={() => createFakeUser()}>Trigger</button>
    </div>
  );
}
