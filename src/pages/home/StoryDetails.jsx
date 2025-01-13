import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import html2canvas from "html2canvas";
import backgroundImage from "../../../src/assets/images/InstaCanva.png";
import travelBookLogo from "../../../src/assets/images/logo.png"; // Assuming logo is provided

function StoryDetails() {
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
    if (storyRef.current) {
      html2canvas(storyRef.current).then((canvas) => {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `${story.title}.png`;
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

  return (
    <StoryContainer ref={storyRef}>
      <Logo src={travelBookLogo} alt="Travel Book Logo" />
      <Title>{story.title}</Title>
      <Date>{new Date(story.createdOn).toLocaleDateString()}</Date>
      <Image src={story.imageUrl} alt={`Image for ${story.title}`} />
      <Description>{`${story.story.substring(0, 150)}...`}</Description>
      <VisitedLocations>
        Visited Locations: {story.visitedLocation.join(", ")}
      </VisitedLocations>
      <Footer>CREATE YOUR OWN STORY VIA https://travelbook.sahilportfolio.me/</Footer>
      <DownloadButton onClick={handleDownload}>Download Story</DownloadButton>
    </StoryContainer>
  );
}

export default StoryDetails;

// Styled-components

const StoryContainer = styled.div`
  position: relative;
  width: 1080px;
  height: 1920px;
  background-image: url(${backgroundImage});
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 20px;
`;

const Logo = styled.img`
  position: absolute;
  top: 20px;
  left: 20px;
  width: 150px;
`;

const Title = styled.h1`
  font-family: "Oswald", sans-serif;
  font-size: 48px;
  font-weight: bold;
  color: #333;
  margin-top: 150px;
`;

const Date = styled.p`
  font-family: "Oswald", sans-serif;
  font-size: 24px;
  color: #555;
  margin-top: 10px;
`;

const Image = styled.img`
  width: 80%;
  height: auto;
  margin-top: 20px;
  border-radius: 12px;
`;

const Description = styled.p`
  font-family: "Oswald", sans-serif;
  font-size: 22px;
  color: #333;
  margin-top: 20px;
  text-align: center;
  max-width: 80%;
`;

const VisitedLocations = styled.p`
  font-family: "Oswald", sans-serif;
  font-size: 22px;
  color: #333;
  margin-top: 20px;
  text-align: center;
  max-width: 80%;
`;

const Footer = styled.p`
  font-family: "Oswald", sans-serif;
  font-size: 18px;
  color: #555;
  position: absolute;
  bottom: 50px;
  text-align: center;
  width: 100%;
`;

const DownloadButton = styled.button`
  position: absolute;
  bottom: 20px;
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 18px;
  cursor: pointer;
  text-transform: uppercase;

  &:hover {
    background-color: #0056b3;
  }
`;

const Loading = styled.div`
  font-family: "Oswald", sans-serif;
  font-size: 24px;
  color: #333;
`;

const ErrorMessage = styled.div`
  font-family: "Oswald", sans-serif;
  font-size: 24px;
  color: red;
`;
