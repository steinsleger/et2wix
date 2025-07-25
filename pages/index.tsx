import type { NextPage } from 'next';

const Home: NextPage = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Empretienda a Wix</h1>
      <form action="/api/convert" method="post" encType="multipart/form-data">
        <input type="file" name="file" accept=".xlsx" required />
        <button type="submit">Convertir</button>
      </form>
    </div>
  );
};

export default Home;
