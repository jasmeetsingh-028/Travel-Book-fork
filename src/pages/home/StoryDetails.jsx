import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import html2canvas from "html2canvas";
import backgroundImage from "../../../src/assets/images/bg-share.png"; // Import background image

function StoryDetails() {
  const { id } = useParams(); // Get the ID from the URL
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const storyRef = useRef(); // Create a ref for the story box
  const visitedLocationRef = useRef(); // Create a ref for the visited location section

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
        // Temporarily hide the visited location section before generating the canvas
        if (visitedLocationRef.current) {
          visitedLocationRef.current.style.display = "none";
        }

        const isMobile = window.innerWidth <= 768; // Check if the device is mobile

        // Get the size of the element for proper scaling
        const elementWidth = storyRef.current.offsetWidth;
        const elementHeight = storyRef.current.offsetHeight;

        const canvas = await html2canvas(storyRef.current, {
          allowTaint: true, // Allow cross-origin images to be captured
          useCORS: true, // Use CORS for loading images
          width: elementWidth, // Match the width of the content container
          height: elementHeight, // Match the height of the content container
          scale: isMobile ? 1.5 : 2, // Adjust scale factor for mobile to prevent pixelation
          x: 0,
          y: 0,
          scrollX: 0,
          scrollY: 0,
        });

        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `${story.title}.png`;
        link.click();

        // Reset visibility of the visited location section after download
        if (visitedLocationRef.current) {
          visitedLocationRef.current.style.display = "block";
        }
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
        <VisitedLocations ref={visitedLocationRef}>
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
  width: 100%; /* Ensure width is fully responsive */
  max-width: 1080px; /* Set a max-width */
  height: auto;
  background-image: url(${(props) => props.bgImage || "default_bg.png"}); /* Use the imported background image */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  justify-content: center; /* Centering content vertically */
  align-items: center; /* Centering content horizontally */
  text-align: center; /* Center the text */
  padding: 0 20px;

  /* Responsive Content Styling for smaller devices */
  @media (max-width: 768px) {
    padding: 15px;
    width: 100%;
  }

  /* Remove white background overflow */
  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const StoryTitle = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: #000; /* Change text color to black */
  margin-bottom: 8px;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.4); /* Add shadow for better text readability */
  margin-top: 10px;
`;

const StoryDate = styled.p`
  font-size: 1rem;
  color: #000; /* Change text color to black */
  margin-bottom: 12px;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.4);
`;

const StoryImage = styled.img`
  width: 80%; /* Reduced the width of the image */
  max-width: 800px;
  height: auto;
  margin-bottom: 15px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Shadow for image */
  object-fit: contain; /* Ensure the image stays within bounds */
`;

const StoryContent = styled.p`
  font-size: 1.1rem;
  color: #000; /* Change text color to black */
  line-height: 1.5;
  margin-bottom: 15px;
  max-width: 90%; /* Prevent the text from overflowing */
  word-wrap: break-word;
`;

const VisitedLocations = styled.p`
  font-size: 1.1rem;
  color: #000; /* Change text color to black */
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
