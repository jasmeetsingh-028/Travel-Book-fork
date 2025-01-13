import React, { useRef } from "react";
import html2canvas from "html2canvas";
import backgroundImage from "../../../src/assets/images/bg-share.png"; // Correct path based on your project structure

const StoryComponent = ({ story }) => {
  const storyRef = useRef(null);

  const handleDownload = async () => {
    try {
      if (storyRef.current) {
        const originalCanvas = await html2canvas(storyRef.current, {
          allowTaint: true,
          useCORS: true,
          width: 1080,
          height: 1920,
          scale: 2,
        });

        // Create a new canvas with additional height for the text
        const extraHeight = 100; // Adjust the height for the text
        const newCanvas = document.createElement("canvas");
        newCanvas.width = originalCanvas.width;
        newCanvas.height = originalCanvas.height + extraHeight;

        const ctx = newCanvas.getContext("2d");

        // Draw the original image onto the new canvas
        ctx.drawImage(originalCanvas, 0, 0);

        // Set the text style
        ctx.font = "bold 24px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";

        // Add the text at the bottom of the new canvas
        const text = "Create your own story via https://travelbook.sahilportfolio.me/";
        const textX = newCanvas.width / 2;
        const textY = originalCanvas.height + (extraHeight / 2) + 10; // Center the text in the extra height

        ctx.fillText(text, textX, textY);

        // Create the download link
        const link = document.createElement("a");
        link.href = newCanvas.toDataURL("image/png");
        link.download = `${story.title}.png`;
        link.click();
      }
    } catch (error) {
      console.error("Error generating canvas:", error);
    }
  };

  return (
    <div>
      <div
        ref={storyRef}
        style={{
          width: "1080px",
          height: "1920px",
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          padding: "20px",
          boxSizing: "border-box",
        }}
      >
        <img
          src={story.imageUrl}
          alt={story.title}
          style={{
            width: "100%",
            height: "auto",
            maxHeight: "70%",
            objectFit: "contain",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "50%",
            width: "100%",
            textAlign: "center",
            color: "black",
            fontSize: "32px",
            fontWeight: "bold",
          }}
        >
          {story.description}
        </div>
      </div>
      <button onClick={handleDownload}>Download Story</button>
    </div>
  );
};

export default StoryComponent;
