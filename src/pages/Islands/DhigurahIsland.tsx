
import React from 'react';
import IslandPageTemplate from '@/components/islands/IslandPageTemplate';
import { IslandDetails } from '@/types/island';

const islandData: IslandDetails = {
  name: "A.Dh Dhigurah",
  tagline: "Where Nature Meets Paradise",
  slug: "dhigurah",
  fullDescription: "Dhigurah, meaning 'long island' in Dhivehi, is a stunning 3-kilometer stretch of white sandy beach surrounded by crystal clear waters. Known for its incredible marine life, particularly whale sharks, this island offers a perfect blend of local Maldivian culture and natural beauty.",
  heroImage: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
  galleryImages: [
    "https://images.unsplash.com/photo-1540202404-1b927e27fa8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2026&q=80",
    "https://images.unsplash.com/photo-1586500036706-41963de24d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2127&q=80",
    "https://images.unsplash.com/photo-1589979481223-deb893043163?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2060&q=80"
  ],
  location: {
    atoll: "Alif Dhaal Atoll",
    coordinates: "3.4833° N, 72.9333° E"
  },
  travelInfo: {
    fromMale: "90-minute speedboat ride",
    bestWayToReach: "Direct speedboat transfer from Male' International Airport"
  },
  activities: [
    {
      name: "Whale Shark Watching",
      description: "Experience the majestic whale sharks in their natural habitat. Dhigurah is famous for year-round whale shark sightings.",
      image: "https://images.unsplash.com/photo-1595153838579-49190646dedb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
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
    }
  ]
};

const DhigurahIsland = () => {
  return <IslandPageTemplate islandData={islandData} />;
};

export default DhigurahIsland;
