import {
  Avatar,
  Flex,
  Text,
  Box,
  IconButton,
  Input,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { Fragment, useState, useEffect } from "react";
import { TbEdit } from "react-icons/tb";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import DeletedMessage from "./DeletedMessage";
import { actionCreators } from "../../hooks";
import Axios from "axios";
export default function (props) {
  const toast = useToast();
  const dispatch = useDispatch();
  const [text, setText] = useState(props.message);
  const [updated, setUpdated] = useState(props.updated);
  const color = useColorModeValue("#000", "#fff");
  const userbg = useColorModeValue("#cfc9c9", "#1c2c3c");
  const userhoverbg = useColorModeValue("#bbb9b9", "#2a3a49");
  const friendhoverbg = useColorModeValue("#8fa4b1", "#09090b");
  const friendbg = useColorModeValue("#a0b7c7", "#161512");
  // const deletedbg = useColorModeValue("#000", "#000");
  const { EDITMESSAGE, DELETEMESSAGE } = bindActionCreators(
    actionCreators,
    dispatch
  );
  useEffect(() => {
    setText(props.message);
    setUpdated(props.updated);
    setisDeleted(props.isDeleted);
  }, [props]);
  const userData = useSelector((state) => state.user);
  const chatData = useSelector((state) => state.chat);
  const [editing, setEditing] = useState(false);
  const [isDeleted, setisDeleted] = useState(props.isDeleted);



  const handleSendMessage = (message) => {
    try {
      console.error('WebSocket is open. ReadyState:', props.socket.readyState);

      if (props.socket && props.socket.readyState === WebSocket.OPEN && message) {
        props.socket.send(JSON.stringify({message: message, "chatId": chatData.id}));
      } else {
        console.error('WebSocket is not open. ReadyState:', props.socket.readyState);
      }
    }catch (e){}
  }

  const handleDelete = async () => {
  try {
    const config = {
      headers: {
        authorization: `Bearer ${userData.token}`,
      },
    };

    // Extract the messageId from props.id
    const { id: messageId } = props.id;

    // Make a POST request to the delete endpoint with messageId as a query parameter
    const { data } = await Axios.post(
      `https://hq7xe49h0d.execute-api.us-east-1.amazonaws.com/dev1/deleteMessage?messageId=${props.id}`,
      {},
      config
    );

    if (data.message === "Message deleted successfully") {
      setisDeleted(true);
      DELETEMESSAGE(chatData.id, props.num);

      // Prepare the message object to emit
      let temp = {
        messageId,
        num: props.num
      };

      handleSendMessage(temp);
      toast({
        title: "Message deleted!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } else {
      toast({
        title: "Failed to delete message!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  } catch (err) {
    console.log(err);
    toast({
      title: "Failed to delete message!",
      description: err.response?.data?.msg || "An error occurred",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
  }
};

    const handleEdit = async (e) => {
  setEditing(false);
  const newText = e.target.value;

  // Check if the text has changed
  if (newText === props.message) {
    return;
  }

  try {
    const config = {
      headers: {
        authorization: `Bearer ${userData.token}`,
      },
    };

    // Make a POST request to the edit endpoint
    const { data } = await Axios.post(
      'https://hq7xe49h0d.execute-api.us-east-1.amazonaws.com/dev1/editMessage',
      {
        messageId: props.id,
        newMessageText: newText,
      },
      config
    );

    // Update local state and notify via socket
    if (data.message === "Message updated successfully") {
      setUpdated(data.updatedAt);
      EDITMESSAGE({ ...props.message, content: newText }, chatData.id, props.num);

      let temp = {
        messageId: props.id,
        content: newText,
        num: props.num
      };
      handleSendMessage(temp);

      toast({
        title: "Message updated!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } else {
      toast({
        title: "Failed to update message!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  } catch (err) {
    console.log(err);
    toast({
      title: "Failed to edit message!",
      description: err.response?.data?.msg || "An error occurred",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
  }
};

  return (
    <Fragment>
      {isDeleted == true ? (
        <Fragment>
          <DeletedMessage props={props} />
        </Fragment>
      ) : (
        <Flex
          key={props.id}
          justifyContent={"space-between"}
          flexDirection={props.isUser ? "row" : "row-reverse"}
          px={"4"}
        >
          <Box width={"36%"}></Box>
          <Flex
            minW={"40%"}
            // w={"100%"}
            px={"2"}
            py={"2"}
            mt={"4"}
            ml={"2"}
            height="fit-content"
            flexDirection={props.isUser ? "row-reverse" : "row"}
            bgColor={props.isUser ? userbg : friendbg}
            cursor="pointer"
            borderRadius={"lg"}
            key={props.id}
            _hover={{ bgColor: props.isUser ? userhoverbg : friendhoverbg }}
            // mr={"30%"}
          >
            <Avatar
              mt={"3"}
              size="md"
              name={props.name}
              src={props.profilePicture?  props.profilePicture:"https://avatar.iran.liara.run/public/100"}
            />
            <Flex
              flexGrow="1"
              flexDirection={"column"}
              borderRadius={"lg"}
              justifyContent={"center"}
            >
              <Flex
                flexDirection={props.isUser ? "row-reverse" : "row"}
                h="7"
                pt={"2"}
                px={"4"}
                gap={"2.5"}
              >
                <Text
                  fontWeight={"bold"}
                  // updated
                  fontSize={"xl"}
                  position={"relative"}
                  top={"-2"}
                  color={color}
                >
                  {props.name.slice(0, 25) === props.name
                    ? props.name
                    : props.name.slice(0, 24) + "..."}
                </Text>
                {/*<Text*/}
                {/*  fontSize={"12"}*/}
                {/*  position={"relative"}*/}
                {/*  top={"0"}*/}
                {/*  color={color}*/}
                {/*>*/}
                {/*  {new Date(props.time).toLocaleString()}*/}
                {/*  /!* {props.time} *!/*/}
                {/*</Text>*/}
              </Flex>
              <Flex>
                {editing ? (
                  <Input
                    defaultValue={props.message}
                    // textAlign={props.isUser ? "right" : "left"}
                    wordBreak={"break-word"}
                    px={"4"}
                    onChange={(e) => setText(e.target.value)}
                    py={"2.5"}
                    color={color}
                    onKeyPress={(e) => {
                      if (e.key == "Enter") {
                        handleEdit(e); // props.message = "dani";
                      }
                    }}
                  />
                ) : (
                  <Text
                    textAlign={props.isUser ? "right" : "left"}
                    wordBreak={"break-word"}
                    px={"4"}
                    py={"1.5"}
                    color={color}
                  >
                    {text}
                  </Text>
                )}
              </Flex>
              <Flex
                minHeight="2"
                px={"3.5"}
                borderRadius={"lg"}
                flexDirection={props.isUser ? "row" : "row-reverse"}
              >
                <Text
                  color={color}
                  fontSize="11"
                  position={"relative"}
                  right="1"
                >
                  {/* {props.time} updated */}
                  {new Date(props.time).toLocaleString()}
                </Text>
                {props.isUser && !editing ? (
                  <Box>
                    <IconButton
                      variant="link"
                      color={color}
                      size={"lg"}
                      onClick={() => setEditing(true)}
                      icon={<TbEdit />}
                    />
                    <IconButton
                      variant="link"
                      onClick={() => handleDelete()}
                      color={color}
                      size={"lg"}
                      icon={<MdDelete />}
                    />
                  </Box>
                ) : (
                  ""
                )}
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      )}
    </Fragment>
  );
}
