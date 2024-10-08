import { NextSeo, BlogJsonLd, BreadcrumbJsonLd } from 'next-seo';
import { websiteUrl } from '../utils/consts';

const BlogSeo = ({ title, summary, publishedAt, url, slug, readingTime, date }: any) => {
  const isoDate = new Date(publishedAt).toISOString();
  const featuredImage = {
    url: `${websiteUrl}api/og-image?title=${encodeURIComponent(title)}&slug=/blog/${slug}&date=${encodeURIComponent(
      date,
    )}&rt=${encodeURIComponent(readingTime.text)}`,
    alt: title,
    width: 1200,
    height: 630,
  };

  return (
    <>
      <NextSeo
        title={`${title} - Alain Perkaz`}
        description={summary}
        canonical={url}
        openGraph={{
          type: 'article',
          article: {
            publishedTime: isoDate,
          },
          url,
          title,
          description: summary,
          images: [featuredImage],
        }}
        twitter={{
          handle: '@aperkaz',
          cardType: 'summary_large_image',
        }}
      />
      <BreadcrumbJsonLd
        itemListElements={[
          {
            position: 1,
            name: 'Blog',
            item: `${websiteUrl}blog`,
          },
          {
            position: 2,
            name: title,
            item: url,
          },
        ]}
      />
      <BlogJsonLd
        authorName="Alain Perkaz"
        dateModified={isoDate}
        datePublished={isoDate}
        description={summary}
        images={[featuredImage.url]}
        title={title}
        url={url}
      />
    </>
  );
};

export default BlogSeo;
