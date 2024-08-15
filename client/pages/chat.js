import {Box, Flex, Icon, IconButton, Stack, useColorMode, useColorModeValue, useToast,} from "@chakra-ui/react";
import MessageBox from "../components/core/MessageBox";
import Navbar from "../components/core/Navbar";
import ChatCard from "../components/helpers/FriendCard";
import {bindActionCreators} from "redux";
import SlideDrawer from "../components/misc/SideDrawer";
import {actionCreators} from "../hooks";
import {MoonIcon, SunIcon} from "@chakra-ui/icons";
import {FiLogOut} from "react-icons/fi";
import {useEffect, useRef, useState} from "react";
import MessageCard from "../components/helpers/MessageCard";
import {useDispatch, useSelector} from "react-redux";
import OverlayChat from "../components/misc/OverlayChat";
import PorfileView from "../components/views/ProfileView";
import Axios from "axios";
import ScrollableFeed from "react-scrollable-feed";
import ChatLoader from "../components/animation/ChatLoader";
import {useNavigate} from 'react-router-dom';

const ENDPOINT2 = 'wss://m0s4s32aaf.execute-api.us-east-1.amazonaws.com/production/';

const ENDPOINT = `${process.env.NEXT_PUBLIC_BACKENDURL}`;
var socket, selectedChatCompare;
var selectedChat = {
    name: "",
    id: -1,
};

function Chat() {
    const toast = useToast();
    const {colorMode, toggleColorMode} = useColorMode();
    const colorIcon = useColorModeValue(<MoonIcon/>, <SunIcon/>);
    const bg = useColorModeValue("#fff", "#23272A");
    const dispatch = useDispatch();
    const {
        SETCHAT,
        SETUSER,
        SETFRIENDS,
        NOTIFYDELETEDCHAT,
        ADDUSERMESSAGE,
        EDITMESSAGE,
        ADDFRIEND,
        DELETEMESSAGE,
    } = bindActionCreators(actionCreators, dispatch);
    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate('/');
    };

    const chatData = useSelector((state) => state.chat);
    const [friendData, setFriendData] = useState([]);

    const userInfo = localStorage.getItem("userInfo");
    const userData = JSON.parse(userInfo);
    const messageData = useSelector((state) => state.messages);

    const [socketConnected, setSocketConnected] = useState(false);
    const [currFriend, setCurrFriend] = useState("");


    const fetchMessages = async (username = chatData.name, id = chatData.id) => {
        if (chatData.id == -1) return;
        try {
            const {data} = await Axios.get(
                `https://hq7xe49h0d.execute-api.us-east-1.amazonaws.com/dev1/getMessages?chatId=${id}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            ADDUSERMESSAGE(id, data);
            SETCHAT(username, id);
            setCurrFriend(getFriendId(id));
        } catch (err) {
            console.log(err);
            toast({
                title: "Failed to fetch messages!",
                description: err.response?.data?.msg || "An error occurred",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    };


    const [connectionStatus, setConnectionStatus] = useState('Disconnected');
    const ws = useRef(null);

    const handleConnect = async () => {
        if (ws.current) {
            await handleDisconnect();
        }
        if (!selectedChat.id || selectedChat.id == -1) {
            return;
        }

        ws.current = new WebSocket(`wss://m0s4s32aaf.execute-api.us-east-1.amazonaws.com/production/?chatId=${selectedChat.id}`);

        ws.current.onopen = () => {
            console.log('WebSocket connected');
            setConnectionStatus('Connected');
        };

        ws.current.onmessage = async (event) => {
            console.log('Message received:', event.data);
            await fetchMessages();
            // setMessages((prevMessages) => [...prevMessages, event.data]);
        };

        ws.current.onclose = () => {
            console.log('WebSocket disconnected');
            setConnectionStatus('Disconnected');
        };

        ws.current.onerror = (error) => {
            console.error('WebSocket error:', error);
            setConnectionStatus('Error');
        };
    };

    const handleDisconnect = () => {
        if (ws.current) {
            ws.current.close();
        }
    };

    const handleSendMessage = (message) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN && message) {
            ws.current.send(JSON.stringify({message: message, "chatId": selectedChat.id}));
        } else {
            console.error('WebSocket is not open. ReadyState:', ws.current.readyState);
        }

    };


    const getFriendId = (id) => {
        if (id == -1) return "";
        else {
            for (let i = 0; i < friendData.length; i++) {
                if (friendData[i]["chatId"] === id) return friendData[i]["id"];
            }
        }
        return "";
    };

    const fetchChatList = async (d) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
