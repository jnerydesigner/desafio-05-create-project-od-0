/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable react/no-danger */
import { GetStaticProps } from 'next';
import { CircleLoader } from 'react-spinners';
import { RichText } from 'prismic-dom';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';
// import { GetStaticPaths, GetStaticProps } from 'next';
import { FiCalendar } from 'react-icons/fi';
import { AiOutlineClockCircle, AiOutlineUser } from 'react-icons/ai';
import Prismic from '@prismicio/client';

// import { parseISO } from 'date-fns/esm';
import { ReactElement } from 'react';
import { useRouter } from 'next/router';
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: string;
  };
}
interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): ReactElement {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <>
        <div>
          <CircleLoader />
        </div>
      </>
    );
  }
  return (
    <>
      <img
        src={post.data.banner.url}
        alt="banner"
        className={styles.imgBanner}
      />
      <article className={styles.containerGeral}>
        <div className={styles.container}>
          <h1>{post.data.title}</h1>
          <div>
            <div>
              <FiCalendar />
              <span>{post.first_publication_date}</span>
            </div>
            <div>
              <AiOutlineUser />
              <span>{post.data.author}</span>
            </div>
            <div>
              <AiOutlineClockCircle />
              <span>{post.first_publication_date} minutos</span>
            </div>
          </div>

          <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: post.data.content }}
          />
        </div>
      </article>
    </>
  );
}

export const getStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query([
    Prismic.Predicates.at('document.type', 'post'),
  ]);

  const paths = posts.results.map(post => {
    return {
      params: {
        slug: post.uid,
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({
  params,
  previewData,
  preview = false,
}) => {
  const prismic = getPrismicClient();
  const { slug } = params;
  const response = await prismic.getByUID('post', String(slug), {
    ref: previewData?.ref || null,
  });

  const prevPost = await prismic.query(
    [Prismic.Predicates.at('document.type', 'posts')],
    {
      pageSize: 1,
      after: response.id,
      orderings: '[document.first_publication_date]',
    }
  );
  const nextPost = await prismic.query(
    [Prismic.Predicates.at('document.type', 'posts')],
    {
      pageSize: 1,
      after: response.id,
      orderings: '[document.last_publication_date desc]',
    }
  );

  const post = {
    uid: response.uid,
    first_publication_date: format(
      parseISO(response.first_publication_date),
      'dd MMM yyyy'
    ),
    last_publication_date: format(
      parseISO(response.last_publication_date),
      'dd MMM yyyy'
    ),
    data: {
      title: RichText.asText(response.data.title),
      subtitle: RichText.asText(response.data.subtitle),
      author: RichText.asText(response.data.author),
      banner: {
        url: response.data.banner.url,
      },
      content: RichText.asHtml(response.data.content),
    },
  };

  return {
    props: {
      post,
      navigation: {
        prevPost: prevPost?.results,
        nextPost: nextPost?.results,
      },
      preview,
    },
  };
};
