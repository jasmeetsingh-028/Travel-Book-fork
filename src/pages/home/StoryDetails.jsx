import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';  // Import styled-components

function StoryDetails() {
  const { id } = useParams();  // Get the ID from the URL
  const [story, setStory] = useState(null);

  useEffect(() => {
    fetch(`https://travel-book-backend.onrender.com/api/story/${id}`)
    // https://travel-book-backend.onrender.com
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => setStory(data))
      .catch((error) => {
        console.error('Error fetching story details:', error);
        alert('Error fetching story details.');
      });
  }, [id]);

  if (!story) {
    return <Loading>Loading...</Loading>;
  }

  return (
    <StoryContainer>
      <StoryBox>
        <StoryTitle>{story.title}</StoryTitle>
        <StoryDate>{new Date(story.createdOn).toLocaleDateString()}</StoryDate>
        <StoryImage src={story.imageUrl} alt={story.title} />
        <StoryContent>{story.story}</StoryContent>
        <VisitedLocations>
          <strong>Visited Locations:</strong> {story.visitedLocation.join(", ")}
        </VisitedLocations>
      </StoryBox>
    </StoryContainer>
  );
}

export default StoryDetails;

// Styled-components for styling inside the file


const StoryContainer = styled.div`
  display: flex;
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
  padding: 12px;  /* Reduced padding to make box more compact */
  max-width: 700px;
  width: 100%;
  margin: 20px;
  height: auto;  /* Auto adjusts the height to fit content */
`;

const StoryTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;  /* Reduced bottom margin */
`;

const StoryDate = styled.p`
  font-size: 1rem;
  color: #888;
  margin-bottom: 12px;  /* Reduced bottom margin */
`;

const StoryImage = styled.img`
  width: 100%;
  border-radius: 8px;
  margin-bottom: 15px;  /* Reduced margin below image */
`;

const StoryContent = styled.p`
  font-size: 1.1rem;
  color: #444;
  line-height: 1.5;  /* Reduced line-height for compact text */
  margin-bottom: 15px;  /* Reduced bottom margin */
`;

const VisitedLocations = styled.p`
  font-size: 1.1rem;
  color: #333;
  margin-top: 12px;  /* Reduced margin-top */
`;

const Loading = styled.div`
  font-size: 1.5rem;
  color: #555;
  text-align: center;
  margin-top: 20px;
`;