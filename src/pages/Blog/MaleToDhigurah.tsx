
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

const MaleToDhigurahGuide = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Male to Dhigurah Speedboat Transfer Guide | Retour Maldives</title>
        <meta 
          name="description" 
          content="Complete guide to traveling from Male to Dhigurah by speedboat. Learn about schedules, journey duration, what to expect, and essential tips for a comfortable transfer." 
        />
        <link rel="canonical" href="https://retourmaldives.com/blog/male-to-dhigurah-guide" />
        
        {/* Article structured data */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": "Complete Guide: Male to Dhigurah Speedboat Transfer",
              "description": "Everything you need to know about traveling from Male to Dhigurah Island - schedules, tips, and what to expect during your 90-minute journey.",
              "image": "https://retourmaldives.com/images/dhigurah-transfer.jpg",
              "author": {
                "@type": "Organization",
                "name": "Retour Maldives"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Retour Maldives",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://retourmaldives.com/favicon/favicon.svg"
                }
              },
              "datePublished": "2025-04-20",
              "dateModified": "2025-04-20"
            }
          `}
        </script>
      </Helmet>

      <Header />
      
      <main className="container mx-auto px-4 pt-32 pb-12">
        <div className="max-w-3xl mx-auto">
          <Link to="/blog" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8">
            <ChevronLeft className="h-4 w-4 mr-1" />
            <span>Back to Guides</span>
          </Link>

          <article className="prose prose-slate max-w-none">
            <h1>Complete Guide: Male to Dhigurah Speedboat Transfer</h1>
            
            <p className="lead">
              Planning your journey to the beautiful island of Dhigurah? This comprehensive guide covers
              everything you need to know about the speedboat transfer from Male to Dhigurah Island.
            </p>

            <h2>Quick Facts</h2>
            <ul>
              <li>Journey Duration: 90 minutes</li>
              <li>Distance: Approximately 95 km</li>
              <li>Daily Departures: Yes</li>
              <li>Transfer Type: Modern speedboat</li>
              <li>Booking Required: Yes, advance booking recommended</li>
            </ul>

            <h2>Schedule and Timing</h2>
            <p>
              Speedboat transfers to Dhigurah operate daily with multiple departure times. The most
              popular departure times are in the morning (around 9:00 AM) and afternoon (around 4:00 PM),
              aligning perfectly with most international flight arrivals.
            </p>

            <h2>The Journey Experience</h2>
            <p>
              The 90-minute journey takes you through the stunning waters of the Maldives. You'll
              travel in a comfortable, modern speedboat equipped with safety features. The route passes
              by several local islands and resorts, offering beautiful views along the way.
            </p>

            <h2>What to Bring</h2>
            <ul>
              <li>Sunscreen and sunglasses</li>
              <li>Light jacket (the air-conditioning can be cool)</li>
              <li>Camera for photos</li>
              <li>Water bottle</li>
              <li>Motion sickness medication if needed</li>
            </ul>

            <h2>Arrival at Dhigurah</h2>
            <p>
              Upon arrival at Dhigurah, you'll be welcomed by the island's pristine beaches and crystal-clear
              waters. The arrival jetty is conveniently located, with most guesthouses within walking
              distance or offering pickup services.
            </p>

            <div className="not-prose mt-8">
              <Button asChild size="lg" className="w-full md:w-auto">
                <Link to="/booking">Book Your Transfer Now</Link>
              </Button>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
};

export default MaleToDhigurahGuide;
