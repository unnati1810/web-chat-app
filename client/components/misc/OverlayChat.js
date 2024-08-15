import { Flex, useColorModeValue } from "@chakra-ui/react";

function OverlayChat() {
  const bgOverlayImage = useColorModeValue("/overlay.webp");
  const bgColor = "#EEEEED"; // Define the background color

  return (
    <Flex
      height="100vh" // Set the height to 100% of the viewport height
      m="0"
      p="0"
      bgColor={bgColor} // Set the background color
      bgImage={`url(${bgOverlayImage})`} // Add URL function for dynamic image path
      bgRepeat="no-repeat"
      bgPosition="center" // Center the background image
      opacity="1"
      filter="saturate(60%)" // Apply saturation filter
    >
    </Flex>
  );
}

export default OverlayChat;
