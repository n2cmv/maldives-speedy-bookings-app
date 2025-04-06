
import { motion } from "framer-motion";
import { Ship, MapPin, Users, CalendarDays, Waves, Cloud, Sun, Utensils, Tent } from "lucide-react";
import { Island } from "@/types/booking";
import { useTranslation } from "react-i18next";

interface IslandDetailsProps {
  islandName: Island;
}

interface IslandData {
  name: Island;
  fullDescription: string;
  imageUrl: string;
  travelTime: string;
  bestFor: string[];
  activities: string[];
  weather: {
    season: string;
    temperature: string;
    rainfall: string;
  };
  accommodation: string[];
}

// Sample island data - in a real app this would come from an API or database
const islandDataMap: Record<Island, IslandData> = {
  "A.Dh Dhigurah": {
    name: "A.Dh Dhigurah",
    fullDescription: "Dhigurah is a beautiful island located in the South Ari Atoll, famous for its pristine beaches and stunning coral reefs. The island stretches about 3 km in length but is only about 300 meters wide. A paradise for nature lovers, it's known for whale shark sightings year-round and its vibrant marine ecosystem.",
    imageUrl: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb",
    travelTime: "1.5 hours",
    bestFor: ["Snorkeling", "Beach", "Whale shark spotting"],
    activities: ["Snorkeling", "Diving", "Beach activities", "Whale shark excursions", "Fishing trips"],
    weather: {
      season: "November to April (best time)",
      temperature: "25°C - 32°C",
      rainfall: "Low during dry season (Jan-Mar)"
    },
    accommodation: ["Guesthouses", "Boutique hotels", "Beach villas"]
  },
  "A.Dh Dhangethi": {
    name: "A.Dh Dhangethi",
    fullDescription: "Dhangethi is a charming local island in Ari Atoll with a rich cultural heritage. The island offers an authentic Maldivian experience with its traditional lifestyle, friendly locals, and beautiful beaches. It's less commercialized compared to other tourist destinations, making it perfect for travelers seeking a genuine cultural immersion.",
    imageUrl: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21",
    travelTime: "2 hours",
    bestFor: ["Cultural Experience", "Local cuisine", "Authentic lifestyle"],
    activities: ["Cultural tours", "Local food tasting", "Handicraft shopping", "Fishing with locals"],
    weather: {
      season: "Year-round (peak Dec-Mar)",
      temperature: "27°C - 30°C",
      rainfall: "Higher during May-October"
    },
    accommodation: ["Local guesthouses", "Homestays", "Budget hotels"]
  },
  "Aa. Mathiveri": {
    name: "Aa. Mathiveri",
    fullDescription: "Mathiveri is a picturesque island in the Alif Alif Atoll known for its marine biodiversity and vibrant underwater ecosystem. The island boasts beautiful white sandy beaches, crystal clear waters, and is surrounded by colorful coral reefs. It's an excellent destination for marine enthusiasts and underwater photographers.",
    imageUrl: "https://images.unsplash.com/photo-1518877593221-1f28583780b4",
    travelTime: "2.5 hours",
    bestFor: ["Diving", "Marine Life", "Photography"],
    activities: ["Scuba diving", "Snorkeling", "Marine life observation", "Beach picnics", "Island hopping"],
    weather: {
      season: "Best visited November-April",
      temperature: "26°C - 31°C",
      rainfall: "Moderate year-round"
    },
    accommodation: ["Diving resorts", "Beach bungalows", "Water villas"]
  },
  // Default values for other islands - these would be filled with proper data in a real application
  "Male": {
    name: "Male",
    fullDescription: "The capital and most populous city in the Republic of Maldives.",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    travelTime: "30 minutes",
    bestFor: ["City exploration", "Shopping", "History"],
    activities: ["Shopping", "Historical sites", "Local markets", "Museums"],
    weather: {
      season: "Year-round",
      temperature: "28°C - 32°C",
      rainfall: "Moderate year-round"
    },
    accommodation: ["City hotels", "Guesthouses", "Boutique hotels"]
  },
  "Hulhumale": {
    name: "Hulhumale",
    fullDescription: "A reclaimed island near the airport, connected to Male by a bridge.",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    travelTime: "15 minutes",
    bestFor: ["Convenience", "Beach", "Modern amenities"],
    activities: ["Beach activities", "Dining", "Shopping"],
    weather: {
      season: "Year-round",
      temperature: "28°C - 32°C",
      rainfall: "Moderate year-round"
    },
    accommodation: ["Hotels", "Guesthouses", "Transit accommodations"]
  },
  "Maafushi": {
    name: "Maafushi",
    fullDescription: "One of the most popular local islands for tourists in the Maldives.",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    travelTime: "1 hour",
    bestFor: ["Budget travel", "Water sports", "Beaches"],
    activities: ["Water sports", "Snorkeling", "Beach", "Excursions"],
    weather: {
      season: "November to April (best time)",
      temperature: "27°C - 31°C",
      rainfall: "Low during dry season"
    },
    accommodation: ["Budget hotels", "Guesthouses", "Small resorts"]
  },
  "Baa Atoll": {
    name: "Baa Atoll",
    fullDescription: "A UNESCO Biosphere Reserve known for its rich marine biodiversity.",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    travelTime: "3 hours",
    bestFor: ["Luxury", "Nature", "Marine conservation"],
    activities: ["Luxury resorts", "Marine conservation", "Snorkeling", "Diving"],
    weather: {
      season: "May to November (for manta rays)",
      temperature: "26°C - 30°C",
      rainfall: "Varies by season"
    },
    accommodation: ["Luxury resorts", "Private islands", "High-end villas"]
  },
  "Ari Atoll": {
    name: "Ari Atoll",
    fullDescription: "Famous for diving and home to some of the best dive sites in the Maldives.",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    travelTime: "2 hours",
    bestFor: ["Diving", "Luxury", "Marine life"],
    activities: ["Diving", "Snorkeling", "Resort life", "Submarine tours"],
    weather: {
      season: "Year-round (best Dec-Apr)",
      temperature: "27°C - 31°C",
      rainfall: "Higher during May-October"
    },
    accommodation: ["Diving resorts", "Luxury hotels", "Overwater bungalows"]
  },
  "Male' City": {
    name: "Male' City",
    fullDescription: "The bustling capital city of the Maldives with markets, museums, and city life.",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    travelTime: "Varies",
    bestFor: ["Urban exploration", "Shopping", "Culture"],
    activities: ["Shopping", "Museums", "Local food", "City tours"],
    weather: {
      season: "Year-round",
      temperature: "28°C - 32°C",
      rainfall: "Moderate year-round"
    },
    accommodation: ["City hotels", "Business hotels", "Guesthouses"]
  },
  "Male' Airport": {
    name: "Male' Airport",
    fullDescription: "Velana International Airport, the main gateway to the Maldives.",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    travelTime: "Arrival point",
    bestFor: ["Transit", "Connections"],
    activities: ["Shopping", "Dining", "Transit facilities"],
    weather: {
      season: "Year-round",
      temperature: "28°C - 32°C",
      rainfall: "Moderate year-round"
    },
    accommodation: ["Transit hotels", "Airport hotels", "Day rooms"]
  }
};

