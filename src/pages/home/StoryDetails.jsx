import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components"; // Import styled-components
import html2canvas from "html2canvas"; // Import html2canvas
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

  const handleDownload = async () => {
    try {
      if (storyRef.current) {
        const canvas = await html2canvas(storyRef.current, {
          allowTaint: true, // Allow cross-origin images to be captured
          useCORS: true, // Use CORS for loading images
          width: 1080, // Set width to 1080px for Instagram story size
          height: 1920, // Set height to 1920px for Instagram story size
          scale: 2, // Optional: Set higher scale for better image quality
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
      <StoryBox ref={storyRef} bgImage={backgroundImage}>
        <StoryTitle>{story.title}</StoryTitle>
        <StoryDate>{new Date(story.createdOn).toLocaleDateString()}</StoryDate>
        <StoryImage src={story.imageUrl} alt={`Image for ${story.title}`} />
        <StoryContent>{story.story}</StoryContent>
        <VisitedLocations>
          <strong>Visited Locations:</strong> {story.visitedLocation.join(", ")}
        </VisitedLocations>
      </StoryBox>
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
  padding: 12px;
  width: 100%;
  max-width: 1080px; /* Ensure the box doesn't go beyond 1080px */
  height: 100%;
  max-height: 1920px; /* Set max height for Instagram story */
  margin: 20px;
  background-image: url(${(props) => props.bgImage || "default_bg.png"});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  justify-content: center; /* Centering content vertically */
  align-items: center; /* Centering content horizontally */
  text-align: center;
  padding: 0 20px;

  @media (max-width: 1080px) {
    width: 100%;
    height: auto;
    padding: 15px;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 12px;
  }

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const StoryTitle = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: #000;
  margin-bottom: 8px;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.4);
  margin-top: 10px;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const StoryDate = styled.p`
  font-size: 1rem;
  color: #000;
  margin-bottom: 12px;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.4);

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const StoryImage = styled.img`
  width: 80%;
  max-width: 800px;
  height: auto;
  margin-bottom: 15px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  object-fit: contain;

  @media (max-width: 768px) {
    width: 90%;
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const StoryContent = styled.p`
  font-size: 1.1rem;
  color: #000;
  line-height: 1.5;
  margin-bottom: 15px;
  max-width: 90%;
  word-wrap: break-word;

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const VisitedLocations = styled.p`
  font-size: 1.1rem;
  color: #000;
  max-width: 90%;
  word-wrap: break-word;

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
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

  @media (max-width: 768px) {
    padding: 8px 16px;
  }

  @media (max-width: 480px) {
    padding: 6px 14px;
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

