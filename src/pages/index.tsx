import { Box, Flex, Link, useColorMode, useColorModeValue, Tooltip } from '@chakra-ui/react';
import { FaReact, FaNodeJs } from 'react-icons/fa';
import { SiTypescript, SiStorybook, SiElectron } from 'react-icons/si';

import Header from '../components/header';
import Paragraph from '../components/paragraph';
import Avatar from '../components/avatar';
import { MotionBox, MotionFlex } from '../components/motion';

const ANIMATION_DURATION = 0.5;

// TODOWNOW: unify with other colors
const ORANGE = '#ff9400';
const PURPLE = '#ff007a';
const TURQUOISE = '#00e0ff';
const GREEN = '#38ff00';
// TODONOW: add effect to image from https://gatsby-simplefolio.netlify.app/
export default function Home() {
  const { colorMode } = useColorMode();

  const linkColor = useColorModeValue('blue.500', 'blue.400');

  return (
    <Flex w="100%" direction="column" align="center">
      <Flex direction={['column', 'column', 'row']} alignContent="center">
        <MotionBox
          opacity="0"
          initial={{
            translateX: -150,
            opacity: 0,
          }}
          animate={{
            translateX: 0,
            opacity: 1,
            transition: {
              duration: ANIMATION_DURATION,
            },
          }}
          m="auto"
          mb={[16, 16, 'auto']}
        >
          <Avatar size={220} border="3px solid #ededed" />
        </MotionBox>
        <MotionFlex
          ml={['auto', 'auto', 16]}
          maxW="500px"
          opacity="0"
          justify="center"
          direction="column"
          initial={{
            opacity: 0,
            translateX: 150,
          }}
          animate={{
            opacity: 1,
            translateX: 0,
            transition: {
              duration: ANIMATION_DURATION,
            },
          }}
        >
          <Header emoji="👋" mt={0}>
            Hello there!
          </Header>
          <Box as="h2" fontSize="2xl" fontWeight="400">
            My name is{' '}
            <Box as="strong" fontWeight="600">
              Alain
            </Box>{' '}
            and I&apos;m a{' '}
            <Box as="span" whiteSpace="nowrap">
              Freelance Frontend Engineer 👨‍💻
            </Box>
          </Box>
          <Box as="h2" fontSize="2xl" fontWeight="400" mt="8">
            I occasionally write for
            <Link
              href="https://www.freecodecamp.org/news/author/aperkaz"
              ml={2}
              mr={1}
              isExternal
              whiteSpace="nowrap"
              _hover={{ textDecor: 'none', color: '#1fa1f1' }}
            >
              <Box as="span" borderBottom="1px solid currentColor">
                FreeCodeCamp
              </Box>
            </Link>{' '}
            and
            <Link
              href="https://blog.logrocket.com/author/alainperkaz"
              ml={2}
              mr={1}
              isExternal
              _hover={{ textDecor: 'none', color: '#1fa1f1' }}
            >
              <Box as="span" borderBottom="1px solid currentColor">
                LogRocket
              </Box>
              .
            </Link>
          </Box>
        </MotionFlex>
      </Flex>
      <MotionBox
        w="100%"
        opacity="0"
        initial={{
          translateY: 80,
        }}
        animate={{
          translateY: 0,
          opacity: 1,
          transition: {
            delay: ANIMATION_DURATION,
            duration: ANIMATION_DURATION,
          },
        }}
      ></MotionBox>
      <MotionFlex
        mt={[6, 12]}
        w="100%"
        align="left"
        direction="column"
        opacity="0"
        animate={{
          opacity: 1,
          transition: {
            delay: ANIMATION_DURATION * 1.5,
            duration: ANIMATION_DURATION,
          },
        }}
      >
        <Flex w="100%" align="left" direction="column">
          <Header id="work story">The tech stack 🚀</Header>
          <Paragraph>
            I am most comfortable writting <b>TypeScript</b>, for the browser, native apps, and backend.
          </Paragraph>
          <Paragraph>
            In the frontend, I prefer <b>React.js</b> + the state management library of the week.
          </Paragraph>
          <Flex w="100%" align="center" direction="row" justify="center" mt={4}>
            <Tooltip label="Scalable JS 📈">
              <Box>
                <Box as={SiTypescript} mb="4px" size="50px" color="#1fa1f1" margin="1rem" />
              </Box>
            </Tooltip>
            <Tooltip label="One-way data-flow + pure components = ❤️">
              <Box>
                <Box as={FaReact} mb="4px" size="50px" color="#1fa1f1" margin="1rem" />
              </Box>
            </Tooltip>
            <Tooltip label="Storybook.js for component libraries 📚">
              <Box>
                <Box as={SiStorybook} mb="4px" size="50px" color="#1fa1f1" margin="1rem" />
              </Box>
            </Tooltip>
            <Tooltip label="Node.js for backend 🎉">
              <Box>
                <Box as={FaNodeJs} mb="4px" size="50px" color="#1fa1f1" margin="1rem" />
              </Box>
            </Tooltip>
            <Tooltip label="Electron.js for desktop apps 🖥">
              <Box>
                <Box as={SiElectron} mb="4px" size="50px" color="#1fa1f1" margin="1rem" />
              </Box>
            </Tooltip>
          </Flex>
        </Flex>
      </MotionFlex>

      <MotionFlex
        mt={[6, 12]}
        w="100%"
        align="left"
        direction="column"
        opacity="0"
        animate={{
          opacity: 1,
          transition: {
            delay: ANIMATION_DURATION * 2,
            duration: ANIMATION_DURATION,
          },
        }}
      >
        <Flex w="100%" align="left" direction="column">
          <Header id="contact">Contact ✉️</Header>
          <Paragraph>
            Do you want to{' '}
            <Box as="strong" fontWeight="600">
              work together
            </Box>{' '}
            or talk about{' '}
            <Box as="strong" fontWeight="600">
              frontend development
            </Box>
            ?
          </Paragraph>
          <Paragraph>
            Feel free to{' '}
            <Link color={linkColor} href="mailto:alainperkaz@gmail.com" isExternal>
              send me an email
            </Link>
            .
          </Paragraph>
        </Flex>
      </MotionFlex>
    </Flex>
  );
}
