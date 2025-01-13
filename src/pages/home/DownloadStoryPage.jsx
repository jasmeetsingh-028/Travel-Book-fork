import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import domtoimage from "dom-to-image";
import backgroundImage from "../../../src/assets/images/bg-share.png";

function DownloadStoryPage() {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const storyRef = useRef();

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
    const node = storyRef.current;
    domtoimage.toPng(node)
      .then(function (dataUrl) {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `${story.title}-instagram-story.png`;
        link.click();
      })
      .catch(function (error) {
        console.error("Error capturing image:", error);
      });
  };

  // Function to add the URL to the story text
  const getUpdatedStoryText = (storyText, storyId) => {
    const firstSentenceEnd = storyText.indexOf('.') + 1;
    const firstPart = storyText.substring(0, firstSentenceEnd);
    const link = `to read more, go to https://travelbook.sahilportfolio.me/story/${storyId}`;
    return firstPart + " " + link;
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

  const updatedStoryText = getUpdatedStoryText(story.story, story._id);

  return (
    <StoryContainer>
      <StoryBox ref={storyRef} bgImage={backgroundImage}>
        <TitleText>{story.title}</TitleText>
        <StoryImageWrapper>
          <StoryImage src={story.imageUrl} alt={`Image for ${story.title}`} />
        </StoryImageWrapper>
        <StoryText>{updatedStoryText}</StoryText>
      </StoryBox>
      <DownloadButton onClick={handleDownload}>Download as Instagram Story</DownloadButton>
    </StoryContainer>
  );
}

export default DownloadStoryPage;

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
  text-align: center;
  width: 100%;
  max-width: 600px;
  background-image: url(${(props) => props.bgImage || "default_bg.png"});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: auto;
  max-height: 90vh; /* Ensuring box does not exceed viewport height */
  aspect-ratio: 9 / 16;
  overflow: hidden; /* Preventing overflow */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const TitleText = styled.h1`
  font-size: 2rem;
  margin-bottom: 10px;
`;

const StoryImageWrapper = styled.div`
  width: 100%;
  height: 300px; /* Fixed height for image */
  margin: 20px 0;
  overflow: hidden;
  position: relative;
`;

const StoryImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover; /* Ensures image fills container and maintains aspect ratio */
  object-position: center; /* Keeps the focal point in the center */
`;

const StoryText = styled.p`
  font-size: 1.2rem;
  margin-bottom: 10px;
  white-space: pre-wrap; /* Handles new lines and word breaks */
  overflow-wrap: break-word; /* Ensures long words break to the next line */
  max-height: 50%; /* Limit text block height */
  text-align: justify; /* Ensures text aligns properly */
`;

const DownloadButton = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 12px 30px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  width: 100%;
  max-width: 600px;
  margin-top: 20px;

  &:hover {
    background-color: #45a049;
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
