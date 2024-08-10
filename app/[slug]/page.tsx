"use client";
import request from 'graphql-request';
import {useState, useEffect} from 'react';
import {
	PageByPublicationDocument,
	PostFullFragment,
	PublicationFragment,
  SlugPostsByPublicationDocument,
	SinglePostByPublicationDocument,
  StaticPageFragment,
} from '@/hashnode/generated/graphql';
import { ClerkLoading } from "@clerk/nextjs";
import { Stack, Loader, Title } from "@mantine/core";
import BlogPost from './blogPost';
import { useRouter } from 'next/navigation';

type PostProps = {
	type: 'post';
	post: PostFullFragment;
	publication: PublicationFragment;
};

type PageProps = {
	type: 'page';
	page: StaticPageFragment;
	publication: PublicationFragment;
};

type Props = PostProps | PageProps;


export default function Page(){
    
    const [data, setData] = useState<Props | null>(null);
    const router = useRouter();
    
    
    async function getPageData(slug: string): Promise<Props | null> {
        const endpoint = process.env.NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT;
        const host = process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST;
      
        if (!endpoint || !host) {
          throw new Error('Missing environment variables');
        }
      
        const postData = await request(endpoint, SinglePostByPublicationDocument, { host, slug });
      
        

        if (postData.publication?.post) {
            setData({
                type: 'post',
                post: postData?.publication?.post as PostFullFragment,
                publication: postData?.publication as PublicationFragment,
            });
            return null;
        }
      
        const pageData = await request(endpoint, PageByPublicationDocument, { host, slug });
      
        if (pageData.publication?.staticPage) {
            setData({
                type: 'post',
                // @ts-ignore
                page: pageData.publication.staticPage as StaticPageFragment,
                publication: pageData.publication as PublicationFragment,
            });
            return null;
        }
        
        router.push('/');
        return null;
    }

    useEffect(() => {
        const slug = window.location.href.split('/').pop();
        getPageData(slug as string);
    }, []);

    if (!data) {
        return (
            <Stack gap={20} justify="center" align="center" w="100vw" h="100vh">
              <ClerkLoading>
                <div className="flex items-center justify-center gap-5 flex-row">
                  <Title ta="center" order={3}>
                    Loading
                  </Title>
                  <Loader size="md" type="bars" />
                </div>
              </ClerkLoading>
            </Stack>
          );
    }

    return(
        <BlogPost {...data} />
    )
}
