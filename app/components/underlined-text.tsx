import type { PropsWithChildren } from "react";
import { Box } from "@chakra-ui/react";

interface Props {
  color?: string;
  h?: string;
  zIndex?: number;
}
const UnderlinedText = (props: PropsWithChildren<Props>) => (
  <Box as="span" display="inline-block" position="relative">
    {props.children}
    <Box
      as="span"
      display="block"
      position="absolute"
      bg={
        props.color
          ? props.color
          : "linear-gradient(280deg, rgba(34,193,195,1) 0%, rgba(253,187,45,1) 100%);"
      }
      w={"100%"}
      h={props.h || "4px"}
      bottom={0}
    />
  </Box>
);

export default UnderlinedText;