//        authorization: `Bearer ${d.token}`,
                },
            };
            const user = JSON.parse(localStorage.getItem("userInfo"));

            const {data} = await Axios.get(
                `https://hq7xe49h0d.execute-api.us-east-1.amazonaws.com/dev1/getChats?userId=${user.userObject.userId}`,
                {}, // Sending an empty body as per the given curl request
                config
            );
            setFriendData(data);

//    SETFRIENDS(data, d.username);
            // console.log(data);
        } catch (err) {
            console.log(err);
            toast({
                title: "Failed to fetch chats!",
                // description: err.response.data.msg,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            // console.log(err);
        }
    };


    useEffect(() => {
        let data = JSON.parse(localStorage.getItem("userInfo"));
        if (!data) {
            toast({
                title: "Session expired!",
                description: "Login again",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            sleep(2000);
            handleRedirect();
            return;
        }
            //else if (!data.verified) {
            //   toast({
            //     title: "Verify email",
            //     description: "Verify the email with otp!",
            //     status: "warning",
            //     duration: 5000,
            //     isClosable: true,
            //     position: "bottom",
            //   });
            //   sleep(3000);
            //   localStorage.clear();
            //   window.location.href = "./";
            //   return;
        // }
        else {
            SETUSER(data);
            fetchChatList(data);
        }
    }, []);


    useEffect(() => {
        if (selectedChat && selectedChat.id) {
            handleConnect(selectedChat.id);
            fetchMessages(selectedChat.name, selectedChat.id);
            selectedChatCompare = selectedChat;
        }

        return () => {
            handleDisconnect(); // Clean up previous connection when chat changes
        };
    }, [selectedChat]);


    const handleNewMessage = (message) => {
        // This function will be called when a new message is sent
        console.log("New message sent:", message);
        handleSendMessage(message);
    };


    async function sleep(milliseconds) {
        return await new Promise((resolve) => setTimeout(resolve, milliseconds));
    }

    const logOut = async () => {
        // localStorage.clear();
        localStorage.removeItem("userInfo");
        toast({
            title: "Logging out ...",
            description: "Logged out successfully!",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
        });
        await sleep(2500);
        handleRedirect();
    };

    return (
        <Flex m={"0"} p="0" flexDirection={"row"}>
            {/* <HeaderMeta
        content={"You can chat here with your friends and create friends"}
        title={"Chat for Web Chat App"}
      /> */}
            <Box maxW="fit-content" p="0" m="0">
                <Flex
                    direction="column"
                    w="300px"
                    h="100vh"
                    overflowY="scroll"
                    css={{
                        "&::-webkit-scrollbar": {
                            display: "none",
                        },
                        msOverflowStyle: "none",
                        scrollbarWidth: "none",
                    }}
                >
                    <Flex
                        align="center"
                        justify="space-between"
                        position="sticky"
                        top={0}
                        zIndex={199}
                        p={4}
                        h={"81px"}
                        borderBottom="1px solid"
                        bgColor={colorMode == "light" ? "#fff" : "#171c1f"}
                        borderRight={`1px solid ${
                            colorMode == "light" ? "#c3cfd7" : "#2D3748"
                        } `}
                    >
                        <PorfileView username={userData.userObject.userName} gmail={userData.userObject.email}
                                     profilePicture={userData.userObject.profilePicture}/>
                        <Stack isInline>
                            <IconButton
                                size="sm"
                                isRound
                                onClick={toggleColorMode}
                                _focus={{boxShadow: "none"}}
                                icon={colorIcon}
                            />
                            <IconButton
                                icon={<Icon as={FiLogOut}/>}
                                _focus={{boxShadow: "none"}}
                                size="sm"
                                onClick={logOut}
                                isRound
                            />
                        </Stack>
                    </Flex>
                    <Flex
                        direction="column"
                        borderRight="1px solid"
                        borderColor={"gray.700"}
                        bg={colorMode == "light" ? "#eff5f5" : "#1b1e20"}
                        flex="1"
                    >
                        <Flex direction="column" p={4}>
                            <SlideDrawer socket={socket}/>
                        </Flex>
                        <Flex flexDir={"column"} flexGrow="1" gap="2px">
                            {friendData.map((v, i) => {
                                return (
                                    <Box
                                        key={i}
                                        onClick={() => {
                                            fetchMessages(v.username, v.chatId);
                                            SETCHAT(v.username, v.chatId);
                                            selectedChat = {
                                                name: v.username,
                                                id: v.chatId,
                                            };
                                        }}
                                    >
                                        {/*<FriendCard*/}
                                        {/*  name={v.chatName}*/}
                                        {/*  id={v.chatId}*/}
                                        {/*  select={chatData.id}*/}
                                        {/*/>*/}
                                        <ChatCard
                                            key={v.chatId}
                                            chat={v}
                                            id={v.chatId}
                                            select={chatData.id}
                                            // onClick={() => handleChatClick(v.chatId)}
                                        />
                                    </Box>
                                );
                            })}
                        </Flex>
                    </Flex>
                </Flex>
            </Box>
            <Flex
                p="0"
                m="0"
                flexDir={"column"}
                bgColor={colorMode == "light" ? "#fff" : "#23272A"}
                height="100vh"
                flexGrow={"1"}
            >
                {chatData.id == -1 ? (
                    <OverlayChat/>
                ) : (
                    <Box>
                        <Navbar
                            socket={socket}
                            name={chatData.name}
                            friend={currFriend}
                            id={chatData.id}
                        />
                        <Box
                            bgColor={bg}
                            overflowY="scroll"
                            height={"80vh"}
                            mb={"4"}
                            py={"2"}
                            css={{
                                "&::-webkit-scrollbar": {
                                    display: "none",
                                },

                                msOverflowStyle: "none",
                                scrollbarWidth: "none",
                            }}
                        >
                            <ScrollableFeed forceScroll={"false"}>
                                <Flex flexDirection={"column"} px={"2"} pt={"4"} pb={"1"}>
                                    {messageData[chatData.id] === undefined ? (
                                        <ChatLoader number={15}/>
                                    ) : (
                                        messageData[chatData.id].map((v, i) => {
                                            return (
                                                <Box key={i}>
                                                    <MessageCard
                                                        socket={ws.current}
                                                        num={i}
                                                        isDeleted={false} // Assuming you don't have `isDeleted` in your current data
                                                        message={v.messageText}
                                                        name={v.userId === userData.userObject.userId ? "You" : "Other User"} // Adjust this as needed
                                                        id={v.messageId}
                                                        updated={v.sentAt}
                                                        time={v.sentAt}
                                                        isUser={v.userId === userData.userObject.userId}
                                                        profilePicture={v.profilePicture}
                                                    />
                                                </Box>
                                            );
                                        })
                                    )}
                                </Flex>
                            </ScrollableFeed>
                        </Box>
                        <MessageBox socket={ws.current} onSendMessage={handleNewMessage}/>
                    </Box>
                )}
            </Flex>
        </Flex>
    );
}

export default Chat;
