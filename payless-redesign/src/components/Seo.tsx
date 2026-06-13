import { Helmet } from "react-helmet-async";

const SITE = "https://propfirmpayless.com";
const DEFAULT_OG = "https://bkrtldtwnrlduzjmwsgt.supabase.co/storage/v1/object/public/og-images/_1774281317639.jpg";

export default function Seo({
  title,
  description,
  image = DEFAULT_OG,
  path,
  type = "website",
}: {
  title: string;
  description?: string;
  image?: string;
  path?: string;
  type?: string;
}) {
  const url = path ? `${SITE}${path}` : undefined;
  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {url && <link rel="canonical" href={url} />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="PAYLESS" />
      <meta property="og:locale" content="he_IL" />
      {url && <meta property="og:url" content={url} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
