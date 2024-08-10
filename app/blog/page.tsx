"use client";
import Blog from "./blog";
import {
  PostsByPublicationDocument,
  PostsByPublicationQuery,
  PostsByPublicationQueryVariables,
} from "@/hashnode/generated/graphql";
import request from "graphql-request";
import { useState, useEffect } from "react";
import { ClerkLoading } from "@clerk/nextjs";
import { Stack, Loader, Title } from "@mantine/core";


const GQL_ENDPOINT = process.env.NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT;

export default function Page() {
  const [publication, setPublication] = useState(null);
  const [initialAllPosts, setInitialAllPosts] = useState([]);
  const [initialPageInfo, setInitialPageInfo] = useState(null);

  async function getBlogData() {
    const data = await request<
      PostsByPublicationQuery,
      PostsByPublicationQueryVariables
    >(GQL_ENDPOINT, PostsByPublicationDocument, {
      first: 10,
      host: process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST,
    });

    const publication = data.publication;
    setPublication(publication as any);
    if (!publication) {
      return {
        notFound: true,
      };
    }
    const initialAllPosts = publication.posts.edges.map((edge) => edge.node);
    setInitialAllPosts(initialAllPosts as any);

    setInitialPageInfo(publication.posts.pageInfo as any);
    // return {
    //     props: {
    //         publication,
    //         initialAllPosts,
    //         initialPageInfo: publication.posts.pageInfo,
    //     },
    //     revalidate: 1,
    // };
  }

  useEffect(() => {
    getBlogData();
  }, []);

  if (!publication) {
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

  return (
    <Blog
      publication={publication as any}
      initialAllPosts={initialAllPosts}
      initialPageInfo={initialPageInfo as any}
    />
  );
}

