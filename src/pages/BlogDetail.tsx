import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calendar, Eye, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { blogPosts } from "@/data/blogs";
import { useBlogViews } from "@/hooks/useBlogViews";

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const blog = blogPosts.find((b) => b.slug === slug);
  const viewCounts = useBlogViews(slug);

  useEffect(() => {
    if (blog) {
      document.title = blog.metaTitle;
      document.querySelector('meta[name="description"]')?.setAttribute("content", blog.metaDescription);
      document.querySelector('meta[name="keywords"]')?.setAttribute("content", blog.metaKeywords);
    }
  }, [blog]);

  if (!blog) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16 md:pt-20">
          <div className="container mx-auto px-4 py-24 text-center">
            <h1 className="text-3xl font-bold mb-4">Blog Not Found</h1>
            <Link to="/blogs">
              <Button>Back to Blogs</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const currentViews = viewCounts[blog.slug] || 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 md:pt-20">
        {/* Hero Image */}
        <div className="relative aspect-[21/9] max-h-[400px] overflow-hidden">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <span className="bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full mb-4 inline-block">
                {blog.category}
              </span>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold max-w-3xl">
                {blog.title}
              </h1>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-10 md:py-16 max-w-3xl">
          <Link to="/blogs">
            <Button variant="ghost" className="mb-6 text-primary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blogs
            </Button>
          </Link>

          <div className="flex items-center gap-4 text-muted-foreground text-sm mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{blog.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>{currentViews.toLocaleString()} views</span>
            </div>
          </div>

          <article className="prose prose-lg max-w-none text-muted-foreground leading-relaxed">
            <p>{blog.content}</p>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogDetail;
