import { Box, Divider, Flex, Link, useColorMode, useColorModeValue, Image as ChakraImage } from '@chakra-ui/react';
import Image from 'next/image';
import { useState } from 'react';
import { FaTwitter, FaFreeCodeCamp } from 'react-icons/fa';

import Header from '../components/header';
import Paragraph from '../components/paragraph';
import CVDescription from '../components/cv-description';
import UntisLogo from '../style/logos/untis-logo';
import CatalystsLogo from '../style/logos/catalysts-logo';
import HtlLogo from '../style/logos/htl-logo';
import Avatar from '../components/avatar';
import { MotionBox, MotionFlex } from '../components/motion';

const ANIMATION_DURATION = 0.5;

const ORANGE = '#ff9400';
const PURPLE = '#ff007a';
const TURQUOISE = '#00e0ff';
const GREEN = '#38ff00';
// TODONOW: add effect to image from https://gatsby-simplefolio.netlify.app/
export default function Home() {
  const { colorMode } = useColorMode();

  const linkColor = useColorModeValue('blue.500', 'blue.400');
  const lieberLieberLogo = useColorModeValue('LieberLieber_Logo.png', 'LieberLieber_Logo_Dark.png');

  return (
    <Flex w="100%" direction="column" align="center">
      <Flex direction={['column', 'column', 'row']}>
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
          <Header underlineColor={ORANGE} emoji="👋" mt={0}>
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
          {/* TODONOW: move this as part of a icon-heavy section */}
          <Box as="h2" fontSize="2xl" fontWeight="400" mt={10}>
            Proficient in{' '}
            <Box as="strong" fontWeight="600">
              React, Node.js, and TypeScript.
            </Box>{' '}
            <br />I occasionally write for
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
            delay: ANIMATION_DURATION - 0.1,
            duration: ANIMATION_DURATION,
          },
        }}
      ></MotionBox>
      {/* TODONOW: remove this section */}
      {/* <MotionFlex
        mt={[6, 12]}
        w="100%"
        align="left"
        direction="column"
        opacity="0"
        animate={{
          opacity: 1,
          transition: {
            delay: ANIMATION_DURATION + ANIMATION_DURATION - 0.2,
            duration: ANIMATION_DURATION,
          },
        }}
      >
        <Header id="projects" underlineColor={PURPLE} emoji="🥐">
          Projects
        </Header>
        <Paragraph>
          Since I&apos;ve started diving into software development I worked on private projects to hone my skills. These
          projects made me the software developer I am today and I still love to work on private projects to keep on
          track with new technologies.
        </Paragraph>
        <Paragraph>Here you can see a list of my most impactful projects.</Paragraph>
        <Box px={[4, 8, 12]}>
          <Divider my={10} />
          <ProjectDescription
            linkColor={linkColor}
            url="https://snappify.io/"
            logo={
              <Flex align="center" justify="center">
                <ChakraImage
                  src="/images/snappify_logo.png"
                  h="90px"
                  w="auto"
                  maxW="none"
                  mr={6}
                  display="inline-block"
                />
                <Text fontSize="4xl" fontWeight="bold">
                  snappify
                </Text>
              </Flex>
            }
            status="ongoing"
            badges={
              <>
                <Badge colorScheme="blue">TypeScript</Badge>
                <Badge colorScheme="teal" mx={2}>
                  React
                </Badge>
                <Badge ml={2}>nextjs</Badge>
              </>
            }
            summary="snappify helps you to create beautiful code snippets with ease."
          />
          <Divider my={10} />
          <ProjectDescription
            linkColor={linkColor}
            url="https://trueq.io"
            logo={<TrueQLogo />}
            status="ongoing"
            badges={
              <>
                <Badge colorScheme="blue">TypeScript</Badge>
                <Badge colorScheme="teal" mx={2}>
                  React
                </Badge>
                <Badge colorScheme="green">node</Badge>
                <Badge ml={2}>nextjs</Badge>
              </>
            }
            summary="TrueQ is a platform for developers where they can help each other with their daily problems and build up their personal knowledge base."
            content={
              <Paragraph mb={0}>
                Together with{' '}
                <Link color={linkColor} href="https://twitter.com/AnkiBatsukh" isExternal>
                  Anki
                </Link>{' '}
                I&apos;ve developed it completely from scratch. I&apos;ve also done the DevOps part, managing the
                deployment with Ansible and built up a release process via Gitlab CI. Check out the{' '}
                <Link color={linkColor} href="https://trueq.io/our-journey" isExternal>
                  blog post about our journey
                </Link>{' '}
                for more informations. 😊
              </Paragraph>
            }
          />
          <Divider my={10} />
          <ProjectDescription
            linkColor={linkColor}
            url="http://risingfarms-online.com"
            logo={
              <Box maxW={[300, 300, 250]}>
                <Image src="/images/rfo.png" width={353} height={95} alt="Rising Farms Online" />
              </Box>
            }
            status="on hold"
            badges={
              <>
                <Badge colorScheme="blue">TypeScript</Badge>
                <Badge colorScheme="teal" mx={2}>
                  React
                </Badge>
                <Badge colorScheme="orange">Kotlin</Badge>
                <Badge colorScheme="green" ml={2}>
                  Spring
                </Badge>
              </>
            }
            summary="Rising Farms Online is a multiplayer 2D online game. It is a mix of RPG and farmsimulation and completely playable in the browser."
            content={
              <Paragraph mb={0}>
                With Rising Farms Online I started my programming journey back in 2010. It was a dream to develop my own
                game and build up a community for it. I learned so many things with RFO and I am insanely thankful for
                the experience. Sadly I had to put it on hold in 2019 because of a priority shift.
              </Paragraph>
            }
          />
          <Divider my={10} />
        </Box>
      </MotionFlex> */}
      <MotionFlex
        mt={[6, 12]}
        w="100%"
        align="left"
        direction="column"
        opacity="0"
        animate={{
          opacity: 1,
          transition: {
            delay: ANIMATION_DURATION + ANIMATION_DURATION - 0.2,
            duration: ANIMATION_DURATION,
          },
        }}
      >
        <Flex mt={20} w="100%" align="left" direction="column">
          <Header id="work story" underlineColor={TURQUOISE}>
            Work story
          </Header>
          <Paragraph>TODONOW:</Paragraph>
          <Box px={[4, 8, 12]}>
            <Divider my={10} />
            <CVDescription
              linkColor={linkColor}
              url="https://seriouscode.io"
              logo={
                <Flex fontSize="3xl" minW="228px" minH="180px" align="center" justify="center">
                  <strong>seriouscode</strong>
                </Flex>
              }
              name="seriouscode GmbH"
              status="ongoing"
              fromTo="since April 2021"
              summary="After 7 years of being employed as a software developer it was time to make a dream come true. I am soon going to launch a blog post with more detailed informations. Until then you can check out our website."
            />
            <Divider my={10} />
            <CVDescription
              linkColor={linkColor}
              url="https://untis.at"
              logo={<UntisLogo />}
              name="Untis GmbH"
              status="past"
              fromTo="April 2019 - March 2021"
              summary="I was employed at Untis as a senior software developer. My responsibilities were the managment of the web-frontend, I did several coordinative tasks and I also found myself implementing stuff in the backend."
            />
            <Divider my={10} />
            <CVDescription
              linkColor={linkColor}
              url="https://cloudflight.io"
              logo={<CatalystsLogo />}
              name="Catalysts GmbH"
              knownAs="Cloudflight"
              status="past"
              fromTo="August 2015 - March 2019"
              summary="In my time at Catalysts I had the chance to gain so much experience. Of course also in software development, but mostly in project managment, team leading and social skills. I led several projects and did full stack development."
            />
            <Divider my={10} />
            <CVDescription
              linkColor={linkColor}
              url="https://lieberlieber.com"
              logo={<img src={'/images/' + lieberLieberLogo} width={238} height={37} alt="LieberLieber GmbH" />}
              name="LieberLieber GmbH"
              status="past"
              fromTo="March 2014 - August 2015"
              summary="LieberLieber was my first employer and I had the chance to gain first experiences in professional software development. Most of the time I was busy developing Enterprise Architect Extensions with C#."
            />
            <Divider my={10} />
            <CVDescription
              linkColor={linkColor}
              url="https://htlwienwest.at"
              logo={<HtlLogo />}
              name="HTL Ottakring"
              knownAs="HTL Wien West"
              status="past"
              fromTo="until June 2013"
              summary="My education at the HTL Ottakring encouraged my interests and skills in software development. I finished the information technology branch of the HTL Ottakring."
            />
            <Divider my={10} />
          </Box>
        </Flex>
      </MotionFlex>

      <Flex mt={20} w="100%" align="left" direction="column">
        <Header id="contact" underlineColor={GREEN}>
          Contact
        </Header>
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
          <br /> Feel free to{' '}
          <Link color={linkColor} href="mailto:alainperkaz@gmail.com" isExternal>
            send me an email
          </Link>
          .
        </Paragraph>
      </Flex>
    </Flex>
  );
}
