import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info, FileText, Image, MapPin, ChevronLeft, ChevronRight, X, Building2, Car } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductInfo {
  name: string;
  overview?: string;
  procedures?: string;
  photos?: string[];
  mapUrl?: string;
  mapEmbed?: string;
  category?: string;
}

interface ProductInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productInfo: ProductInfo | null;
}

type TabType = "overview" | "procedures" | "photos" | "map";

const ProductInfoModal = ({ open, onOpenChange, productInfo }: ProductInfoModalProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const photos = productInfo?.photos || [];
  const photosPerPage = 2;
  const totalPages = Math.ceil(photos.length / photosPerPage);
  const currentPage = Math.floor(currentPhotoIndex / photosPerPage);

  const nextLightboxPhoto = useCallback(() => {
    if (photos.length > 0) {
      setLightboxIndex((prev) => (prev + 1) % photos.length);
    }
  }, [photos.length]);

  const prevLightboxPhoto = useCallback(() => {
    if (photos.length > 0) {
      setLightboxIndex((prev) => (prev - 1 + photos.length) % photos.length);
    }
  }, [photos.length]);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setActiveTab("overview");
      setCurrentPhotoIndex(0);
      setLightboxOpen(false);
    }
  }, [open]);

  // Keyboard navigation for lightbox - MUST be before any early returns
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === "ArrowRight") nextLightboxPhoto();
      if (e.key === "ArrowLeft") prevLightboxPhoto();
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, nextLightboxPhoto, prevLightboxPhoto, closeLightbox]);

  // Early return AFTER all hooks
  if (!productInfo) return null;

  const nextPhoto = () => {
    if (currentPhotoIndex < photos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    }
  };

  const prevPhoto = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    }
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Overview", icon: <Info className="w-4 h-4" /> },
    { id: "procedures", label: "Procedures", icon: <FileText className="w-4 h-4" /> },
    { id: "photos", label: "Photos", icon: <Image className="w-4 h-4" /> },
    { id: "map", label: "Map", icon: <MapPin className="w-4 h-4" /> },
  ];

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle className="text-lg font-bold text-foreground pr-8">
              {productInfo.name}
            </DialogTitle>
          </DialogHeader>

          {/* Tab Buttons */}
          <div className="px-4 pt-4">
            <div className="tab-buttons-container flex gap-2 overflow-x-auto pb-2">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-1.5 whitespace-nowrap transition-all",
                    activeTab === tab.id
                      ? "bg-accent text-accent-foreground border-accent"
                      : "bg-background hover:bg-muted"
                  )}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-4">
                {/* Features Bullets */}
                <div className="bg-muted/50 rounded-lg p-4 mb-4">
                  <ul className="list-disc list-inside space-y-1.5 text-sm text-foreground">
                    <li>Meet and Greet</li>
                    <li>Valet Parking</li>
                    <li>Arrive At The Terminal</li>
                  </ul>
                </div>

                {/* Overview Content */}
                {productInfo.overview ? (
                  <div 
                    className="prose prose-sm max-w-none text-foreground [&_h3]:text-accent [&_h3]:font-bold [&_h3]:mb-2 [&_p]:mb-3"
                    dangerouslySetInnerHTML={{ __html: productInfo.overview }}
                  />
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Info className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No overview information available.</p>
                  </div>
                )}
              </div>
            )}

            {/* Procedures Tab */}
            {activeTab === "procedures" && (
              <div className="space-y-4">
                {productInfo.procedures ? (
                  <div 
                    className="prose prose-sm max-w-none text-foreground [&_h3]:text-accent [&_h3]:font-bold [&_h3]:mb-2 [&_p]:mb-3 [&_strong]:text-primary"
                    dangerouslySetInnerHTML={{ __html: productInfo.procedures }}
                  />
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No procedure information available.</p>
                  </div>
                )}
              </div>
            )}

            {/* Photos Tab */}
            {activeTab === "photos" && (
              <div className="space-y-4">
                {photos.length > 0 ? (
                  <>
                    <h3 className="text-lg font-bold text-foreground">Photo Gallery</h3>
                    
                    {/* Desktop View - Grid with navigation */}
                    <div className="hidden md:block">
                      <p className="text-sm text-muted-foreground mb-3">
                        Showing {currentPage * photosPerPage + 1}-{Math.min((currentPage + 1) * photosPerPage, photos.length)} of {photos.length} photos
                      </p>
                      
                      <div className="relative">
                        <div className="grid grid-cols-2 gap-3">
                          {photos
                            .slice(currentPage * photosPerPage, (currentPage + 1) * photosPerPage)
                            .map((photo, idx) => (
                              <img
                                key={currentPage * photosPerPage + idx}
                                src={photo}
                                alt={`${productInfo.name} photo ${currentPage * photosPerPage + idx + 1}`}
                                className="w-full h-40 object-cover rounded-lg cursor-pointer hover:scale-[1.02] transition-transform"
                                onClick={() => openLightbox(currentPage * photosPerPage + idx)}
                                loading="lazy"
                              />
                            ))}
                        </div>
                        
                        {/* Navigation */}
                        {totalPages > 1 && (
                          <div className="flex justify-center gap-4 mt-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPhotoIndex(Math.max(0, (currentPage - 1) * photosPerPage))}
                              disabled={currentPage === 0}
                            >
                              <ChevronLeft className="w-4 h-4 mr-1" />
                              Previous
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPhotoIndex(Math.min(photos.length - 1, (currentPage + 1) * photosPerPage))}
                              disabled={currentPage >= totalPages - 1}
                            >
                              Next
                              <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Mobile View - Carousel */}
                    <div className="md:hidden">
                      <p className="text-sm text-muted-foreground mb-3">
                        Showing {currentPhotoIndex + 1} of {photos.length} photos
                      </p>
                      
                      <div className="relative">
                        <img
                          src={photos[currentPhotoIndex]}
                          alt={`${productInfo.name} photo ${currentPhotoIndex + 1}`}
                          className="w-full h-48 object-cover rounded-lg cursor-pointer"
                          onClick={() => openLightbox(currentPhotoIndex)}
                        />
                        
                        {/* Carousel Navigation */}
                        {photos.length > 1 && (
                          <>
                            <button
                              onClick={prevPhoto}
                              disabled={currentPhotoIndex === 0}
                              className="carousel-nav prev disabled:opacity-30"
                              aria-label="Previous photo"
                            >
                              <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                              onClick={nextPhoto}
                              disabled={currentPhotoIndex === photos.length - 1}
                              className="carousel-nav next disabled:opacity-30"
                              aria-label="Next photo"
                            >
                              <ChevronRight className="w-5 h-5" />
                            </button>
                          </>
                        )}
                        
                        {/* Dots Indicator */}
                        <div className="flex justify-center gap-1.5 mt-3">
                          {photos.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentPhotoIndex(idx)}
                              className={cn(
                                "w-2 h-2 rounded-full transition-all",
                                idx === currentPhotoIndex
                                  ? "bg-primary w-4"
                                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                              )}
                              aria-label={`Go to photo ${idx + 1}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Image className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No photos available.</p>
                  </div>
                )}
              </div>
            )}

            {/* Map Tab */}
            {activeTab === "map" && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-foreground">Map</h3>
                {productInfo.mapEmbed ? (
                  <div 
                    className="w-full aspect-video rounded-lg overflow-hidden [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-0"
                    dangerouslySetInnerHTML={{ __html: productInfo.mapEmbed }}
                  />
                ) : productInfo.mapUrl ? (
                  <iframe
                    src={productInfo.mapUrl}
                    className="w-full aspect-video rounded-lg border-0"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No map available.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Lightbox */}
      {lightboxOpen && photos.length > 0 && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center lightbox-enter"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-accent transition-colors z-10"
            aria-label="Close lightbox"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Previous Button */}
          <button
            onClick={(e) => { e.stopPropagation(); prevLightboxPhoto(); }}
            className="carousel-nav prev !left-4 !bg-white/20 hover:!bg-white/40"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Image */}
          <img
            src={photos[lightboxIndex]}
            alt={`${productInfo?.name} photo ${lightboxIndex + 1}`}
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next Button */}
          <button
            onClick={(e) => { e.stopPropagation(); nextLightboxPhoto(); }}
            className="carousel-nav next !right-4 !bg-white/20 hover:!bg-white/40"
            aria-label="Next photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
            {lightboxIndex + 1} / {photos.length}
          </div>
        </div>
      )}
    </>
  );
};

export default ProductInfoModal;
