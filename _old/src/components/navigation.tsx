import NextLink from 'next/link';
import {
  Box,
  Link,
  IconButton,
  Button,
  Divider,
  Center,
  useColorModeValue,
  useBreakpointValue,
} from '@chakra-ui/react';
import ColorModeSwitcher from './color-mode-switcher';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import UnderlinedText from './underlined-text';
import Avatar from './avatar';

const Navigation = () => {
  const buttonSize = useBreakpointValue({ base: 'sm', sm: 'md' });
  return (
    <>
      <NextLink href="/">
        <Link display="flex" alignItems="center">
          <Avatar size={44} />
          <Box ml={4} display={['none', 'block']}>
            <UnderlinedText color="rgb(0, 255, 38)" h="3px">
              <strong>Alain</strong>
            </UnderlinedText>
          </Box>
        </Link>
      </NextLink>
      <Box flexGrow={1} />
      <Box>
        <NextLink href="/blog">
          <Link _hover={undefined}>
            <Button variant="nav" size={buttonSize}>
              Technical blog
            </Button>
          </Link>
        </NextLink>
      </Box>
      <Center height="25px" px={[1, 3]}>
        <Divider orientation="vertical" borderColor={useColorModeValue('gray.400', 'gray.500')} />
      </Center>
      <Box>
        <Link href="https://github.com/aperkaz" isExternal>
          <IconButton
            size="md"
            fontSize="lg"
            variant="nav"
            color="#1fa1f1"
            icon={<FaGithub />}
            aria-label="Welcome to my GitHub profile!"
          />
        </Link>
        <Link href="https://www.linkedin.com/in/alain-perkaz/" isExternal>
          <IconButton
            size="md"
            fontSize="lg"
            variant="nav"
            color="#1fa1f1"
            icon={<FaLinkedin />}
            aria-label="Welcome to my LinkedIn profile!"
          />
        </Link>
        <ColorModeSwitcher />
      </Box>
    </>
  );
};
export default Navigation;
