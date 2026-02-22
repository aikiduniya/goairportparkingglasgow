import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calendar, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Blogs = () => {
  const [selectedBlog, setSelectedBlog] = useState<number | null>(null);

  const blogs = [
    {
      category: "Airport Parking",
      title: "Top Tips for Stress-Free Airport Parking",
      excerpt: "Discover how to save time and money when booking your airport parking...",
      content: "Planning your airport parking in advance can save you both time and money. Here are our top tips: Book early to secure the best rates, compare different parking options (Meet & Greet vs Park & Ride), check for discount codes and loyalty rewards, read reviews from other travelers, and always allow extra time on your departure day. With proper planning, you can start your journey stress-free knowing your car is in safe hands.",
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&h=400&fit=crop",
      date: "Jan 15, 2025",
    },
    {
      category: "Car Parking",
      title: "Why Meet & Greet Parking is Worth It",
      excerpt: "Thinking about upgrading to Meet & Greet? Here's why it could be the best choice...",
      content: "Meet & Greet parking offers the ultimate convenience for travelers. Simply drive to the terminal, hand over your keys to a professional driver, and walk straight to check-in. No waiting for shuttle buses, no lugging heavy bags across car parks. When you return, your car is brought back to you at the terminal. It's perfect for families with young children, business travelers, or anyone who values their time. The small extra cost is often worth every penny.",
      image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=600&h=400&fit=crop",
      date: "Jan 10, 2025",
    },
    {
      category: "Holiday Travel",
      title: "5 Ways to Save on Holiday Travel Costs",
      excerpt: "Learn how to keep your travel budget under control without cutting the fun...",
      content: "Traveling doesn't have to break the bank. Here are five proven ways to save: 1) Book flights and parking well in advance for early bird discounts. 2) Be flexible with your travel dates - midweek flights are often cheaper. 3) Pack light to avoid baggage fees. 4) Use comparison sites to find the best deals. 5) Sign up for newsletters to receive exclusive discount codes. With these tips, you can enjoy more holidays without overspending.",
      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop",
      date: "Jan 5, 2025",
    },
    {
      category: "Packing Smart",
      title: "Packing Smart for Stress-Free Flights",
      excerpt: "Discover essential packing tips to avoid extra baggage fees and stress...",
      content: "Smart packing starts before you even open your suitcase. Make a list of essentials, roll your clothes to save space, and use packing cubes to stay organized. Check your airline's baggage allowance and weigh your bag before leaving home. Keep important documents and valuables in your carry-on. Wear your heaviest items on the plane to save luggage weight. These simple strategies will help you pack efficiently and avoid stressful surprises at check-in.",
      image: "https://images.unsplash.com/photo-1553531384-cc64ac80f931?w=600&h=400&fit=crop",
      date: "Dec 28, 2024",
    },
    {
      category: "Choosing Parking",
      title: "How to Choose the Right Parking Option",
      excerpt: "We break down the pros and cons of different airport parking services...",
      content: "Choosing the right parking option depends on your priorities. Park & Ride is budget-friendly and includes free shuttle transfers - great for cost-conscious travelers. Meet & Greet offers maximum convenience by letting you drop your car at the terminal - ideal for families or those with heavy luggage. Valet Parking adds luxury extras like car washing and premium service. Consider your budget, time constraints, and personal preferences when making your choice.",
      image: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=600&h=400&fit=crop",
      date: "Dec 20, 2024",
    },
    {
      category: "Travel Hacks",
      title: "Travel Hacks Every UK Flyer Should Know",
      excerpt: "From security shortcuts to budget-friendly meals at the airport...",
      content: "Seasoned travelers know the tricks to make flying easier. Arrive early but not too early - 2-3 hours for international flights is ideal. Wear slip-on shoes for faster security screening. Download your airline's app for mobile boarding passes and real-time updates. Bring an empty water bottle to fill after security. Use airport lounges for a comfortable wait - many credit cards offer free access. These simple hacks can transform your airport experience.",
      image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=400&fit=crop",
      date: "Dec 15, 2024",
    },
  ];

  useEffect(() => {
    document.title = "Blog - Airport Parking Tips, Travel Advice & News";
    document.querySelector('meta[name="description"]')?.setAttribute("content", "Read our latest blog posts on airport parking tips, travel hacks, packing advice, and how to save on holiday travel costs.");
    document.querySelector('meta[name="keywords"]')?.setAttribute("content", "airport parking blog, travel tips, cheap airport parking, meet and greet tips, packing tips, holiday travel savings");
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16 md:pt-20">
        {/* Hero Section */}
        <section className="bg-primary py-8 md:py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
              Latest Blogs
            </h1>
          </div>
        </section>

      {/* Blogs Grid */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, index) => (
              <article
                key={index}
                className="group bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Image */}
                <div className="relative aspect-[3/2] overflow-hidden">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full">
                      {blog.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                    <Calendar className="w-4 h-4" />
                    <span>{blog.date}</span>
                  </div>
                  <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {blog.title}
                  </h2>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {blog.excerpt}
                  </p>
                  <Button
                    variant="ghost"
                    className="p-0 h-auto text-primary font-semibold hover:text-accent hover:bg-transparent group/btn"
                    onClick={() => setSelectedBlog(index)}
                  >
                    Read More
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Detail Modal */}
      <Dialog open={selectedBlog !== null} onOpenChange={() => setSelectedBlog(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
          {selectedBlog !== null && (
            <>
              <div className="relative aspect-video">
                <img
                  src={blogs[selectedBlog].image}
                  alt={blogs[selectedBlog].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    {blogs[selectedBlog].category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <DialogHeader>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                    <Calendar className="w-4 h-4" />
                    <span>{blogs[selectedBlog].date}</span>
                  </div>
                  <DialogTitle className="text-2xl font-bold text-foreground">
                    {blogs[selectedBlog].title}
                  </DialogTitle>
                </DialogHeader>
                <p className="text-muted-foreground mt-4 leading-relaxed">
                  {blogs[selectedBlog].content}
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      </main>

      <Footer />
    </div>
  );
};

export default Blogs;
