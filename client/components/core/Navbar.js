import { AiOutlineSync } from "react-icons/ai";
import { FiHelpCircle } from "react-icons/fi";
import { bindActionCreators } from "redux";
import { useSelector, useDispatch } from "react-redux";
import { actionCreators } from "../../hooks";
import { Search2Icon, AtSignIcon } from "@chakra-ui/icons";
import { MdPersonRemoveAlt1 } from "react-icons/md";
import { ImStatsDots } from "react-icons/im";
import {
  Flex,
  IconButton,
  Text,
  Container,
  InputGroup,
  Input,
  InputRightElement,
  usePrefersReducedMotion,
  keyframes,
  Box,
  useToast,
  useDisclosure,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import Axios from "axios";
import StatisticsView from "../views/StatisticsView";
import { AiFillGithub } from "react-icons/ai";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

function Navbar(props) {
  const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(5400deg); }`;
  const color = useColorModeValue("#000", "#fff");
  const prefersReducedMotion = usePrefersReducedMotion();
  const toast = useToast();
  const animation = prefersReducedMotion
    ? undefined
    : `${spin} infinite 20s linear`;
  const dispatch = useDispatch();
  // const chatData = useSelector((state) => state.chat);
  const { REMOVEFRIEND, REMOVEUSERMESSAGE, SETCHAT } = bindActionCreators(
    actionCreators,
    dispatch
  );
  const navigate = useNavigate();


  const removeChat = async () => {
    const chatId = props.id; // The ID of the chat to delete
    try {
      const user = JSON.parse(localStorage.getItem("userInfo"));

      // Axios configuration
      const config =  { body: { chatId } }

      // Emit socket event to notify other clients (if needed)
      props.socket.emit("delete chat", { chatId });

      // Perform the DELETE request
      const { data } = await Axios.post(
          'https://hq7xe49h0d.execute-api.us-east-1.amazonaws.com/dev1/deleteChat', // Use the correct endpoint
          config
      );

      console.log(data);

      // Show success toast notification
      toast({
        title: "Chat deleted successfully!",
        description: `Removed chat with ID ${chatId}`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });

      // Perform additional state updates or actions
      navigate('/chat');
      REMOVEFRIEND(props.name);
      REMOVEUSERMESSAGE(chatId);
      SETCHAT("", -1);
      console.log(`Chat with ID ${chatId} removed successfully`);
    } catch (err) {
      // Show error toast notification
      toast({
        title: "Error occurred!",
        description: `Failed to delete chat with ID ${chatId}`,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      console.error(err);
    }
  };


  return (
    <Flex
      height={"8vh"}
      flexDirection="row"
      alignItems={"center"}
      gap={"4"}
      px={"10"}
      pt="5"
    >
      <AtSignIcon boxSize={"5"} color={color} />
      <Text
        color={color}
        fontSize="20"
        fontWeight={"semibold"}
        fontStyle="oblique"
        ml="-1.5"
      >
        {props.name}
      </Text>
      <Container color={"white"} />

      {/*<StatisticsView chatId={props.id} />*/}
      <IconButton
        variant="link"
        color={color}
        size={"lg"}
        onClick={removeChat}
        icon={<MdPersonRemoveAlt1 />}
      />
      <IconButton
        variant="link"
        color={color}
        size={"lg"}
        icon={<AiFillGithub />}
        onClick={() => {
          window.location.href =
            "https://github.com/daniel-jebarson/web-chat-app";
        }}
      />
      <IconButton
        variant="link"
        color={color}
        size={"lg"}
        icon={<AiOutlineSync />}
        _focus={{ animation: animation }}
        onClick={() => {
          window.location.href = window.location.href;
        }}
        // animation={animation}
      />
    </Flex>
  );
}

export default Navbar;
