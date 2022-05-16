/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import Header from '../../components/Header';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  uid: string;
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  const router = useRouter();

  function calcReadingTime(postData: Post) {
    const wordsCount = postData.data.content
      .map(content => {
        return content.body.reduce((acc, bodyContent) => {
          return acc.concat(bodyContent.text.split(' '));
        }, []);
      })
      .reduce((acc, wordArray) => {
        return acc + wordArray.length;
      }, 0);

    const readingTime = Math.ceil(wordsCount / 200);

    return readingTime;
  }

  return (
    <>
      {router.isFallback ? (
        <>
          <Header />
          <main className={styles.content}>
            <h1>Carregando...</h1>
          </main>
        </>
      ) : (
        <>
          <Header />
          <div
            className={styles.banner}
            style={{ backgroundImage: `url(${post.data.banner.url})` }}
          />

          <main className={styles.content}>
            <article>
              <h1>{post.data.title}</h1>
              <div className={commonStyles.postInfos}>
                <FiCalendar />
                <span>
                  {format(new Date(post.first_publication_date), 'd MMM u', {
                    locale: ptBR,
                  })}
                </span>
                <FiUser />
                <span>{post.data.author}</span>
                <FiClock />
                <span>{calcReadingTime(post)} min</span>
              </div>
              <div>
                {post.data.content.map(content => (
                  <div key={content.heading}>
                    <h2>{content.heading}</h2>
                    {content.body.map(paragraph => (
                      <p key={paragraph.text}>{paragraph.text}</p>
                    ))}
                  </div>
                ))}
              </div>
            </article>
          </main>
        </>
      )}
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('posts');

  const paths = posts.results?.map(post => {
    return { params: { slug: post.uid } };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug: uid } = params;

  const prismic = getPrismicClient({});
  const response = await prismic.getByUID('posts', String(uid));

  return {
    props: {
      post: response,
    },
  };
};
