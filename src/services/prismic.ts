/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as prismic from '@prismicio/client';
import { HttpRequestLike } from '@prismicio/client';
import { enableAutoPreviews } from '@prismicio/next';
import sm from '../../sm.json';

export const endpoint = sm.apiEndpoint;
export const repositoryName = prismic.getRepositoryName(endpoint);

export interface PrismicConfig {
  req?: HttpRequestLike;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function linkResolver(doc) {
  switch (doc.type) {
    case 'posts':
      return `/${doc.uid}`;
    default:
      return null;
  }
}

export function getPrismicClient(config: PrismicConfig): prismic.Client {
  const client = prismic.createClient(endpoint);

  enableAutoPreviews({
    client,
    req: config.req,
  });

  return client;
}
