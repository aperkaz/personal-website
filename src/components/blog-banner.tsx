import Image from 'next/image';
import { Box, BoxProps, Link } from '@chakra-ui/react';
import { FaFreeCodeCamp } from 'react-icons/fa';

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
  bannerBg: string;
  bannerComponent: BannerComponent;
  externalUrl?: string;
}

const BlogBanner = ({ alt, banner, bannerBg, bannerComponent, externalUrl, ...props }: Props) => (
  <Box
    sx={{
      img: {
        borderRadius: '10px',
      },
    }}
    m="auto"
    mb={16}
    borderRadius="10px"
    bg={bannerBg}
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
        <Image src={banner} width="800" height="300" alt={alt} />
        {externalUrl && (
          <Link
            href={externalUrl}
            ml={2}
            mr={1}
            isExternal
            whiteSpace="nowrap"
            _hover={{ color: '#3bf11f' }}
            style={{
              position: 'absolute',
              right: '20px',
              bottom: '20px',
              background: 'grey',
              padding: '0.5rem 1rem',
              borderRadius: '16px',
            }}
          >
            LogRocket 🚀
            {/* <Box display="inline-block" as={FaFreeCodeCamp} mb="2px" _hover={{ color: '#3bf11f' }} /> */}
          </Link>
        )}
      </Box>
    )}
  </Box>
);
export default BlogBanner;
