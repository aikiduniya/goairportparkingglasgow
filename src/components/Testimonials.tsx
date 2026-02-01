import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import googleIcon from "@/assets/partners/google-icon.png";
import trustpilotStars from "@/assets/partners/trustpilot-stars.svg";
import facebookIcon from "@/assets/partners/facebook-icon.png";

const Testimonials = () => {
  const googleReviews = [
    {
      name: "Emma W",
      role: "Frequent Flyer",
      date: "15 Jan 2026",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&crop=face&fm=webp&q=80",
      quote: "Stress free and professional service. Car was waiting exactly as promised.",
    },
    {
      name: "James R",
      role: "Business Traveller",
      date: "10 Jan 2026",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face&fm=webp&q=80",
      quote: "Affordable and quick shuttle service. Excellent staff, highly recommend.",
    },
    {
      name: "George S",
      role: "Business Owner",
      date: "5 Jan 2026",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop&crop=face&fm=webp&q=80",
      quote: "The VIP Meet & Greet saved me valuable time. Worth every penny!",
    },
  ];

  const trustpilotReviews = [
    {
      name: "Sarah M",
      role: "Holiday Traveller",
      date: "18 Jan 2026",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=48&h=48&fit=crop&crop=face&fm=webp&q=80",
      quote: "Brilliant service from start to finish. Will definitely use again!",
    },
    {
      name: "Michael D",
      role: "Regular Customer",
      date: "12 Jan 2026",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=48&h=48&fit=crop&crop=face&fm=webp&q=80",
      quote: "Best parking rates at Dublin Airport. Shuttle was quick and driver very friendly.",
    },
    {
      name: "Lisa K",
      role: "First Time User",
      date: "8 Jan 2026",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=48&h=48&fit=crop&crop=face&fm=webp&q=80",
      quote: "So easy to book and even easier to drop off. Great value for money.",
    },
  ];

  const facebookReviews = [
    {
      name: "Patrick O",
      role: "Family Vacation",
      date: "20 Jan 2026",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=48&h=48&fit=crop&crop=face&fm=webp&q=80",
      quote: "Parked here for our family trip. Secure, affordable and hassle-free!",
    },
    {
      name: "Claire B",
      role: "Weekend Getaway",
      date: "14 Jan 2026",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=48&h=48&fit=crop&crop=face&fm=webp&q=80",
      quote: "Amazing service! The staff went above and beyond. Highly recommended.",
    },
    {
      name: "David T",
      role: "Business Trip",
      date: "3 Jan 2026",
      image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=48&h=48&fit=crop&crop=face&fm=webp&q=80",
      quote: "Used them multiple times now. Consistent quality and great prices.",
    },
  ];

  const renderReviews = (reviews: typeof googleReviews) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto mb-8">
      {reviews.map((testimonial, index) => (
        <div
          key={index}
          className="testimonial-card animate-fade-in"
          style={{ animationDelay: `${index * 150}ms` }}
        >
          {/* Stars */}
          <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-5 h-5 fill-accent text-accent"
              />
            ))}
          </div>

          {/* Quote */}
          <p className="text-foreground mb-4 leading-relaxed">
            "{testimonial.quote}"
          </p>

          {/* Date */}
          <p className="text-xs text-muted-foreground mb-4">{testimonial.date}</p>

          {/* Author */}
          <div className="flex items-center gap-4">
            <img
              src={testimonial.image}
              alt={testimonial.name}
              loading="lazy"
              width={48}
              height={48}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-foreground">
                {testimonial.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {testimonial.role}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-card">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            What Our Customers Say
          </h2>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="google" className="w-full">
          <TabsList className="flex justify-center gap-3 sm:gap-6 md:gap-10 mb-8 bg-transparent h-auto p-0 flex-wrap">
            <TabsTrigger 
              value="google" 
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 rounded-full bg-background border-2 border-border data-[state=active]:border-[#FFD700] data-[state=active]:border-4 shadow-sm hover:shadow-md transition-all p-2 sm:p-3"
            >
              <img src={googleIcon} alt="Google Reviews" width={70} height={70} className="w-full h-full object-contain" />
            </TabsTrigger>
            <TabsTrigger 
              value="trustpilot" 
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 rounded-full bg-background border-2 border-border data-[state=active]:border-[#FFD700] data-[state=active]:border-4 shadow-sm hover:shadow-md transition-all p-2 sm:p-3"
            >
              <img src={trustpilotStars} alt="Trustpilot" width={70} height={70} className="w-full h-full object-contain" />
            </TabsTrigger>
            <TabsTrigger 
              value="facebook" 
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 rounded-full bg-background border-2 border-border data-[state=active]:border-[#FFD700] data-[state=active]:border-4 shadow-sm hover:shadow-md transition-all p-2 sm:p-3"
            >
              <img src={facebookIcon} alt="Facebook" width={70} height={70} className="w-full h-full object-contain" />
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="google">
            {renderReviews(googleReviews)}
          </TabsContent>
          
          <TabsContent value="trustpilot">
            {renderReviews(trustpilotReviews)}
          </TabsContent>
          
          <TabsContent value="facebook">
            {renderReviews(facebookReviews)}
          </TabsContent>
        </Tabs>

        {/* View More */}
        <div className="text-center">
          <Link to="/testimonials">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              View More
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
