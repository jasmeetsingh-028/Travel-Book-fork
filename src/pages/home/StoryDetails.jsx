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
        <StoryTitle>{story.title}</StoryTitle>
        <StoryDate>{new Date(story.createdOn).toLocaleDateString()}</StoryDate>
        <StoryImage src={story.imageUrl} alt={`Image for ${story.title}`} />
        <StoryContent>{story.story}</StoryContent>
        <VisitedLocations>
          <strong>Visited Locations:</strong> {story.visitedLocation.join(", ")}
        </VisitedLocations>
      </StoryBox>
      <DownloadButton onClick={handleDownload}>Click here to download image as PNG</DownloadButton>
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
  background-color: #000; /* Set background color to black */
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 12px;
  width: 100%;
  max-width: 1080px;
  height: auto;
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

  @media (max-width: 768px) {
    padding: 15px;
    width: 100%;
  }

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const StoryTitle = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: white; /* Text color white */
  margin-bottom: 8px;
`;

const StoryDate = styled.p`
  font-size: 1rem;
  color: white; /* Text color white */
  margin-bottom: 12px;
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
  color: white; /* Text color white */
  line-height: 1.5;
  margin-bottom: 15px;
  max-width: 90%;
  word-wrap: break-word;
`;

const VisitedLocations = styled.p`
  font-size: 1.1rem;
  color: white; /* Text color white */
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
