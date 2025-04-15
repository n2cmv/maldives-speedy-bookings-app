
import IslandPageTemplate from "@/components/islands/IslandPageTemplate";
import { IslandDetails } from "@/types/island";

const DhigurahIsland = () => {
  const islandData: IslandDetails = {
    name: "Dhigurah Island",
    tagline: "A paradise for whale shark enthusiasts and beach lovers",
    slug: "dhigurah",
    fullDescription: "Dhigurah is a beautiful island located in the South Ari Atoll, famous for its pristine beaches and stunning coral reefs. The island stretches about 3 km in length but is only about 300 meters wide. A paradise for nature lovers, it's known for whale shark sightings year-round and its vibrant marine ecosystem. The island name 'Dhigurah' translates to 'long island' in Dhivehi, perfectly describing its unique elongated shape. With its white sandy beaches, crystal clear waters, and lush vegetation, Dhigurah offers an authentic Maldivian experience away from the crowds.",
    heroImage: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2068&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2068&q=80",
      "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1513316564811-ee3c49558c8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ],
    location: {
      atoll: "South Ari Atoll (Alif Dhaal)",
      coordinates: "3.4833° N, 72.9333° E"
    },
    travelInfo: {
      fromMale: "1.5 hours by speedboat or 20 minutes by domestic flight to nearby Maamigili Airport followed by a 10-minute boat ride",
      bestWayToReach: "Speedboat transfer with Retour Maldives - direct, comfortable and scenic journey"
    },
    activities: [
      {
        name: "Whale Shark Excursions",
        description: "Dhigurah is famous for year-round whale shark sightings. Join guided excursions to swim alongside these gentle giants in their natural habitat.",
        image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80"
      },
      {
        name: "Snorkeling at House Reef",
        description: "Explore the vibrant house reef just off the beach, home to colorful coral formations and diverse marine life including reef sharks, rays, and tropical fish.",
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
      },
      {
        name: "Manta Ray Point Visits",
        description: "Take a short boat ride to nearby manta cleaning stations where you can observe these majestic creatures up close.",
        image: "https://images.unsplash.com/photo-1513316564811-ee3c49558c8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
      },
      {
        name: "Beach Walks",
        description: "Enjoy long walks along the pristine 3km beach that surrounds the island, perfect for sunrise or sunset strolls.",
        image: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2068&q=80"
      }
    ],
    accommodation: [
      {
        type: "Guesthouses",
        description: "Several comfortable guesthouses offering rooms with modern amenities, air conditioning, and often direct beach access.",
        priceRange: "$50-150 per night"
      },
      {
        type: "Boutique Hotels",
        description: "Small boutique hotels with personalized service, swimming pools, and restaurant facilities.",
        priceRange: "$100-250 per night"
      },
      {
        type: "Beach Villas",
        description: "Private beach villas with stunning ocean views and premium services.",
        priceRange: "$150-300 per night"
      }
    ],
    dining: [
      {
        type: "Local Cuisine",
        description: "Try authentic Maldivian dishes featuring fresh seafood, coconut, and spices at local cafes and guesthouse restaurants."
      },
      {
        type: "International Options",
        description: "Most accommodations offer international cuisine alongside local dishes, catering to diverse preferences."
      },
      {
        type: "Beachfront Dining",
        description: "Enjoy special beachfront dining experiences arranged by many guesthouses for a memorable meal."
      }
    ],
    weather: {
      bestTime: "November to April (dry season) for clearest waters and optimal whale shark sightings",
      temperature: "25°C - 32°C year-round",
      rainfall: "Low during dry season (Jan-Mar), higher during May-November"
    },
    essentialInfo: [
      {
        title: "Local Culture",
        description: "Respect local customs and dress modestly when away from tourist beaches. The island is inhabited by locals with a traditional lifestyle.",
        icon: "users"
      },
      {
        title: "Internet",
        description: "Most accommodations offer WiFi, and mobile data is available but may be limited in some areas.",
        icon: "wifi"
      },
      {
        title: "Currency",
        description: "US Dollars are widely accepted alongside the local currency (Rufiyaa). Credit cards are accepted at most establishments.",
        icon: "credit-card"
      },
      {
        title: "Health",
        description: "Basic medical facilities are available on the island, with major medical services requiring transfer to Male.",
        icon: "heart-pulse"
      }
    ],
    quickFacts: [
      {
        label: "Price Range",
        value: "$50-$300",
        icon: "dollar-sign"
      },
      {
        label: "Transfer",
        value: "Speedboat",
        icon: "ship"
      },
      {
        label: "Rooms",
        value: "176",
        icon: "home"
      },
      {
        label: "Transfer Time",
        value: "1.5 hours",
        icon: "clock"
      },
      {
        label: "Restaurants",
        value: "7",
        icon: "utensils"
      }
    ],
    faqs: [
      {
        question: "How do I get to Dhigurah Island?",
        answer: "You can reach Dhigurah Island via speedboat from Male (approximately 1.5 hours) or by taking a domestic flight to Maamigili Airport followed by a short boat ride."
      },
      {
        question: "When is the best time to visit Dhigurah?",
        answer: "The best time to visit is during the dry season (November to April) when the weather is sunny and the sea is calm. This period is also optimal for whale shark sightings."
      },
      {
        question: "Are there ATMs on Dhigurah Island?",
        answer: "There are limited ATM facilities on the island. It's recommended to bring sufficient cash (US dollars are widely accepted) or check if your accommodation accepts credit cards."
      },
      {
        question: "What activities can I do on Dhigurah?",
        answer: "Popular activities include whale shark excursions, snorkeling, diving, fishing trips, island hopping, and enjoying the beautiful beaches."
      },
      {
        question: "Is Dhigurah suitable for families with children?",
        answer: "Yes, Dhigurah is family-friendly with calm beaches and many guesthouses that accommodate families. However, facilities for very young children may be limited."
      }
    ]
  };

  return <IslandPageTemplate islandData={islandData} />;
};

export default DhigurahIsland;
