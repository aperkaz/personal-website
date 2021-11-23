import Head from 'next/head';
import { DefaultSeo } from 'next-seo';
import { PropsWithChildren } from 'react';
import { chakra, Box, CSSReset, Flex, useColorModeValue } from '@chakra-ui/react';
import Navigation from './navigation';
import { websiteUrl } from '../utils/consts';

const Wrapper = chakra(Flex, {
  baseStyle: {
    w: ['90%', '85%', '80%'],
    maxW: 900,
    mx: 'auto',
  },
});

const title = 'Alain - FE Engineer';
const description = "Hey! My name is Alain and I'm a Freelance Frontend Engineer.";

const Layout = (props: PropsWithChildren<unknown>) => {
  const headerBg = useColorModeValue('gray.100', 'gray.700');

  return (
    <>
      <DefaultSeo
        title={title}
        description={description}
        canonical={websiteUrl}
        openGraph={{
          type: 'website',
          url: websiteUrl,
          title,
          description,
          images: [{ url: `${websiteUrl}images/avatar.jpg` }],
        }}
      />
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" sizes="196x196" href="/images/favicon-196.png" />
        <link rel="apple-touch-icon" href="images/apple-icon-180.png" />
        <script async src="https://cdn.splitbee.io/sb.js" />
      </Head>
      <CSSReset />
      <Box bg={headerBg}>
        <Wrapper py={3} alignItems="center">
          <Navigation />
        </Wrapper>
      </Box>
      <Wrapper pt={8}>{props.children}</Wrapper>
      <Box mt={16} mb={[8, 8, 6]} textAlign="center">
        Built with{' '}
        <Box as="strong" fontWeight="600">
          care
        </Box>{' '}
        using Next.js
      </Box>
    </>
  );
};
export default Layout;
