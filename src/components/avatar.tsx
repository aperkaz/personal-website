import Image from 'next/image';
import { Box, BoxProps } from '@chakra-ui/react';

interface Props extends BoxProps {
  size: number;
}

const Avatar = ({ size, border, ...boxProps }: Props) => (
  <Box sx={{ img: { borderRadius: '50%', border } }} {...boxProps}>
    <Image loading="eager" src="/images/avatar.jpg" width={size} height={size} alt="Alain Perkaz" />
  </Box>
);
export default Avatar;
