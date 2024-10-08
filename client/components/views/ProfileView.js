import React from "react";
import {
  useDisclosure,
  Modal,
  ModalHeader,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Avatar,
  Container,
  Text,
  Flex,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
export default function ProfileView({ username, gmail, profilePicture }) {
  const color = useColorModeValue("#3b3838", "#a49e9e");
  const headcolor = useColorModeValue("#3a3838", "#fff");
  const bgcolor = useColorModeValue("#fff", "#1b1e20");
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Tooltip placement="right-end" hasArrow label="Profile View">
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px'}}>
          <Avatar
              cursor={"pointer"}
              onClick={onOpen}
              src={profilePicture ? profilePicture : "https://avatar.iran.liara.run/public/100"}
          />
          <Text
              fontSize={"l"}
              fontStyle={"oblique"}
              fontWeight={"bold"}
              wordBreak={"break-all"}
          >
            {username}
          </Text>
        </div>


      </Tooltip>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay/>
        <ModalContent bgColor={bgcolor}>
          <ModalHeader
              color={headcolor}
              fontSize={"3xl"}
              textTransform={"uppercase"}
              fontWeight={"extrabold"}
          >
            Profile
          </ModalHeader>
          <ModalCloseButton/>
          <ModalBody>
            <Container
              display={"flex"}
              alignItems={"center"}
              gap={"5"}
              flexDirection="row"
            >
              <Avatar
                size="xl"
                name={username}
                src={profilePicture?  profilePicture:"https://avatar.iran.liara.run/public/100"}
              />
              <Flex flexDirection={"column"} color={color}>
                <Text
                  fontSize={"3xl"}
                  fontStyle={"oblique"}
                  fontWeight={"bold"}
                  wordBreak={"break-all"}
                >
                  {username}
                </Text>
                <Text
                  fontSize={"16"}
                  fontWeight={"semibold"}
                  fontStyle={"italic"}
                  wordBreak={"break-all"}
                >
                  {gmail}
                </Text>
              </Flex>
            </Container>

            {/* Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea odit
            excepturi at eveniet libero molestias, laudantium necessitatibus
            quasi sed vitae cumque unde aliquam sint quaerat, officia sunt rerum
            quis eum. */}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
