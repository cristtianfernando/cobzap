import './globals.css';

export const metadata = {
  title: 'CobZap | Plataforma de WhatsApp para Operações de Cobrança',
  description: 'CobZap é a plataforma de WhatsApp para operações de cobrança: atendimento, disparo em massa e automação, via API Oficial da Meta ou WhatsApp Web. Conecta ao sistema de cobrança que você já usa. A partir de R$47/usuário/mês.',
  keywords: 'sistema de cobrança WhatsApp, plataforma de WhatsApp para cobrança, API WhatsApp cobrança, API oficial Meta cobrança, assessoria de cobrança WhatsApp, escritório de cobrança WhatsApp, WhatsApp para escritório de advocacia, call center cobrança WhatsApp, telemarketing cobrança WhatsApp, régua de cobrança WhatsApp, automação de cobrança WhatsApp, recuperação de dívidas WhatsApp, cobzap, disparo em massa WhatsApp, risco de bloqueio WhatsApp cobrança, inadimplência WhatsApp, cobrança ativa WhatsApp',
  metadataBase: new URL('https://www.cobzap.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: '/',
    title: 'CobZap | Plataforma de WhatsApp para Operações de Cobrança',
    description: 'Atendimento, disparo em massa e automação de cobrança em WhatsApp. Conecta ao seu sistema, sem substituir. A partir de R$47/usuário/mês.',
    images: [
      {
        url: '/logo.png',
      },
    ],
    locale: 'pt_BR',
    siteName: 'CobZap',
  },
  twitter: {
    card: 'summary_large_image',
    url: '/',
    title: 'CobZap | Plataforma de WhatsApp para Operações de Cobrança',
    description: 'Atendimento, disparo em massa e automação de cobrança em WhatsApp. Conecta ao seu sistema, sem substituir.',
    images: ['/logo.png'],
  },
};

export default function RootLayout({ children }) {
  // LD+JSON do SoftwareApplication
  const ldSoftware = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "CobZap",
    "url": "https://www.cobzap.com",
    "logo": "https://www.cobzap.com/logo.png",
    "operatingSystem": "All",
    "applicationCategory": "BusinessApplication",
    "description": "CobZap é uma plataforma de WhatsApp para operações de cobrança. Fornece atendimento multiagente, disparo em massa e régua automatizada, via API Oficial da Meta (WhatsApp Business Cloud API) ou WhatsApp Web. Conecta a sistemas de cobrança e CRM existentes via API REST e Webhooks, sem substituí-los.",
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "BRL",
      "lowPrice": "47.00",
      "highPrice": "97.00",
      "offerCount": "6"
    },
    "featureList": [
      "Atendimento multiagente com fila e ticket",
      "Disparo em massa com variáveis dinâmicas",
      "Régua de cobrança automatizada",
      "API Oficial do WhatsApp da Meta (Cloud API)",
      "Integração via WhatsApp Web (QR Code)",
      "Dashboard de performance em tempo real",
      "Relatórios avançados por usuário e fila",
      "Webhooks e API REST para integração com ERP/CRM",
      "Conformidade com LGPD",
      "Histórico completo de conversas"
    ]
  };

  // LD+JSON da Organization
  const ldOrg = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "CobZap",
    "url": "https://www.cobzap.com",
    "logo": "https://www.cobzap.com/logo.png",
    "email": "contato@cobzap.com",
    "telephone": "+55-41-99549-1030",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+55-41-99549-1030",
      "contactType": "customer service",
      "availableLanguage": "Portuguese"
    },
    "sameAs": [
      "https://www.linkedin.com/company/cobzap",
      "https://www.instagram.com/cobzap/",
      "https://www.facebook.com/profile.php?id=61584667976947"
    ]
  };

  // LD+JSON do WebSite
  const ldWebSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "CobZap",
    "url": "https://www.cobzap.com",
    "description": "Plataforma de WhatsApp para operações de cobrança, com API Oficial da Meta e WhatsApp Web. Atendimento, disparo em massa e automação, conectados ao sistema de cobrança que você já usa.",
    "inLanguage": "pt-BR"
  };

  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ldSoftware) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ldOrg) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ldWebSite) }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
