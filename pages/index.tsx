import type { NextPage } from 'next';
import { useState, FormEvent } from 'react';

const Home: NextPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const fileInput = e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement;
    const originalFileName = fileInput.files?.[0]?.name || 'converted-file';
    const newFileName = originalFileName.replace(/\.[^/.]+$/, '') + '.csv';

    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error en la conversión');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = newFileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar el archivo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Empretienda a Wix</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="file"
          name="file"
          accept=".xlsx"
          required
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Convirtiendo...' : 'Convertir'}
        </button>
        {isLoading && (
          <div style={{ marginTop: '10px' }}>
            <p>Procesando archivo, por favor espere...</p>
          </div>
        )}
        {error && (
          <div style={{ marginTop: '10px', color: 'red' }}>
            <p>{error}</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default Home;
