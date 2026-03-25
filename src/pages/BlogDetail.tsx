import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCanonical } from "@/hooks/useCanonical";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calendar, Eye, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { blogPosts } from "@/data/blogs";
import blogGlasgowParking from "@/assets/blog-glasgow-parking.webp";

const localImages: Record<string, string> = {
  "blog-glasgow-parking": blogGlasgowParking,
};

const getImage = (blog: (typeof blogPosts)[0]) => {
  if (blog.localImage && localImages[blog.localImage]) return localImages[blog.localImage];
  return blog.image;
};

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const blog = blogPosts.find((b) => b.slug === slug);

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

  const heroImage = getImage(blog);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 md:pt-20">
        {/* Hero Section */}
        <div className="relative w-full min-h-[300px] md:min-h-[420px] lg:min-h-[480px] overflow-hidden">
          <img
            src={heroImage}
            alt={blog.title}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
          <div className="absolute inset-0 flex items-end">
            <div className="container mx-auto px-4 pb-10 md:pb-14 max-w-3xl">
              <span className="bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full mb-4 inline-block">
                {blog.category}
              </span>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight drop-shadow-lg">
                {blog.title}
              </h1>
              <div className="flex items-center gap-4 text-white/80 text-sm mt-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{blog.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{blog.views.toLocaleString()} views</span>
                </div>
              </div>
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

          <article
            className="blog-content prose prose-lg max-w-none leading-relaxed"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogDetail;