const IslandDetails = ({ islandName }: IslandDetailsProps) => {
  const { t } = useTranslation();
  const islandData = islandDataMap[islandName];
  
  if (!islandData) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <div className="relative h-60">
        <img 
          src={islandData.imageUrl}
          alt={islandData.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
          <div className="p-4 text-white">
            <h2 className="text-2xl font-bold">{islandData.name}</h2>
            <div className="flex items-center mt-2">
              <Ship className="w-4 h-4 mr-2" />
              <span className="text-sm">{islandData.travelTime}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <p className="text-gray-700 mb-4">{islandData.fullDescription}</p>
        
        <div className="mb-4">
          <h3 className="font-semibold text-ocean-dark flex items-center mb-2">
            <MapPin className="w-4 h-4 mr-1" /> {t("islands.bestFor")}:
          </h3>
          <div className="flex flex-wrap gap-2">
            {islandData.bestFor.map((activity, index) => (
              <span key={index} className="bg-ocean-light/10 text-ocean-dark px-2 py-1 rounded-full text-xs">
                {activity}
              </span>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <h3 className="font-semibold text-ocean-dark flex items-center mb-2">
            <Users className="w-4 h-4 mr-1" /> Activities:
          </h3>
          <ul className="list-disc list-inside text-gray-700 text-sm">
            {islandData.activities.map((activity, index) => (
              <li key={index}>{activity}</li>
            ))}
          </ul>
        </div>
        
        <div className="mb-4">
          <h3 className="font-semibold text-ocean-dark flex items-center mb-2">
            <Sun className="w-4 h-4 mr-1" /> Weather:
          </h3>
          <div className="text-sm text-gray-700">
            <div className="flex items-center mb-1">
              <CalendarDays className="w-4 h-4 mr-1 text-ocean-light" />
              <span>Season: {islandData.weather.season}</span>
            </div>
            <div className="flex items-center mb-1">
              <Sun className="w-4 h-4 mr-1 text-ocean-light" />
              <span>Temperature: {islandData.weather.temperature}</span>
            </div>
            <div className="flex items-center">
              <Cloud className="w-4 h-4 mr-1 text-ocean-light" />
              <span>Rainfall: {islandData.weather.rainfall}</span>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold text-ocean-dark flex items-center mb-2">
            <Tent className="w-4 h-4 mr-1" /> Accommodation:
          </h3>
          <ul className="list-disc list-inside text-gray-700 text-sm">
            {islandData.accommodation.map((option, index) => (
              <li key={index}>{option}</li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default IslandDetails;
