
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

const MaleToDhangethiGuide = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Male to Dhangethi Travel Guide | Retour Maldives</title>
        <meta 
          name="description" 
          content="Complete guide to traveling from Male to Dhangethi by speedboat. Information about schedules, journey time, what to expect, and tips for a comfortable transfer." 
        />
        <link rel="canonical" href="https://retourmaldives.com/blog/male-to-dhangethi-guide" />
        
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": "Male to Dhangethi: Your Essential Travel Guide",
              "description": "Plan your journey from Male to Dhangethi with our comprehensive guide covering speedboat schedules, travel tips, and island information.",
              "image": "https://retourmaldives.com/images/dhangethi-transfer.jpg",
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
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Link to="/blog" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8">
            <ChevronLeft className="h-4 w-4 mr-1" />
            <span>Back to Guides</span>
          </Link>

          <article className="prose prose-slate max-w-none">
            <h1>Male to Dhangethi: Your Essential Travel Guide</h1>
            
            <p className="lead">
              Planning your trip to Dhangethi? Here's everything you need to know about getting from
              Male to this charming local island by speedboat.
            </p>

            <h2>Journey Overview</h2>
            <ul>
              <li>Duration: Approximately 120 minutes</li>
              <li>Distance: About 110 km</li>
              <li>Regular Departures: Yes</li>
              <li>Transfer Type: Modern speedboat</li>
              <li>Advance Booking: Recommended</li>
            </ul>

            <h2>Transfer Schedule</h2>
            <p>
              Regular speedboat transfers operate between Male and Dhangethi, with scheduled departures
              designed to accommodate international flight arrivals. Morning transfers typically depart
              around 10:00 AM, while afternoon departures are usually scheduled for 3:30 PM.
            </p>

            <h2>The Transfer Experience</h2>
            <p>
              The journey to Dhangethi offers a scenic introduction to the Maldives. You'll travel in
              a comfortable speedboat, passing by numerous islands and watching the colors of the ocean
              change as you cross different depths.
            </p>

            <h2>Essential Travel Tips</h2>
            <ul>
              <li>Arrive at the departure point 30 minutes early</li>
              <li>Bring sun protection</li>
              <li>Keep valuable items in waterproof bags</li>
              <li>Consider weather conditions</li>
              <li>Have motion sickness remedies if needed</li>
            </ul>

            <h2>Arriving in Dhangethi</h2>
            <p>
              Upon reaching Dhangethi, you'll arrive at the main jetty. The island's compact size
              means most accommodations are within easy walking distance, though many guesthouses
              offer complimentary pickup services.
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

export default MaleToDhangethiGuide;
