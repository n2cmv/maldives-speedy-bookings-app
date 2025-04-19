
const handleSubmit = async (islandData: Partial<Island>, currentIslandId?: string) => {
  try {
    // Include all new fields in the submission
    const submissionData = {
      name: islandData.name,
      description: islandData.description,
      image_url: islandData.image_url,
      tagline: islandData.tagline,
      slug: islandData.slug,
      full_description: islandData.fullDescription,
      hero_image: islandData.heroImage,
      gallery_images: islandData.galleryImages,
      activities: islandData.activities,
      accommodation: islandData.accommodation,
      dining: islandData.dining,
      location: islandData.location,
      travel_info: islandData.travelInfo,
      weather: islandData.weather,
      essential_info: islandData.essentialInfo,
      quick_facts: islandData.quickFacts,
      faqs: islandData.faqs
    };

    if (currentIslandId) {
      const { error } = await supabase
        .from("islands")
        .update(submissionData)
        .eq("id", currentIslandId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Island has been updated",
      });
    } else {
      const { error } = await supabase
        .from("islands")
        .insert(submissionData);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Island has been created",
      });
    }

    await fetchIslands();
    return true;
  } catch (error) {
    console.error("Error saving island:", error);
    toast({
      title: "Error",
      description: typeof error === 'object' && error !== null && 'message' in error 
        ? String(error.message) 
        : "Failed to save island",
      variant: "destructive",
    });
    return false;
  }
};
