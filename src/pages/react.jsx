
import { useState } from "react";
import Gallery from "@/components/Gallery";
import ImagePreview from "@/components/ImagePreview";
import { ImageData } from "@/types/image";
import { galleryImages } from "@/data/images";

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  
  const handleImageClick = (image: ImageData) => {
    setSelectedImage(image);
  };
  
  const handleClosePreview = () => {
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen bg-neutral-50 px-4 md:px-8 py-12">
      <header className="mb-10 max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-3">Image Gallery</h1>
        <p className="text-neutral-600">A collection of beautiful images in a responsive masonry layout.</p>
      </header>
      
      <main className="max-w-7xl mx-auto">
        <Gallery images={galleryImages} onImageClick={handleImageClick} />
      </main>
      
      {selectedImage && (
        <ImagePreview image={selectedImage} onClose={handleClosePreview} />
      )}
    </div>
  );
};

export default Index;
