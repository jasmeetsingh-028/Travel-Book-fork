import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import html2canvas from "html2canvas";
import backgroundImage from "../../../src/assets/images/bg-share.png";
import { Helmet } from "react-helmet";
import { toast, Toaster } from 'sonner';
import { FaInstagram } from "react-icons/fa";
import { motion } from "framer-motion"; 
import LocationMap from "../../components/Cards/LocationMap";

function StoryDetails() {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const storyRef = useRef();
  const instagramStoryRef = useRef(); // Separate ref for Instagram story template
  const [showInstagramPreview, setShowInstagramPreview] = useState(false);
  
  // Track download progress
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await fetch(`https://travel-book-backend.onrender.com/api/story/${id}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setStory(data);
        toast.success("Story details loaded successfully.");
      } catch (error) {
        console.error("Error fetching story details:", error);
        setError("Error fetching story details.");
        toast.error("Failed to fetch story details.");
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [id]);

  // Regular download (as before)
  const handleDownload = async () => {
    setShowInstagramPreview(true);
  };

  // Instagram story optimized download
  const downloadForInstagram = async () => {
    try {
      setIsDownloading(true);
      
      if (instagramStoryRef.current) {
        const canvas = await html2canvas(instagramStoryRef.current, {
          allowTaint: true,
          useCORS: true,
          width: 1080,
          height: 1920,
          scale: 2,
          logging: false,
          backgroundColor: null,
        });

        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `${story.title}-instagram-story.png`;
        link.click();
        toast.success("Instagram Story image downloaded successfully.");
        setShowInstagramPreview(false);
      }
    } catch (error) {
      console.error("Error generating Instagram Story image:", error);
      toast.error("Failed to generate Instagram Story image.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Format date nicely
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <Loading>Loading...</Loading>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  if (!story) {
    return <ErrorMessage>No story found.</ErrorMessage>;
  }

  return (
    <>
      <Toaster position="top-right" richColors />

      <Helmet>
        <title>{story.title} | Travel Book</title>
        <meta property="og:title" content="The memories are shared with you." />
        <meta property="og:image" content={story.imageUrl} />
        <meta property="og:description" content={story.story} />
        <meta property="og:url" content={`https://travelbook.sahilfolio.live/story/${id}`} />
      </Helmet>

      {/* Instagram Story Preview Modal */}
      {showInstagramPreview && (
        <InstagramPreviewOverlay>
          <InstagramPreviewContainer>
            <InstagramPreviewHeader>
              <h3>Instagram Story Preview (9:16)</h3>
              <CloseButton onClick={() => setShowInstagramPreview(false)}>×</CloseButton>
            </InstagramPreviewHeader>
            
            {/* Instagram Story Template */}
            <InstagramStoryTemplate ref={instagramStoryRef}>
              <InstagramStoryContent>
                <StoryLogoArea>
                  <img src="/src/assets/images/logo.png" alt="Travel Book Logo" className="logo" />
                </StoryLogoArea>
                
                <StoryMainContent>
                  <StoryMainTitle>{story.title}</StoryMainTitle>
                  <StoryMainDate>{formatDate(story.createdOn)}</StoryMainDate>
                  
                  <StoryMainImage src={story.imageUrl} alt={story.title} />
                  
                  <StoryMainDescription>
                    {story.story.length > 200 
                      ? `${story.story.substring(0, 200)}...` 
                      : story.story}
                  </StoryMainDescription>
                  
                  <StoryMainLocations>
                    <LocationsLabel>Visited:</LocationsLabel>
                    <LocationsList>{story.visitedLocation.join(" • ")}</LocationsList>
                  </StoryMainLocations>
                </StoryMainContent>
                
                <StoryFooter>
                  <FooterText>Create your travel story at travelbook.sahilfolio.live</FooterText>
                </StoryFooter>
              </InstagramStoryContent>
            </InstagramStoryTemplate>
            
            <InstagramPreviewActions>
              <CancelButton onClick={() => setShowInstagramPreview(false)}>
                Cancel
              </CancelButton>
              <DownloadButton 
                onClick={downloadForInstagram}
                disabled={isDownloading}
              >
                {isDownloading ? 'Creating...' : 'Download for Instagram Story'}
              </DownloadButton>
            </InstagramPreviewActions>
          </InstagramPreviewContainer>
        </InstagramPreviewOverlay>
      )}

      <StoryContainer>
        <StoryBox ref={storyRef} bgImage={backgroundImage}>
          <StoryTitle>{story.title}</StoryTitle>
          <StoryDate>{new Date(story.createdOn).toLocaleDateString()}</StoryDate>
          <StoryImage src={story.imageUrl} alt={`Image for ${story.title}`} />
          <StoryContent>{story.story}</StoryContent>
          <VisitedLocations>
            <strong>Visited Locations:</strong> {story.visitedLocation.join(", ")}
          </VisitedLocations>
          <CreateStoryMessage>
            Create your own travel story from <a href="https://travelbook.sahilfolio.live/">https://travelbook.sahilfolio.live/</a>
          </CreateStoryMessage>
        </StoryBox>
        
        {/* Map Component */}
        <div className="w-full max-w-2xl mx-auto my-6">
          <LocationMap 
            locations={story.visitedLocation} 
            title={`Locations from "${story.title}"`} 
          />
        </div>
        
        {/* Instagram Share Button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ShareButton onClick={handleDownload}>
            <FaInstagram /> Create Instagram Story Image
          </ShareButton>
        </motion.div>
      </StoryContainer>
    </>
  );
}

export default StoryDetails;

// Styled-components for styling inside the file

const StoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #f4f4f4;
  min-height: 100vh;
`;

const StoryBox = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 12px;
  width: 1080px;
  height: auto;
  margin: 20px;
  background-image: url(${(props) => props.bgImage || "default_bg.png"});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  padding: 0 20px;
  position: relative;

  @media (max-width: 1080px) {
    width: 90%;
  }
  @media (max-width: 768px) {
    width: 100%;
    padding: 15px;
  }
  @media (max-width: 480px) {
    width: 100%;
    padding: 10px;
  }
`;

const CreateStoryMessage = styled.p`
  font-size: 1rem;
  font-weight: bold;
  color: #555;
  margin-top: 15px;
  text-align: center;
  width: 100%;
  opacity: 0.8;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
`;

const StoryTitle = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  color: #000;
  margin-bottom: 8px;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.4);
  margin-top: 10px;
`;

const StoryDate = styled.p`
  font-size: 1.5rem;
  font-weight: bold;
  color: #000;
  margin-bottom: 12px;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.4);
`;

const StoryImage = styled.img`
  width: 80%;
  max-width: 800px;
  height: auto;
  margin-bottom: 15px;
  border-radius: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  object-fit: contain;
`;

const StoryContent = styled.p`
  font-size: 1.3rem;
  font-weight: normal;
  color: #000;
  line-height: 1.5;
  margin-bottom: 15px;
  max-width: 90%;
  word-wrap: break-word;
  overflow-wrap: break-word;
`;

const VisitedLocations = styled.p`
  font-size: 1.3rem;
  font-weight: normal;
  color: #000;
  max-width: 90%;
  word-wrap: break-word;
  margin-top: 15px;
`;

const ShareButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: #e1306c;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: bold;
  transition: background 0.3s ease-in-out;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: #c13584;
  }

  svg {
    font-size: 1.5rem;
  }
`;

const ErrorMessage = styled.div`
  font-size: 1.5rem;
  color: red;
  text-align: center;
`;

const Loading = styled.div`
  font-size: 1.5rem;
  color: #333;
  text-align: center;
`;

// New styled components for Instagram Story

const InstagramPreviewOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const InstagramPreviewContainer = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  width: 90%;
  max-width: 400px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
`;

const InstagramPreviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  
  h3 {
    margin: 0;
    font-size: 1.2rem;
    font-weight: bold;
    color: #333;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #000;
  }
`;

const InstagramStoryTemplate = styled.div`
  width: 270px;
  height: 480px;
  margin: 0 auto;
  background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
  border-radius: 20px;
  overflow: hidden;
  position: relative;
`;

const InstagramStoryContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
  color: white;
`;

const StoryLogoArea = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
  
  .logo {
    height: 40px;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  }
`;

const StoryMainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 15px;
  overflow: hidden;
`;

const StoryMainTitle = styled.h2`
  font-size: 1.4rem;
  font-weight: bold;
  margin: 0 0 5px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const StoryMainDate = styled.p`
  font-size: 0.8rem;
  margin: 0 0 10px 0;
  opacity: 0.9;
`;

const StoryMainImage = styled.img`
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const StoryMainDescription = styled.p`
  font-size: 0.8rem;
  line-height: 1.4;
  margin: 0 0 10px 0;
  flex: 1;
  overflow: hidden;
`;

const StoryMainLocations = styled.div`
  margin-top: auto;
`;

const LocationsLabel = styled.p`
  font-size: 0.7rem;
  font-weight: bold;
  margin: 0;
  opacity: 0.8;
`;

const LocationsList = styled.p`
  font-size: 0.8rem;
  margin: 2px 0 0 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StoryFooter = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: center;
`;

const FooterText = styled.p`
  font-size: 0.8rem;
  text-align: center;
  opacity: 0.9;
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

const InstagramPreviewActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 10px;
  margin-right: 10px;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const DownloadButton = styled.button`
  flex: 2;
  padding: 10px;
  border: none;
  background-color: #e1306c;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background-color: #c13584;
  }
  
  &:disabled {
    background-color: #e886ab;
    cursor: not-allowed;
  }
`;

