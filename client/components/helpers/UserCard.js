import React from "react";
import { bindActionCreators } from "redux";
import {
  Container,
  Avatar,
  Flex,
  Text,
  useToast,
  useColorMode,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { actionCreators } from "../../hooks";
import Axios from "axios";
import { useNavigate } from 'react-router-dom';



function UserCard({ gmail, username, userId,profilePicture, socket }) {
  console.log("Unnati",userId);
  const toast = useToast();
  const dispatch = useDispatch();
  const { colorMode, toggleColorMode } = useColorMode();
  const { ADDFRIEND } = bindActionCreators(actionCreators, dispatch);
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/chat');
  };
  // const getFriendId = async (data, user) => {
   
  //   for (let i = 0; i < data.users.length; i++) {
  //     if (data.users[i]["_id"] !== user._id) return data.users[i]["_id"];
  //   }
    
  //   return "";
  // };


  const addFriend = async () => {

    const user = JSON.parse(localStorage.getItem("userInfo"));
    try {
      // const config = {
      //   headers: {
      //     authorization: `Bearer ${user.token}`,
      //   },
      // };


      const { data } = await Axios.post(
        "https://hq7xe49h0d.execute-api.us-east-1.amazonaws.com/dev1/create-chat",
        // { userId1: user.userObject.userId , userId2: userId, chatName:username },

          {
            userId1: user.userObject.userId,
            userName1: user.userObject.userName,
            profilePicture1: user.userObject.profilePicture,
            userId2: userId,
            userName2: username,
            profilePicture2: profilePicture,
            chatName: `Chat between ${user.userObject.userName} and ${username}`
          }

        //config
      );
      async function sleep(milliseconds) {
        return await new Promise((resolve) =>
          setTimeout(resolve, milliseconds)
        );
      }
      // let friendId = await getFriendId(data, user);
      // let tempData = {
      //   id: user["_id"],
      //   chatId: data["_id"],
      //   gmail: user["gmail"],
      //   username: user["username"],
      //   image: user["image"],
      //   passId: friendId,
      // };
      // socket.emit("add chat", tempData);

      toast({
        title: "User added!",
        description: `Created chat for ${username}`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      await sleep(500);
      //ADDFRIEND(user_Data);
      handleRedirect();
    } catch (err) {
      toast({
        title: "Error occured!",
        description: `Failed to create chat for ${username}`,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      console.log(err);
    }
  };
  return (

    <Container
      key={gmail}
      display={"flex"}
      p={"3"}
      alignItems={"center"}
      gap={"3.5"}
      cursor={"pointer"}
      flexDirection="row"
      onClick={addFriend}
      _hover={{ bgColor: `${colorMode == "dark" ? "#8e9090" : "whitesmoke"}` }}
    >
      <Avatar
        size="md"
        name="dani"
        src={profilePicture}
      />

      <Flex flexDirection={"column"} gap={"2"}>
        <Text fontSize={"xl"} fontStyle={"oblique"} fontWeight={"bold"}>
          {username}
        </Text>

        <Text fontSize={"12"} fontWeight={"semibold"} fontStyle={"italic"}>
          {gmail}
        </Text>
      </Flex>
    </Container>
  );
}

export default UserCard;




//{"message":"User logged in successfully.","userObject":{"snsTopicArn":"arn:aws:sns:us-east-1:373971603424:user-04a854e8-70f1-7092-d7b5-8fd40100632a-notifications","password":"Unn@ti1810","profilePicture":"https://profile-picture-bucket-term-project.s3.amazonaws.com/profile-pictures/04a854e8-70f1-7092-d7b5-8fd40100632a.png","userId":"04a854e8-70f1-7092-d7b5-8fd40100632a","updatedAt":"2024-07-25T05:15:26.912Z","userName":"Unnati","createdAt":"2024-07-25T05:15:26.912Z","email":"unnatikapadia97@gmail.com"}}