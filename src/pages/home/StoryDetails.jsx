import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { saveAs } from 'file-saver';
import backgroundImage from "../../../src/assets/images/bg-share.png";
import logoImage from "../../../src/assets/images/logo.png";
import { Helmet } from "react-helmet";
import { toast, Toaster } from 'sonner';
import { FaInstagram, FaDownload, FaShare } from "react-icons/fa";
import { motion } from "framer-motion"; 
import LocationMap from "../../components/Cards/LocationMap";

function StoryDetails() {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInstagramPreview, setShowInstagramPreview] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [templateType, setTemplateType] = useState('instagram');
  const [downloadProgress, setDownloadProgress] = useState(0);
  
  const canvasRef = useRef(null);
  
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

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const generateStoryImage = async () => {
    try {
      setIsDownloading(true);
      setDownloadProgress(10);
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = 1080;
      canvas.height = 1920;
      
      const loadImage = (src) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => resolve(img);
          img.onerror = () => {
            console.error(`Failed to load image: ${src}`);
            resolve(null);
          };
          img.src = src;
        });
      };
      
      setDownloadProgress(20);
      
      const logoImg = await loadImage(logoImage);
      const storyImg = await loadImage(story.imageUrl);
      
      setDownloadProgress(40);
      
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#f09433');
      gradient.addColorStop(0.25, '#e6683c');
      gradient.addColorStop(0.5, '#dc2743');
      gradient.addColorStop(0.75, '#cc2366');
      gradient.addColorStop(1, '#bc1888');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      setDownloadProgress(50);
      
      const contentAreaMargin = 80;
      const contentAreaWidth = canvas.width - (contentAreaMargin * 2);
      const contentAreaHeight = canvas.height - 300;
      const contentAreaX = contentAreaMargin;
      const contentAreaY = 200;
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.beginPath();
      ctx.roundRect(contentAreaX, contentAreaY, contentAreaWidth, contentAreaHeight, 20);
      ctx.fill();
      
      setDownloadProgress(60);
      
      if (logoImg) {
        const logoWidth = 200;
        const logoHeight = (logoImg.height / logoImg.width) * logoWidth;
        const logoX = (canvas.width - logoWidth) / 2;
        const logoY = 80;
        
        ctx.drawImage(logoImg, logoX, logoY, logoWidth, logoHeight);
      }
      
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      
      ctx.font = 'bold 56px Arial';
      ctx.fillText(story.title, canvas.width / 2, contentAreaY + 80, contentAreaWidth - 40);
      
      ctx.font = '36px Arial';
      ctx.fillText(formatDate(story.createdOn), canvas.width / 2, contentAreaY + 140, contentAreaWidth - 40);
      
      setDownloadProgress(70);
      
      if (storyImg) {
        const imgWidth = contentAreaWidth - 80;
        const imgHeight = (storyImg.height / storyImg.width) * imgWidth;
        const imgX = (canvas.width - imgWidth) / 2;
        const imgY = contentAreaY + 200;
        
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(imgX, imgY, imgWidth, imgHeight, 15);
        ctx.clip();
        ctx.drawImage(storyImg, imgX, imgY, imgWidth, imgHeight);
        ctx.restore();
        
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 5;
        ctx.beginPath();
        ctx.roundRect(imgX, imgY, imgWidth, imgHeight, 15);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
      
      setDownloadProgress(80);
      
      const descriptionY = contentAreaY + (storyImg ? 200 + ((storyImg.height / storyImg.width) * (contentAreaWidth - 80)) + 50 : 300);
      ctx.textAlign = 'left';
      ctx.font = '36px Arial';
      
      const wrapText = (text, x, y, maxWidth, lineHeight) => {
        const words = text.split(' ');
        let line = '';
        let testLine = '';
        let lineCount = 0;
        
        for (let i = 0; i < words.length; i++) {
          testLine = line + words[i] + ' ';
          const metrics = ctx.measureText(testLine);
          const testWidth = metrics.width;
          
          if (testWidth > maxWidth && i > 0) {
            ctx.fillText(line, x, y + (lineCount * lineHeight));
            line = words[i] + ' ';
            lineCount++;
            if (lineCount > 6) {
              line += '...';
              ctx.fillText(line, x, y + (lineCount * lineHeight));
              break;
            }
          } else {
            line = testLine;
          }
        }
        
        if (lineCount <= 6) {
          ctx.fillText(line, x, y + (lineCount * lineHeight));
        }
        
        return lineCount;
      };
      
      const descriptionLineHeight = 44;
      const descriptionLines = wrapText(
        story.story.length > 350 ? `${story.story.substring(0, 350)}...` : story.story, 
        contentAreaX + 40, 
        descriptionY, 
        contentAreaWidth - 80, 
        descriptionLineHeight
      );
      
      setDownloadProgress(90);
      
      const locationsY = contentAreaY + contentAreaHeight - 100;
      
      ctx.font = 'bold 30px Arial';
      ctx.fillText('Visited:', contentAreaX + 40, locationsY);
      
      ctx.font = '36px Arial';
      ctx.fillText(story.visitedLocation.join(' • '), contentAreaX + 40, locationsY + 50, contentAreaWidth - 80);
      
      ctx.textAlign = 'center';
      ctx.font = '32px Arial';
      ctx.fillText('Create your travel story at travelbook.sahilfolio.live', canvas.width / 2, canvas.height - 80);
      
      setDownloadProgress(95);
      
      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `${story.title}-instagram-story.png`);
          toast.success("Instagram Story image downloaded successfully!");
          setShowInstagramPreview(false);
        } else {
          throw new Error("Failed to create image file");
        }
        setIsDownloading(false);
        setDownloadProgress(100);
      }, 'image/png');
      
    } catch (error) {
      console.error("Error generating Instagram Story image:", error);
      toast.error("Failed to generate Instagram Story image.");
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  const handleDownload = () => {
    setShowInstagramPreview(true);
  };

  const downloadWithTemplate = () => {
    generateStoryImage();
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

      {showInstagramPreview && (
        <InstagramPreviewOverlay>
          <InstagramPreviewContainer>
            <InstagramPreviewHeader>
              <h3>Instagram Story (9:16)</h3>
              <CloseButton onClick={() => setShowInstagramPreview(false)}>×</CloseButton>
            </InstagramPreviewHeader>
            
            <TemplateSelectorContainer>
              <TemplateOption 
                isSelected={templateType === 'instagram'}
                onClick={() => setTemplateType('instagram')}
              >
                <TemplatePreview type="instagram" />
                <TemplateName>Instagram Gradient</TemplateName>
              </TemplateOption>
              
              <TemplateOption 
                isSelected={templateType === 'minimal'}
                onClick={() => setTemplateType('minimal')}
              >
                <TemplatePreview type="minimal" />
                <TemplateName>Minimal</TemplateName>
              </TemplateOption>
              
              <TemplateOption 
                isSelected={templateType === 'travel'}
                onClick={() => setTemplateType('travel')}
              >
                <TemplatePreview type="travel" />
                <TemplateName>Travel Theme</TemplateName>
              </TemplateOption>
            </TemplateSelectorContainer>
            
            {isDownloading && (
              <ProgressContainer>
                <ProgressText>Creating your story image...</ProgressText>
                <ProgressBar>
                  <ProgressFill width={downloadProgress} />
                </ProgressBar>
                <ProgressText>{downloadProgress}%</ProgressText>
              </ProgressContainer>
            )}
            
            <InstagramPreviewActions>
              <CancelButton onClick={() => setShowInstagramPreview(false)}>
                Cancel
              </CancelButton>
              <DownloadButton 
                onClick={downloadWithTemplate}
                disabled={isDownloading}
              >
                {isDownloading ? 'Creating...' : 'Download for Instagram Story'}
              </DownloadButton>
            </InstagramPreviewActions>
          </InstagramPreviewContainer>
        </InstagramPreviewOverlay>
      )}

      <StoryContainer>
        <StoryBox bgImage={backgroundImage}>
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
        
        <ShareOptionsContainer>
          <ShareOptionTitle>Share this travel story</ShareOptionTitle>
          
          <ShareButtonsContainer>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShareButton onClick={handleDownload} color="#e1306c">
                <FaInstagram /> Instagram Story
              </ShareButton>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShareButton 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Link copied to clipboard!");
                }} 
                color="#0088cc"
              >
                <FaShare /> Copy Link
              </ShareButton>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShareButton 
                onClick={() => window.print()} 
                color="#333333"
              >
                <FaDownload /> Print Story
              </ShareButton>
            </motion.div>
          </ShareButtonsContainer>
        </ShareOptionsContainer>
        
        <div className="w-full max-w-2xl mx-auto my-6">
          <LocationMap 
            locations={story.visitedLocation} 
            title={`Locations from "${story.title}"`} 
          />
        </div>
      </StoryContainer>
    </>
  );
}

