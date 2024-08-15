import { useState } from "react";
import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  IconButton,
  Box,
  Link as ChakraLink,
  Avatar,
  FormControl,
  FormHelperText,
  InputRightElement,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import HeaderMeta from "../components/meta/HeaderMeta";
import ColorChange from "../layout/ColorChange";
import { useEffect } from "react";
import { EmailIcon, ViewIcon, ViewOffIcon, LockIcon } from "@chakra-ui/icons";
import Axios from "axios";
import { NextSeo } from "next-seo";
import { Link , useNavigate } from 'react-router-dom';


const Home = () => {
  const color = useColorModeValue("#000", "#fff");
  const bg = useColorModeValue("gray.200", "#2e2b2b");
  const profileColor = useColorModeValue("whiteAlpha.900", "#292626");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const toast = useToast();
  const handleShowClick = () => setShowPassword(!showPassword);
  const navigate = useNavigate();

  useEffect(() => {
    let data = JSON.parse(localStorage.getItem("userInfo"));
    if (data) {
    navigate('/chat');
    }
  }, []);


  const handleNavigate = () => {
    navigate('/register'); // Use the desired route
  };

  const handleNavigateForgot = () => {
    navigate('/reset-password'); // Use the desired route
  };

  const loginUser = async (e) => {
    async function sleep(milliseconds) {
      return await new Promise((resolve) => setTimeout(resolve, milliseconds));
    }
    setLoading(true);
    e.preventDefault();
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    try {
      const { data } = await Axios.post(
        "https://hq7xe49h0d.execute-api.us-east-1.amazonaws.com/dev1/login",
        {
          email: email,
          password: pass,
        },
        config
      );
      localStorage.setItem("userInfo", JSON.stringify(data));
      
      toast({
        title: "Logged in Successfully!",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      // console.log(data);
      await sleep(3000);
      setLoading(false);
    navigate('/chat');
    } catch (err) {
      toast({
        title: "Error Occured!",
        description: err.response.data.msg,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      // console.log(err);
      setLoading(false);
    }
  };

  return (
    <ColorChange>
      <NextSeo
        title="WebChatApp - Login"
        description="Login in to the web chat app to start messaging to others"
      />
      <Flex
        color={color}
        bgColor={bg}
        width={"full"}
        flexDirection="column"
        height="100vh"
        justifyContent="center"
        alignItems="center"
      >
        {/* <HeaderMeta
        content={"Login in to the web chat app to start messaging to others"}
        title={"Login for the Web Chat App"}
      /> */}
        <Stack
          flexDir="column"
          mb="2"
          justifyContent="center"
          alignItems="center"
          pt={"10"}
          bgColor={profileColor}
        >
          <Avatar bg="teal.500" />
          <Heading color="teal.400">Welcome</Heading>
          <Box minW={{ base: "90%", md: "468px" }}>
            <form onSubmit={loginUser}>
              <Stack
                spacing={4}
                px="1rem"
                py={"2rem"}
                bgColor={profileColor}
                boxShadow="md"
              >
                <FormControl>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      children={<EmailIcon color="gray.500" />}
                    />
                    <Input
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      placeholder="email address"
                      required
                    />
                  </InputGroup>
                </FormControl>
                <FormControl>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      color="gray.500"
                      children={<LockIcon color="gray.500" />}
                    />
                    <Input
                      onChange={(e) => setPass(e.target.value)}
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      required
                    />
                    <InputRightElement width="3.5rem">
                      <IconButton
                        h="1.75rem"
                        size="sm"
                        aria-label="ViewMode Changer"
                        icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                        onClick={handleShowClick}
                      />
                    </InputRightElement>
                  </InputGroup>
                  <FormHelperText textAlign="right">
                    <ChakraLink color={"red.400"} onClick={handleNavigateForgot}>forgot password?</ChakraLink>
                  </FormHelperText>
                </FormControl>
                <Button
                  borderRadius={0}
                  type="submit"
                  variant="solid"
                  colorScheme="teal"
                  width="full"
                  isLoading={loading}
                >
                  Login
                </Button>
              </Stack>
            </form>
          </Box>
        </Stack>
        <Box>
          Register here?{" "}
          <ChakraLink color="teal.500" onClick={handleNavigate}>
            Sign Up
          </ChakraLink>
        </Box>
      </Flex>
    </ColorChange>
  );
};

export default Home;
