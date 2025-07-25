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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <main style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', flex: '1' }}>
        <h1>Empretienda a Wix</h1>
        <p style={{ marginBottom: '20px', lineHeight: '1.5' }}>
          Esta herramienta te permite convertir archivos Excel exportados desde Empretienda al formato CSV compatible con Wix. 
          Simplemente sube tu archivo Excel y obtendrás un archivo CSV listo para importar en tu tienda Wix.
        </p>
        <form onSubmit={handleSubmit} encType="multipart/form-data" style={{ marginTop: '20px' }}>
          <div style={{ marginBottom: '15px' }}>
            <input
              type="file"
              name="file"
              accept=".xlsx"
              required
              disabled={isLoading}
              style={{ marginBottom: '10px' }}
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            style={{
              padding: '8px 16px',
              backgroundColor: '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
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
      </main>
      <footer style={{ 
        padding: '20px', 
        textAlign: 'center',
        borderTop: '1px solid #eaeaea',
        marginTop: 'auto'
      }}>
        <p style={{ marginBottom: '0' }}>
          Crédito: Adrián Steinsleger (
          <a 
            href="https://www.linkedin.com/in/adriansteinsleger/" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              color: '#0070f3',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}
          >
            LinkedIn
          </a>
          {' '}/{' '}
          <a 
            href="https://github.com/steinsleger" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              color: '#0070f3',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}
          >
            GitHub
          </a>
          )
        </p>
      </footer>
    </div>
  );
};

export default Home;
