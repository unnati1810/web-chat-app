import React, { useState, useRef, useEffect } from "react";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoader from "../animation/ChatLoader";
import {
  Container,
  Input,
  Box,
  Spinner,
  Button,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  DrawerHeader,
  Tooltip,
  useToast,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import UserCard from "../helpers/UserCard";
import Axios from "axios";
import { useSelector } from "react-redux";

function SideDrawer(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const color = useColorModeValue("blackAlpha", "#fff");
  const bg = useColorModeValue("#f7fff3", "#282727");

  const [search, setSearch] = useState("");
  const [result, setResult] = useState([]);
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const ref = useRef(null);

  const friendsData = useSelector((state) => state.friends);

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("userInfo")));
  }, []);

  const fetchUsers = async () => {
    if (search.trim() === "") {
      toast({
        title: "Please type username to search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      ref.current.focus();
      return;
    }

    try {
      setLoading(true);

      // Construct the API endpoint URL with the email query parameter
      const apiUrl = `https://hq7xe49h0d.execute-api.us-east-1.amazonaws.com/dev1/getusers?email=${search}`;

      // Send the GET request to the updated API endpoint
      const response = await Axios.get(apiUrl);
      const data = response.data;

      console.log("API Response:", data); // Log the API response for debugging

      // Check if the response is a user object
      if (typeof data !== 'object' || data === null || Array.isArray(data)) {
        throw new Error("Expected a user object but received something else.");
      }

      // Check if the user is already in the friends list
      const isFriend = friendsData.some((friend) => friend.username === data.userName);

      // Only set the result if the user is not already a friend
      if (!isFriend) {
        setResult([data]);
      } else {
        setResult([]);
      }

      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error("Error fetching user data:", err);
      toast({
        title: "Error Occurred!",
        description: "Failed to fetch users",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <>
      <Tooltip
        hasArrow
        label="Add new user"
        aria-label="A tooltip"
        placement="right-end"
      >
        <Button
          onClick={onOpen}
          bg={bg}
          _focus={{ boxShadow: "none" }}
          letterSpacing="wide"
          textTransform="uppercase"
          fontSize="md"
          leftIcon={<AddIcon color={color} />}
        >
          New Chat
        </Button>
      </Tooltip>

      <Drawer placement={"start"} size={"sm"} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent height={"100vh"}>
          <DrawerHeader borderBottomWidth="1px">Add User</DrawerHeader>
          <DrawerBody>
            <Box
              d="flex"
              justifyContent={"center"}
              alignItems={"center"}
              flexDirection={"row"}
              pb={2}
              zIndex={"1"}
            >
              <Input
                placeholder="Search by name or email"
                ref={ref}
                w={"75%"}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button ml={"2"} colorScheme={"green"} onClick={fetchUsers}>
                Search
              </Button>
            </Box>
            <Stack mt={"4"}>
              {loading ? (
                <ChatLoader />
              ) : (
                result.map((v, i) => (
                  <Box key={i}>
                    <UserCard
                      socket={props.socket}
                      userId={v.userId}
                    //  userId={v.userId}
                      gmail={v.email} // Adjusted to match the API response field
                      username={v.userName} // Adjusted to match the API response field
                    />
                  </Box>
                ))
              )}
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer;
