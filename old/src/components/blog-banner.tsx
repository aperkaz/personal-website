import Image from 'next/image';
import { Box, BoxProps, Link } from '@chakra-ui/react';
import { IoMdRocket } from 'react-icons/io';
import { FaFreeCodeCamp, FaMedium } from 'react-icons/fa';

// Add image simmer effect: https://github.com/vercel/next.js/blob/canary/examples/image-component/pages/shimmer.js
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === 'undefined' ? Buffer.from(str).toString('base64') : window.btoa(str);

export interface BannerComponent {
  props: BoxProps;
  children: [
    {
      content: string;
      props: BoxProps;
    },
  ];
}

interface Props extends BoxProps {
  alt: string;
  banner: string;
  bannerComponent: BannerComponent;
  externalUrl?: string;
}

const isMediumUrl = (url: string) => url.includes('javascript.plainenglish.io');
const isLogRocketUrl = (url: string) => url.includes('blog.logrocket.com');
const isFreeCodeCampUrl = (url: string) => url.includes('freecodecamp.org');

const BlogBanner = ({ alt, banner, bannerComponent, externalUrl, ...props }: Props) => (
  <Box
    sx={{
      img: {
        borderRadius: '10px',
      },
    }}
    m="auto"
    mb={16}
    borderRadius="10px"
    maxW="800px"
    maxH="300px"
    {...props}
  >
    {bannerComponent && (
      <Box w="100%" sx={{ '&': { w: '100%', pt: '37.5%' } }} pos="relative" {...bannerComponent.props}>
        <Box pos="absolute" left="0" top="0" bottom="0" right="0">
          {bannerComponent.children.map((child: any, index: number) => (
            <Box key={index} {...child.props}>
              {child.content}
            </Box>
          ))}
        </Box>
      </Box>
    )}
    {banner && (
      <Box w="100%" pos="relative" style={{ fontWeight: 'bold' }}>
        <Image
          src={banner}
          width="800"
          height="300"
          alt={alt}
          placeholder="blur"
          blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
        />
        {externalUrl && (
          <Link
            href={externalUrl}
            ml={2}
            mr={1}
            isExternal
            whiteSpace="nowrap"
            _hover={{ color: '#0050b9' }}
            style={{
              position: 'absolute',
              right: '20px',
              bottom: '20px',
              background: 'grey',
              padding: '0.5rem 1rem',
              borderRadius: '16px',
            }}
          >
            {isLogRocketUrl(externalUrl) ? (
              <>
                LogRocket <Box display="inline-block" as={IoMdRocket} mb="2px" />
              </>
            ) : isMediumUrl(externalUrl) ? (
              <>
                Medium <Box display="inline-block" as={FaMedium} mb="2px" />
              </>
            ) : isFreeCodeCampUrl(externalUrl) ? (
              <>
                FreeCodeCamp <Box display="inline-block" as={FaFreeCodeCamp} mb="2px" />
              </>
            ) : (
              <>external</>
            )}
          </Link>
        )}
      </Box>
    )}
  </Box>
);
export default BlogBanner;
