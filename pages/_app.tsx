import type { AppProps } from 'next/app'
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Conversor de Empretienda a Wix - Importa tu catálogo fácilmente</title>
        <meta name="keywords" content="empretienda, wix, conversor, migración, productos, catálogo, excel, csv" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://et2wix.vercel.app" />
        <meta property="og:title" content="Conversor de Empretienda a Wix" />
        <meta property="og:description" content="Convierte fácilmente tus archivos Excel de Empretienda al formato CSV de Wix. Herramienta gratuita de conversión para migrar tu catálogo de productos." />
        <meta property="og:image" content="https://et2wix.vercel.app/images/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="es_ES" />
        <meta property="og:site_name" content="ET2Wix" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://et2wix.vercel.app" />
        <meta name="twitter:title" content="Conversor de Empretienda a Wix" />
        <meta name="twitter:description" content="Convierte fácilmente tus archivos Excel de Empretienda al formato CSV de Wix. Herramienta gratuita de conversión para migrar tu catálogo de productos." />
        <meta name="twitter:image" content="https://et2wix.vercel.app/images/og-image.png" />
        <meta name="twitter:image:alt" content="ET2Wix - Conversor de Empretienda a Wix" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
