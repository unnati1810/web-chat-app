import React from "react";
import {
  Avatar,
  Flex,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";


export default function ChatCard({ chat, select, id }) {
  const { colorMode } = useColorMode();
  const selected = useColorModeValue("#dee4e7", "#373838");
  const bg = useColorModeValue("#f9fafa", "#272727");
  const hover = useColorModeValue("#dee4e7", "#424242");
  const color = useColorModeValue("#000", "#fff");
  const userInfo = localStorage.getItem("userInfo");
  const userData = JSON.parse(userInfo);

  // Find the other user in the chat who is not the logged-in user
  const otherUser = chat.userNames.find(user => user.userId !== userData.userObject.userId);

  return (
    <Flex
      px={"2"}
      py={"2"}
      height="fit-content"
      flexDirection={"column"}
      alignItems={"flex-start"}
      gap={"2"}
      bgColor={select === id ? selected : bg}
      cursor="pointer"
      _hover={{ bgColor: hover }}
      borderRadius="md"
      boxShadow="sm"
    >
      <Flex flexDirection="row" alignItems="center" gap={"2"} mt="2">
        {chat.userNames
            .filter(user => user.userId !== userData.userObject.userId) // Filter out the current user
            .map((user) => (
                <Flex key={user.userId} flexDirection="row" alignItems="center" gap={"2"}>
                  <Avatar
                      size="sm"
                      name={user.userName}
                      src={user.profilePicture}
                  />
                  <Text fontWeight={"bold"} fontSize={"md"} color={color}>
                    {user.userName}
                  </Text>
                </Flex>
            ))
        }
      </Flex>
      <Text fontSize={"sm"} color={color}>
        Created At: {new Date(chat.createdAt).toLocaleString()}
      </Text>
    </Flex>
  );
}
