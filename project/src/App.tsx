import React, { useState } from 'react';
import { Download, Facebook, Loader2 } from 'lucide-react';

function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [downloadLink, setDownloadLink] = useState('');
  const [videoTitle, setVideoTitle] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.includes('facebook.com')) {
      setError('Por favor, ingresa un enlace válido de Facebook Reels');
      return;
    }

    setLoading(true);
    setError('');
    setDownloadLink('');
    setVideoTitle('');

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/download-reel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al procesar el video');
      }

      if (!data.url) {
        throw new Error('No se pudo obtener el enlace de descarga');
      }

      setDownloadLink(data.url);
      if (data.title) {
        setVideoTitle(data.title);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error al procesar el video. Por favor, verifica el enlace e intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-700">
      <div className="container mx-auto px-4 py-16">
        {/* SEO Optimized Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Descargador de Reels de Facebook
          </h1>
          <h2 className="text-xl text-blue-100 max-w-2xl mx-auto">
            Descarga tus Reels favoritos de Facebook gratis y rápido | Descargar videos de Facebook Reels
          </h2>
        </header>

        <div className="max-w-xl mx-auto bg-white rounded-xl shadow-2xl p-6 md:p-8">
          <div className="flex items-center justify-center mb-8">
            <Facebook className="w-12 h-12 text-blue-600" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label 
                htmlFor="url" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Ingresa el enlace del Reel de Facebook
              </label>
              <input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.facebook.com/reel/..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center space-x-2 transition duration-200 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Descargar Reel</span>
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {downloadLink && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <p className="text-green-700 font-medium mb-3">
                ¡Video listo para descargar!
              </p>
              {videoTitle && (
                <p className="text-gray-600 text-sm mb-3">
                  {videoTitle}
                </p>
              )}
              <a
                href={downloadLink}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700"
              >
                <Download className="w-5 h-5" />
                <span>Descargar video</span>
              </a>
            </div>
          )}

          {/* SEO Content */}
          <div className="mt-8 prose prose-sm text-gray-600">
            <h3 className="text-lg font-semibold text-gray-800">
              Cómo descargar Reels de Facebook
            </h3>
            <ol className="list-decimal list-inside space-y-2">
              <li>Copia el enlace del Reel de Facebook que deseas descargar</li>
              <li>Pega el enlace en el campo de arriba</li>
              <li>Haz clic en el botón "Descargar Reel"</li>
              <li>¡Listo! Descarga tu video</li>
            </ol>
          </div>
        </div>

        {/* Footer with SEO Keywords */}
        <footer className="mt-12 text-center text-blue-100 text-sm">
          <p className="mb-2">
            Descarga videos de Facebook Reels | Descargar Reels FB | 
            Convertidor de Reels Facebook | Bajar videos de Facebook
          </p>
          <p>
            La mejor herramienta para descargar Reels de Facebook gratis en 2024
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;