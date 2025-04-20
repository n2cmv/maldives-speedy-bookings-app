
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

const BlogPage = () => {
  const blogPosts = [
    {
      slug: "male-to-dhigurah-guide",
      title: "Complete Guide: Male to Dhigurah Speedboat Transfer",
      description: "Everything you need to know about traveling from Male to Dhigurah Island - schedules, tips, and what to expect during your 90-minute journey.",
      category: "Travel Guide",
      readTime: "5 min read"
    },
    {
      slug: "male-to-dhangethi-guide",
      title: "Male to Dhangethi: Your Essential Travel Guide",
      description: "Plan your journey from Male to Dhangethi with our comprehensive guide covering speedboat schedules, travel tips, and island information.",
      category: "Travel Guide",
      readTime: "5 min read"
    },
    {
      slug: "best-time-visit-dhigurah",
      title: "Best Time to Visit Dhigurah Island",
      description: "Discover the perfect time to visit Dhigurah Island, including whale shark seasons, weather patterns, and local festivities.",
      category: "Destination Guide",
      readTime: "4 min read"
    },
    {
      slug: "exploring-dhangethi",
      title: "Exploring Dhangethi: Local Island Experience",
      description: "Your complete guide to experiencing local life, activities, and attractions in Dhangethi Island.",
      category: "Destination Guide",
      readTime: "4 min read"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Travel Guides & Tips | Retour Maldives Blog</title>
        <meta 
          name="description" 
          content="Discover comprehensive guides about traveling to Maldives local islands. Tips for speedboat transfers, island guides, and local experiences." 
        />
        <link rel="canonical" href="https://retourmaldives.com/blog" />
      </Helmet>

      <Header />
      
      <main className="container mx-auto px-4 pt-32 pb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Travel Guides</h1>
          <p className="text-gray-600 mb-8">Discover everything you need to know about traveling to Maldives local islands</p>
          
          <div className="grid gap-6 md:grid-cols-2">
            {blogPosts.map((post) => (
              <Link key={post.slug} to={`/blog/${post.slug}`}>
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <MapPin className="h-4 w-4" />
                      <span>{post.category}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <CardTitle>{post.title}</CardTitle>
                    <CardDescription>{post.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BlogPage;
