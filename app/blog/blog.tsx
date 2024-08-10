import { addPublicationJsonLd } from '@/hashnode/starter-kit/utils/seo/addPublicationJsonLd';
import { getAutogeneratedPublicationOG } from '@/hashnode/starter-kit/utils/social/og';
import request from 'graphql-request';
import { GetStaticProps } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useState } from 'react';
import { Waypoint } from 'react-waypoint';
import { Button } from '@/hashnode/components/button';
import { Container } from '@/hashnode/components/container';
import { AppProvider } from '@/hashnode/components/contexts/appContext';

import { HeroPost } from '@/hashnode/components/hero-post';
import { ArticleSVG, ChevronDownSVG } from '@/hashnode/components/icons';
import { Layout } from '@/hashnode/components/layout';
import { MorePosts } from '@/hashnode/components/more-posts';
import { Navbar } from '@/hashnode/components/navbar';
import { SecondaryPost } from '@/hashnode/components/secondary-post';
import {
	MorePostsByPublicationDocument,
	MorePostsByPublicationQuery,
	MorePostsByPublicationQueryVariables,
	PageInfo,
	PostFragment,
	PostsByPublicationDocument,
	PostsByPublicationQuery,
	PostsByPublicationQueryVariables,
	PublicationFragment,
} from '@/hashnode/generated/graphql';
import { DEFAULT_COVER } from '@/hashnode/utils/const';

import  Header from '../components/NewHomePage/Header';
import Footer  from '../components/NewHomePage/Footer';

const SubscribeForm = dynamic(() =>
	import('@/hashnode/components/subscribe-form').then((mod) => mod.SubscribeForm),
);

const GQL_ENDPOINT = process.env.NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT;

type Props = {
	publication: PublicationFragment;
	initialAllPosts: PostFragment[];
	initialPageInfo: PageInfo;
};

export default function Index({ publication, initialAllPosts, initialPageInfo }: Props) {
	const [allPosts, setAllPosts] = useState<PostFragment[]>(initialAllPosts);
	const [pageInfo, setPageInfo] = useState<Props['initialPageInfo']>(initialPageInfo);
	const [loadedMore, setLoadedMore] = useState(false);

	const loadMore = async () => {
		const data = await request<MorePostsByPublicationQuery, MorePostsByPublicationQueryVariables>(
			GQL_ENDPOINT,
			MorePostsByPublicationDocument,
			{
				first: 10,
				host: process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST,
				after: pageInfo.endCursor,
			},
		);
		if (!data.publication) {
			return;
		}
		const newPosts = data.publication.posts.edges.map((edge) => edge.node);
		setAllPosts([...allPosts, ...newPosts]);
		setPageInfo(data.publication.posts.pageInfo);
		setLoadedMore(true);
	};

	const firstPost = allPosts[0];
	const secondaryPosts = allPosts.slice(1, 4).map((post) => {
		return (
			<SecondaryPost
				key={post.id}
				title={post.title}
				coverImage={post.coverImage?.url || DEFAULT_COVER}
				date={post.publishedAt}
				slug={post.slug}
				excerpt={post.brief}
			/>
		);
	});
	const morePosts = allPosts.slice(4);

	return (
		<AppProvider publication={publication}>
			<Layout>
				<Head>
					<title>
						{publication.displayTitle || publication.title || 'Elephant.ai | Blog'}
					</title>
					<meta
						name="description"
						content={
							publication.descriptionSEO || publication.title || `${publication.author.name}'s Blog`
						}
					/>
					<meta property="twitter:card" content="summary_large_image" />
					<meta
						property="twitter:title"
						content={publication.displayTitle || publication.title || 'Elephant.ai | Blog'}
					/>
					<meta
						property="twitter:description"
						content={
							publication.descriptionSEO || publication.title || `${publication.author.name}'s Blog`
						}
					/>
					<meta
						property="og:image"
						content={publication.ogMetaData.image || getAutogeneratedPublicationOG(publication)}
					/>
					<meta
						property="twitter:image"
						content={publication.ogMetaData.image || getAutogeneratedPublicationOG(publication)}
					/>
					<link rel="icon" href="/favicon.ico" type="image/x-icon" />
					<script
						type="application/ld+json"
						dangerouslySetInnerHTML={{
							__html: JSON.stringify(addPublicationJsonLd(publication)),
						}}
					/>
				</Head>
				<Header />
				<Container className="flex flex-col items-stretch gap-10 px-5 pb-10 pt-[120px]">

					{allPosts.length === 0 && (
						<div className="grid grid-cols-1 py-20 lg:grid-cols-3 ">
							<div className="col-span-1 flex flex-col items-center gap-5 text-center text-slate-700 dark:text-neutral-400 lg:col-start-2">
								<div className="w-20">
									<ArticleSVG clasName="stroke-current" />
								</div>
								<p className="text-xl font-semibold ">
									Hang tight! We&apos;re drafting the first article.
								</p>
							</div>
						</div>
					)}

					<div className="grid items-start gap-6 xl:grid-cols-2 ">
						<div className="col-span-1">
							{firstPost && (
								<HeroPost
									title={firstPost.title}
									coverImage={firstPost.coverImage?.url || DEFAULT_COVER}
									date={firstPost.publishedAt}
									slug={firstPost.slug}
									excerpt={firstPost.brief}
								/>
							)}
						</div>
						<div className="col-span-1 flex flex-col gap-6">{secondaryPosts}</div>
					</div>

					{allPosts.length > 0 && (
						<div className="bg-primary-50 grid grid-cols-4 rounded-lg px-5 py-5 dark:bg-neutral-900 md:py-10">
							<div className="col-span-full md:col-span-2 md:col-start-2">
								<h2 className="text-primary-600 dark:text-primary-500 mb-5 text-center text-lg font-semibold">
									Subscribe to our newsletter for updates and changelog.
								</h2>
								<SubscribeForm />
							</div>
						</div>
					)}

					{morePosts.length > 0 && (
						<>
							<MorePosts context="home" posts={morePosts} />
							{!loadedMore && pageInfo.hasNextPage && pageInfo.endCursor && (
								<div className="flex w-full flex-row items-center justify-center">
									<Button
										onClick={loadMore}
										type="outline"
										icon={<ChevronDownSVG className="h-5 w-5 stroke-current" />}
										label="Load more posts"
									/>
								</div>
							)}
							{loadedMore && pageInfo.hasNextPage && pageInfo.endCursor && (
								<Waypoint onEnter={loadMore} bottomOffset={'10%'} />
							)}
						</>
					)}
				</Container>
				<Footer />
			</Layout>
		</AppProvider>
	);
}

// export const getStaticProps: GetStaticProps<Props> = async () => {
// 	const data = await request<PostsByPublicationQuery, PostsByPublicationQueryVariables>(
// 		GQL_ENDPOINT,
// 		PostsByPublicationDocument,
// 		{
// 			first: 10,
// 			host: process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST,
// 		},
// 	);

// 	const publication = data.publication;
// 	if (!publication) {
// 		return {
// 			notFound: true,
// 		};
// 	}
// 	const initialAllPosts = publication.posts.edges.map((edge) => edge.node);

// 	return {
// 		props: {
// 			publication,
// 			initialAllPosts,
// 			initialPageInfo: publication.posts.pageInfo,
// 		},
// 		revalidate: 1,
// 	};
// };
