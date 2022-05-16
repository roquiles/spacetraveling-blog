/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { FiUser, FiCalendar } from 'react-icons/fi';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import Link from 'next/link';
import Image from 'next/image';
import { GetStaticProps } from 'next';

import { useState } from 'react';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  slug?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const [posts, setPosts] = useState(postsPagination.results);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);

  const loadPosts = async () => {
    const res = await fetch(nextPage).then(resp => resp.json());

    const newPosts = res.results?.map(post => {
      return {
        slug: post.uid,
        first_publication_date: format(
          new Date(post.first_publication_date),
          'd MMM u',
          {
            locale: ptBR,
          }
        ),
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author,
        },
      };
    });

    setPosts([...posts, ...newPosts]);
    setNextPage(res.next_page);
  };

  return (
    <main className={commonStyles.container}>
      <div className={styles.posts}>
        <header>
          <Image src="/logo.svg" width={250} height={100} />
        </header>

        {posts.map(post => {
          return (
            <Link href={`/post/${post.slug}`}>
              <a key={post.slug}>
                <strong>{post.data.title}</strong>
                <p>{post.data.subtitle}</p>

                <div className={styles.postInfos}>
                  <FiCalendar />
                  <span>{post.first_publication_date}</span>
                  <FiUser />
                  <span>{post.data.author}</span>
                </div>
              </a>
            </Link>
          );
        })}

        {nextPage ? (
          <button type="button" onClick={() => loadPosts()}>
            Carregar mais posts
          </button>
        ) : (
          ''
        )}
      </div>
    </main>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});

  const postsResponse = await prismic.getByType('posts', { pageSize: 3 });

  const results = postsResponse.results?.map(post => {
    return {
      slug: post.uid,
      first_publication_date: format(
        new Date(post.first_publication_date),
        'd MMM u',
        {
          locale: ptBR,
        }
      ),
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  return {
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        results,
      },
    },
  };
};
