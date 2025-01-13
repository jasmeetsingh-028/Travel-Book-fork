import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import domtoimage from "dom-to-image";  // Import dom-to-image for capturing the DOM as an image
import backgroundImage from "../../../src/assets/images/bg-share.png"; // Import background image

function StoryDetails() {
  const { id } = useParams(); // Get the ID from the URL
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const storyRef = useRef(); // Create a ref for the story box

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await fetch(`https://travel-book-backend.onrender.com/api/story/${id}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setStory(data);
      } catch (error) {
        console.error("Error fetching story details:", error);
        setError("Error fetching story details.");
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [id]);

  const handleDownload = () => {
    const node = storyRef.current; // Get the story container reference
    domtoimage.toPng(node)
      .then(function (dataUrl) {
        // Create an image element from the data URL
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `${story.title}.png`; // Set the filename based on the title
        link.click(); // Trigger the download
      })
      .catch(function (error) {
        console.error("Error capturing image:", error);
      });
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
    <StoryContainer>
      <StoryBox ref={storyRef} bgImage={backgroundImage}>
        <TitleText>{story.title}</TitleText>
        <StoryImage src={story.imageUrl} alt={`Image for ${story.title}`} />
        <StoryText>{story.story}</StoryText>
        <VisitedText>
          <strong>Visited Locations:</strong> {story.visitedLocation.join(", ")}
        </VisitedText>
      </StoryBox>
      <DownloadButton onClick={handleDownload}>Download as PNG for Instagram Story</DownloadButton>
    </StoryContainer>
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
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 100%;
  max-width: 1080px;
  height: 100%;
  background-image: url(${(props) => props.bgImage || "default_bg.png"});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  color: white; /* Text color for better visibility on dark backgrounds */
  padding: 40px;
  height: 100vh; /* Full screen height for Instagram story feel */
  position: relative;
  max-height: 1920px;
  aspect-ratio: 9 / 16; /* Set aspect ratio for Instagram story */
  
  @media (max-width: 768px) {
    padding: 20px;
    width: 100%;
  }

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const TitleText = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  color: black; /* Text color black */
  margin-bottom: 16px;
  z-index: 1;
`;

const StoryImage = styled.img`
  width: 100%;
  max-width: 800px;
  height: auto;
  margin-bottom: 20px;
  border-radius: 16px;
  object-fit: cover;
  max-height: 60%; /* Make sure image doesn't dominate too much */
  z-index: 1;
`;

const StoryText = styled.p`
  font-size: 1.5rem;
  color: black; /* Text color black */
  line-height: 1.6;
  margin-bottom: 20px;
  z-index: 1;
  max-width: 90%;
`;

const VisitedText = styled.p`
  font-size: 1.2rem;
  color: black; /* Text color black */
  margin-top: auto;
  max-width: 90%;
  z-index: 1;
`;

const DownloadButton = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 12px 30px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  margin-top: 30px;
  font-size: 1rem;
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    background-color: #45a049;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const Loading = styled.div`
  font-size: 1.5rem;
  color: #333;
`;

const ErrorMessage = styled.div`
  font-size: 1.5rem;
  color: red;
`;
