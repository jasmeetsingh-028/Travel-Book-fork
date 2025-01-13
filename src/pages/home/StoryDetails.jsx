import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";

function StoryDetails() {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  const handleDownloadClick = () => {
    navigate(`/download-story/${id}`);
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
      <StoryBox>
        <TitleText>{story.title}</TitleText>
        <StoryDate>{new Date(story.date).toLocaleDateString()}</StoryDate>
        <StoryImage src={story.imageUrl} alt={`Image for ${story.title}`} />
        <StoryText>{story.story}</StoryText>
        <VisitedText>
          <strong>Visited Locations:</strong> {story.visitedLocation.join(", ")}
        </VisitedText>
      </StoryBox>
      <DownloadButton onClick={handleDownloadClick}>Download as Instagram Story</DownloadButton>
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
  padding: 15px;
  text-align: center;
  width: 100%;
  max-width: 500px;  /* Reduced width */
  position: relative;
  margin-bottom: 20px;
`;

const TitleText = styled.h1`
  font-size: 1.5rem; /* Reduced font size */
  margin-bottom: 10px;
`;

const StoryDate = styled.p`
  font-size: 1rem;
  color: #555;
  margin-bottom: 20px;
`;

const StoryImage = styled.img`
  width: 100%;
  height: auto;
  margin: 20px 0;
`;

const StoryText = styled.p`
  font-size: 1rem;  /* Reduced font size */
  margin-bottom: 10px;
`;

const VisitedText = styled.p`
  font-size: 0.9rem;  /* Reduced font size */
  margin-top: 10px;
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
  max-width: 500px;  /* Same width as the box */
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
