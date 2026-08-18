import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPost, posts, sortedPosts } from "@/data/posts";
import { PostView } from "@/components/journal/PostView";
import { FooterCTA } from "@/components/layout/FooterCTA";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Not found" };

  return {
    title: post.title,
    description: post.standfirst,
    openGraph: {
      title: post.title,
      description: post.standfirst,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const i = sortedPosts.findIndex((p) => p.slug === slug);
  const next = sortedPosts[(i + 1) % sortedPosts.length];

  return (
    <>
      <PostView post={post} next={next} />
      <FooterCTA />
    </>
  );
}
