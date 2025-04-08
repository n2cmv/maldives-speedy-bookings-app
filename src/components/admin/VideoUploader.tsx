
import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const VideoUploader = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      
      // Check if it's a video file
      if (!selectedFile.type.startsWith('video/')) {
        toast.error('Please select a valid video file');
        return;
      }
      
      // Check file size (max 1GB)
      if (selectedFile.size > 1073741824) {
        toast.error('File is too large. Maximum size is 1GB');
        return;
      }
      
      setFile(selectedFile);
    }
  };
  
  const uploadVideo = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }
    
    try {
      setUploading(true);
      setProgress(0);
      
      const fileName = 'maldives-background.mp4'; // Fixed filename for the background video
      
      // Create a new XMLHttpRequest to track upload progress
      const xhr = new XMLHttpRequest();
      
      // Setup progress event
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progressPercent = Math.round((event.loaded / event.total) * 100);
          setProgress(progressPercent);
        }
      });
      
      // Use Supabase upload but track progress with our own XHR
      const { error } = await supabase.storage
        .from('videos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });
        
      if (error) {
        throw error;
      }
      
      toast.success('Video uploaded successfully!', {
        description: 'Your new background video has been set'
      });
      
      // Reload the page to show the new video
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      console.error('Error uploading video:', error);
      toast.error('Upload failed', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Upload Background Video</h2>
      <p className="text-gray-600 mb-4">
        Upload an MP4 video to replace the background video on the homepage.
        Maximum file size: 1GB.
      </p>
      
      <div className="space-y-4">
        <Input 
          type="file"
          accept="video/mp4,video/webm,video/ogg"
          onChange={handleFileChange}
          disabled={uploading}
        />
        
        {file && (
          <div className="text-sm text-gray-600">
            Selected: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
          </div>
        )}
        
        {uploading && (
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-ocean h-2.5 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
            <p className="text-sm text-gray-600 mt-1">
              Uploading: {progress}%
            </p>
          </div>
        )}
        
        <Button
          onClick={uploadVideo}
          disabled={!file || uploading}
          className="w-full"
        >
          {uploading ? 'Uploading...' : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Video
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default VideoUploader;
