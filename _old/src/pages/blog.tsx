import { Text, Flex, Box, Divider, useColorModeValue } from '@chakra-ui/react';
import { GetStaticProps } from 'next';
import { format, parseISO } from 'date-fns';
import { Fragment } from 'react';
import BlogCard from '../components/blog-card';
import { getAllFilesFrontMatter } from '../utils/mdx';

const BlogOverview = ({ groups }: { groups: GroupedBlogPosts[] }) => {
  return (
    <Flex direction="column" w="100%">
      <Box>
        {groups.map((g) => (
          <Box key={g.month} m="auto" w={['100%', '100%', '85%']} mb={14}>
            <Text
              fontSize="3xl"
              fontWeight="bold"
              display="inline-block"
              mb={4}
              ml={[0, 2, 4]}
              borderBottom="4px solid"
            >
              {g.month}
            </Text>
            {g.blogPosts.map((p, index) => (
              <Fragment key={p.slug}>
                {index > 0 && <Divider mx={[0, 2, 4]} my={7} borderColor={useColorModeValue('gray.300', 'gray.600')} />}
                <BlogCard {...p} />
              </Fragment>
            ))}
          </Box>
        ))}
      </Box>
    </Flex>
  );
};
export default BlogOverview;

interface GroupedBlogPosts {
  month: string;
  monthNumber: number;
  blogPosts: any[];
}

export const getStaticProps: GetStaticProps = async () => {
  const blogPosts = await getAllFilesFrontMatter('blog');
  blogPosts.sort((a, b) => parseISO(b.publishedAt).getTime() - parseISO(a.publishedAt).getTime());

  const groupedBlogPosts = blogPosts.reduce((groups, blogPost) => {
    const month = format(parseISO(blogPost.publishedAt), 'MMMM yyyy');

    const group = groups.find((g) => g.month === month);
    if (group) {
      group.blogPosts.push(blogPost);
      return groups;
    } else {
      return [...groups, { month, monthNumber: parseISO(blogPost.publishedAt).getMonth(), blogPosts: [blogPost] }];
    }
  }, [] as GroupedBlogPosts[]);

  return { props: { groups: groupedBlogPosts } };
};
