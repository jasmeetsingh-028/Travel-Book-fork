import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components"; // Import styled-components
import html2canvas from "html2canvas"; // Import html2canvas
import backgroundImage from "../../../src/assets/images/bg-share.png"; // Import background image

function StoryDetails() {
  const { id } = useParams(); // Get the ID from the URL?
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

  const handleDownload = async () => {
    try {
      if (storyRef.current) {
        const canvas = await html2canvas(storyRef.current, {
          allowTaint: true,
          useCORS: true,
          width: 1080,
          height: 1920,
          scale: 2,
        });

        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `${story.title}.png`;
        link.click();
      }
    } catch (error) {
      console.error("Error generating canvas:", error);
    }
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
      <ScaledStoryBox>
        <StoryBox ref={storyRef} bgImage={backgroundImage}>
          <StoryTitle>{story.title}</StoryTitle>
          <StoryDate>{new Date(story.createdOn).toLocaleDateString()}</StoryDate>
          <StoryImage src={story.imageUrl} alt={`Image for ${story.title}`} />
          <StoryContent>{story.story}</StoryContent>
          <VisitedLocations>
            <strong>Visited Locations:</strong> {story.visitedLocation.join(", ")}
          </VisitedLocations>
        </StoryBox>
      </ScaledStoryBox>
      <DownloadButton onClick={handleDownload}>
        Click here to download image as PNG
      </DownloadButton>
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
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 1080px; 
  height: 1920px; 
  margin: 20px;
  background-image: url(${(props) => props.bgImage || "default_bg.png"});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 0 20px;
`;

const ScaledStoryBox = styled.div`
  width: 90vw;
  max-width: 400px;
  transform: scale(0.35);
  transform-origin: top left;
  overflow: hidden;
  height: calc(90vw * 1.7777777778); /* Maintain aspect ratio */
  @media (min-width: 768px) {
    transform: scale(0.5);
    max-width: 540px;
    height: calc(540px * 1.7777777778);
  }
`;

const StoryTitle = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: #000;
  margin-bottom: 8px;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.4);
  margin-top: 10px;
`;

const StoryDate = styled.p`
  font-size: 1rem;
  color: #000;
  margin-bottom: 12px;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.4);
`;

const StoryImage = styled.img`
  width: 80%;
  max-width: 800px;
  height: auto;
  margin-bottom: 15px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  object-fit: contain;
`;

const StoryContent = styled.p`
  font-size: 1.1rem;
  color: #000;
  line-height: 1.5;
  margin-bottom: 15px;
  max-width: 90%;
  word-wrap: break-word;
`;

const VisitedLocations = styled.p`
  font-size: 1.1rem;
  color: #000;
  max-width: 90%;
  word-wrap: break-word;
`;

const DownloadButton = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;

  &:hover {
    background-color: #45a049;
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
