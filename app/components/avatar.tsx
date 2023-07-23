import type { BoxProps } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";

interface Props extends BoxProps {
  size: number;
}

const Avatar = ({ size, border, ...boxProps }: Props) => (
  <Box sx={{ img: { borderRadius: "50%", border } }} {...boxProps}>
    <img
      src="/images/avatar.jpg"
      width={size}
      height={size}
      alt="Alain Perkaz"
    />
  </Box>
);
export default Avatar;
