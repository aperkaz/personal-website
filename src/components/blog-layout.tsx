import BlogSeo from './blog-seo';
import { PropsWithChildren } from 'react';
import { format, parseISO } from 'date-fns';
import { Box, Text, Flex, Link } from '@chakra-ui/react';
import { websiteUrl } from '../utils/consts';
import Avatar from './avatar';
import { FaTwitter } from 'react-icons/fa';
import BlogBanner from './blog-banner';
import ScrollProgressbar from './scroll-progessbar';

export default function BlogLayout({ frontMatter, children }: PropsWithChildren<any>) {
  const date = format(parseISO(frontMatter.publishedAt), 'MMMM dd, yyyy');

  const tweetText = `Thank you @aperkaz for writing this helpful article.
  
  ${websiteUrl}blog/${frontMatter.slug}
  `;

  return (
    <>
      <BlogSeo url={`${websiteUrl}blog/${frontMatter.slug}`} date={date} {...frontMatter} />
      <ScrollProgressbar />
      <Box as="article" maxW="100%">
        <Box as="header" mb={10}>
          <Text as="h1" fontSize={['2rem', '2.3rem', '2.8rem']}>
            {frontMatter.title}
          </Text>
          <Box fontSize="1.2rem" mt={3} color="gray.500">
            <Text as="span">{date}</Text>
            <Box as="span" mx={3}>
              •
            </Box>
            <Text as="span">{frontMatter.readingTime.text}</Text>
          </Box>
        </Box>
        <section>
          <BlogBanner
            alt={frontMatter.title}
            banner={frontMatter.banner}
            bannerBg={frontMatter.bannerBg}
            bannerComponent={frontMatter.bannerComponent}
            freeCodeCamp={frontMatter.freeCodeCamp}
          />
          {children}
        </section>
        <Flex direction={['column', 'column', 'row']} mb={12} mt={24}>
          <Avatar size={220} m="auto" mr={['auto', 'auto', 16]} mb={[16, 16, 'auto']} border="3px solid #ededed" />
          <Flex maxW={500} m="auto" ml={['auto', 'auto', 0]} justify="center" direction="column">
            <Box as="h2" fontSize="2xl" fontWeight="400">
              Hi, my name is{' '}
              <Box as="strong" fontWeight="600">
                Alain
              </Box>{' '}
              👋
            </Box>
            <Box as="h2" fontSize="2xl" fontWeight="400" mt={5}>
              If you liked this, share it on{' '}
              <Link
                href={`http://twitter.com/share?text=${tweetText}`}
                ml={2}
                mr={1}
                isExternal
                whiteSpace="nowrap"
                _hover={{ textDecor: 'none', color: '#1fa1f1' }}
              >
                <Box display="inline-block" as={FaTwitter} mb="4px" color="#1fa1f1" />{' '}
                <Box as="span" borderBottom="2px solid currentColor">
                  Twitter
                </Box>
              </Link>
              !
            </Box>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