export default StoryDetails;

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

const ShareOptionsContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 20px 0;
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const ShareOptionTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  text-align: center;
`;

const ShareButtonsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
`;

const ShareButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: ${props => props.color || '#e1306c'};
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    filter: brightness(90%);
  }

  svg {
    font-size: 1.3rem;
  }
`;

const TemplateSelectorContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
  gap: 10px;
`;

const TemplateOption = styled.div`
  flex: 1;
  border-radius: 8px;
  overflow: hidden;
  border: 3px solid ${props => props.isSelected ? '#e1306c' : 'transparent'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const TemplatePreview = styled.div`
  height: 150px;
  background: ${props => {
    switch(props.type) {
      case 'minimal':
        return 'linear-gradient(to bottom, #f5f5f5, #ffffff)';
      case 'travel':
        return 'linear-gradient(to bottom, #4facfe, #00f2fe)';
      case 'instagram':
      default:
        return 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)';
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::after {
    content: '';
    width: 70%;
    height: 40%;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 8px;
  }
`;

const TemplateName = styled.p`
  text-align: center;
  padding: 8px 0;
  font-size: 14px;
  font-weight: 500;
  background-color: #f5f5f5;
`;

const ProgressContainer = styled.div`
  margin: 20px 0;
`;

const ProgressText = styled.p`
  text-align: center;
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 10px;
  background-color: #f0f0f0;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 8px;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${props => props.width}%;
  background-color: #e1306c;
  transition: width 0.3s ease;
`;

