import { useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calendar, ArrowRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { blogPosts } from "@/data/blogs";
import blogGlasgowParking from "@/assets/blog-glasgow-parking.webp";
import useSEO from "@/hooks/useSEO";

const localImages: Record<string, string> = {
  "blog-glasgow-parking": blogGlasgowParking,
};

const getImage = (blog: (typeof blogPosts)[0]) => {
  if (blog.localImage && localImages[blog.localImage]) return localImages[blog.localImage];
  return blog.image;
};

const Blogs = () => {
  useSEO({
    title: "Glasgow Airport Parking Blog | Tips, Guides & Travel Advice",
    description:
      "Read helpful Glasgow Airport parking guides, travel tips and planning advice designed to make your airport experience easier and stress-free.",
  });
  useEffect(() => {
    document
      .querySelector('meta[name="keywords"]')
      ?.setAttribute(
        "content",
        "airport parking blog, travel tips, cheap airport parking, meet and greet tips, packing tips, holiday travel savings",
      );
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-16 md:pt-20">
        {/* Hero Section */}
        <section className="bg-primary py-8 md:py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
              Glasgow Airport Parking Blog & Travel Guides
            </h1>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto">
              Your Ultimate Guide to Glasgow Airport Parking & Travel Tips.
            </p>
          </div>
        </section>

        {/* Blogs Grid */}
        <section className="py-16 md:py-24 bg-cream">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((blog, index) => (
                <article
                  key={blog.slug}
                  className="group bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Image */}
                  <Link to={`/blogs/${blog.slug}`}>
                    <div className="relative aspect-[3/2] overflow-hidden">
                      <img
                        src={getImage(blog)}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full">
                          {blog.category}
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-muted-foreground text-sm mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{blog.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{blog.views.toLocaleString()} views</span>
                      </div>
                    </div>
                    <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {blog.title}
                    </h2>
                    <p className="text-muted-foreground mb-4 line-clamp-2">{blog.excerpt}</p>
                    <Link to={`/blogs/${blog.slug}`}>
                      <Button
                        variant="ghost"
                        className="p-0 h-auto text-primary font-semibold hover:text-accent hover:bg-transparent group/btn"
                      >
                        Read More
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                      </Button>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Blogs;
