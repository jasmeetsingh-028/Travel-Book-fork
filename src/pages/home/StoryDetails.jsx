import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import moment from "moment";
import html2canvas from "html2canvas";

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
    const storyElement = document.getElementById("story-box");

    if (storyElement) {
      html2canvas(storyElement, { width: 1080, height: 1920 }).then((canvas) => {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `story_${id}.png`;
        link.click();
      });
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

  const formattedDate = moment(story.date).format('MMM DD, YYYY');

  return (
    <StoryContainer>
      <StoryBox id="story-box">
        <TitleText>{story.title}</TitleText>
        <StoryDate>{formattedDate}</StoryDate>
        {story.imageUrl && <StoryImage src={story.imageUrl} alt={`Image for ${story.title}`} />}
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

const StoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  min-height: 100vh;
  background-color: #f0f0f0;
`;

const StoryBox = styled.div`
  background-color: #e6f7f7;
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  width: 1080px;
  height: 1920px;
  position: relative;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  color: #333;
`;

const TitleText = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  margin-top: 20px;
`;

const StoryDate = styled.p`
  font-size: 1.2rem;
  color: #555;
  margin-bottom: 10px;
`;

const StoryImage = styled.img`
  width: 90%;
  height: auto;
  border-radius: 16px;
  margin: 20px 0;
`;

const StoryText = styled.p`
  font-size: 1.4rem;
  margin: 20px;
  line-height: 1.6;
`;

const VisitedText = styled.p`
  font-size: 1.2rem;
  margin-top: 20px;
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
