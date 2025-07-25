import type { AppProps } from 'next/app'
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Conversor de Empretienda a Wix - Importa tu catálogo fácilmente</title>
        <meta name="keywords" content="empretienda, wix, conversor, migración, productos, catálogo, excel, csv" />
        <meta property="og:title" content="Conversor de Empretienda a Wix" />
        <meta property="og:description" content="Convierte fácilmente tus archivos Excel de Empretienda al formato CSV de Wix. Herramienta gratuita de conversión para migrar tu catálogo de productos." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://et2wix.vercel.app" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
