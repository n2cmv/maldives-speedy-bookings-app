
import React from 'react';
import IslandPageTemplate from '@/components/islands/IslandPageTemplate';
import { IslandDetails } from '@/types/island';
import { Helmet } from 'react-helmet-async';

const islandData: IslandDetails = {
  name: "A.Dh Dhigurah",
  description: "A beautiful 3-kilometer stretch of white sandy beach surrounded by crystal clear waters. Book your speedboat transfer to Dhigurah today.",
  tagline: "Where Nature Meets Paradise",
  slug: "dhigurah",
  fullDescription: "Dhigurah, meaning 'long island' in Dhivehi, is a stunning 3-kilometer stretch of white sandy beach surrounded by crystal clear waters. Known for its incredible marine life, particularly whale sharks, this island offers a perfect blend of local Maldivian culture and natural beauty. Our speedboat transfer service provides reliable, comfortable transportation to Dhigurah from Male with daily departures.",
  heroImage: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
  galleryImages: [
    "https://images.unsplash.com/photo-1540202404-1b927e27fa8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D&auto=format&fit=crop&w=2026&q=80",
    "https://images.unsplash.com/photo-1586500036706-41963de24d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2127&q=80",
    "https://images.unsplash.com/photo-1589979481223-deb893043163?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2060&q=80"
  ],
  location: {
    atoll: "Alif Dhaal Atoll",
    coordinates: "3.4833° N, 72.9333° E"
  },
  travelInfo: {
    fromMale: "90-minute speedboat ride",
    bestWayToReach: "Direct speedboat transfer from Male' International Airport with Retour Maldives"
  },
  activities: [
    {
      name: "Whale Shark Watching",
      description: "Experience the majestic whale sharks in their natural habitat. Dhigurah is famous for year-round whale shark sightings.",
      image: "/lovable-uploads/d4c89786-07eb-4efc-9bdc-c3520c8c1231.png"
    },
    {
      name: "Snorkeling",
      description: "Explore vibrant coral reefs and encounter diverse marine life including manta rays, sea turtles, and tropical fish.",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    {
      name: "Beach Activities",
      description: "Enjoy the 3km long beach perfect for walking, jogging, or simply relaxing under the sun.",
      image: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
    }
  ],
  accommodation: [
    {
      type: "Beachfront Guesthouses",
      description: "Comfortable rooms with modern amenities and direct beach access.",
      priceRange: "$80-150/night"
    },
    {
      type: "Boutique Hotels",
      description: "Upscale accommodations with premium services and facilities.",
      priceRange: "$150-300/night"
    }
  ],
  dining: [
    {
      type: "Local Cafes",
      description: "Experience authentic Maldivian cuisine and fresh seafood dishes."
    },
    {
      type: "Hotel Restaurants",
      description: "International cuisine featuring both Western and Asian dishes."
    }
  ],
  weather: {
    bestTime: "November to April (Dry Season)",
    temperature: "25°C to 31°C year-round",
    rainfall: "Moderate rainfall during May to October"
  },
  essentialInfo: [
    {
      title: "Local Culture",
      description: "Dhigurah is a traditional Maldivian island where local customs are respected. Modest dress is appreciated in the village area."
    },
    {
      title: "Connectivity",
      description: "Wi-Fi is available in most guesthouses and restaurants. Mobile coverage is good throughout the island."
    },
    {
      title: "Transport",
      description: "Regular speedboat transfers available from Male to Dhigurah. Book your transfer with Retour Maldives for the best experience."
    }
  ],
  quickFacts: [
    {
      label: "Transfer Duration",
      value: "90 minutes",
      icon: "ship"
    },
    {
      label: "Island Length",
      value: "3 km",
      icon: "map"
    },
    {
      label: "Best For",
      value: "Marine Life",
      icon: "activity"
    },
    {
      label: "Accommodation",
      value: "Guesthouses",
      icon: "home"
    },
    {
      label: "Peak Season",
      value: "Nov-Apr",
      icon: "clock"
    },
    {
      label: "Daily Transfers",
      value: "Yes",
      icon: "calendar"
    }
  ],
  faqs: [
    {
      question: "What's the best time to see whale sharks?",
      answer: "While whale sharks can be spotted year-round, the best sightings are typically during the dry season from November to April."
    },
    {
      question: "Are there ATMs on the island?",
      answer: "Yes, there is one ATM on the island, but it's recommended to bring cash from Male' as backup."
    },
    {
      question: "How do I get to Dhigurah from Male?",
      answer: "The most convenient way is by speedboat transfer with Retour Maldives, which takes approximately 90 minutes from Male International Airport."
    },
    {
      question: "How much does a speedboat transfer to Dhigurah cost?",
      answer: "Prices vary by season, but you can check current rates and book directly through our website."
    }
  ]
};

const DhigurahIsland = () => {
  return (
    <>
      <Helmet>
        <title>Speedboat Transfer to Dhigurah Island | Retour Maldives</title>
        <meta name="description" content="Book your speedboat transfer to A.Dh Dhigurah from Male. Daily departures, 90-minute journey, comfortable boats. Best rates for Dhigurah island transfers." />
        <meta name="keywords" content="Dhigurah speedboat, Dhigurah island transfer, Maldives Dhigurah, A.Dh Dhigurah, speedboat to Dhigurah, Dhigurah ferry" />
        <link rel="canonical" href="https://retourmaldives.com/islands/dhigurah" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Speedboat Transfer to Dhigurah Island | Retour Maldives" />
        <meta property="og:description" content="Book your speedboat transfer to A.Dh Dhigurah from Male. Daily departures, 90-minute journey, comfortable boats." />
        <meta property="og:url" content="https://retourmaldives.com/islands/dhigurah" />
        
        {/* Twitter */}
        <meta name="twitter:title" content="Speedboat Transfer to Dhigurah Island | Retour Maldives" />
        <meta name="twitter:description" content="Book your speedboat transfer to A.Dh Dhigurah from Male. Daily departures, 90-minute journey, comfortable boats." />
        
        {/* Structured data for Dhigurah page */}
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "TouristDestination",
            "name": "A.Dh Dhigurah Island",
            "description": "A beautiful 3-kilometer stretch of white sandy beach surrounded by crystal clear waters, famous for whale shark sightings.",
            "url": "https://retourmaldives.com/islands/dhigurah",
            "touristType": ["Beach Lovers", "Marine Life Enthusiasts", "Snorkelers"],
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "3.4833",
              "longitude": "72.9333"
            },
            "containedInPlace": {
              "@type": "AdministrativeArea",
              "name": "Alif Dhaal Atoll, Maldives"
            },
            "potentialAction": {
              "@type": "ReserveAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://retourmaldives.com/booking",
                "inLanguage": "en"
              },
              "result": {
                "@type": "Reservation",
                "name": "Speedboat Transfer to Dhigurah Island"
              }
            },
            "offers": {
              "@type": "Offer",
              "name": "Speedboat Transfer to Dhigurah",
              "description": "Direct speedboat transfer from Male to Dhigurah Island",
              "availability": "https://schema.org/InStock",
              "seller": {
                "@type": "TravelAgency",
                "name": "Retour Maldives"
              }
            }
          }
        `}</script>
      </Helmet>
      <IslandPageTemplate islandData={islandData} />
    </>
  );
};

export default DhigurahIsland;
