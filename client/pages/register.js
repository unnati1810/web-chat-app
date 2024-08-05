import { useState, useEffect } from "react";
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
  InputRightElement,
  Icon,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaRegUser } from "react-icons/fa";
import { EmailIcon, ViewIcon, ViewOffIcon, LockIcon } from "@chakra-ui/icons";
import { NextSeo } from "next-seo";
import Axios from "axios";
import ColorChange from "../layout/ColorChange";
import { Link, useNavigate  } from 'react-router-dom';

const Register = () => {
  const color = useColorModeValue("#000", "#fff");
  const bg = useColorModeValue("gray.200", "#2e2b2b");
  const profileColor = useColorModeValue("whiteAlpha.900", "#292626");
  const toast = useToast();
  const [pass, setPass] = useState("");
  const [cpass, setcPass] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleShowClick = () => setShowPassword(!showPassword);
  const handleShowCClick = () => setShowCPassword(!showCPassword);

  useEffect(() => {
    let data = JSON.parse(localStorage.getItem("userInfo"));
    if (data) {
          navigate('/chat');

    }
  }, []);

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePicture(reader.result.split(",")[1]);
    };
    reader.readAsDataURL(file);
  };

  const registerUser = async (e) => {
    e.preventDefault();
    if (pass !== cpass) {
      toast({
        title: "Passwords do not match",
        description: "Please ensure that both passwords are the same.",
        status: "error",
        isClosable: true,
      });
    } else {
      try {
        setLoading(true);
        const config = {
          headers: {
            "Content-type": "application/json",
          },
        };

        const { data } = await Axios.post(
          "https://hq7xe49h0d.execute-api.us-east-1.amazonaws.com/dev1/create-user",
          {
            userName: user,
            email,
            password: pass,
            profilePicture,
          },
          config
        );

        toast({
          title: "Account created successfully",
          description: "Please verify your account to log in.",
          status: "success",
          duration: 4000,
          isClosable: true,
          position: "bottom",
        });
        localStorage.setItem("userInfo", JSON.stringify(data));
        setLoading(false);
                  navigate('/otp');

      } catch (err) {
        setLoading(false);
        toast({
          title: "Error Occurred!",
          description: err.response?.data?.message || err.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  return (
    <ColorChange>
      <NextSeo
        description={"Register to create an account in Web Chat App"}
        title={"WebChatApp - Register"}
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
            <form onSubmit={registerUser}>
              <Stack
                spacing={4}
                px="1rem"
                py={"2rem"}
                boxShadow="md"
                bgColor={profileColor}
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
                      placeholder="Email address"
                      required
                    />
                  </InputGroup>
                </FormControl>
                <FormControl>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      children={<Icon as={FaRegUser} color="gray.500" />}
                    />
                    <Input
                      onChange={(e) => setUser(e.target.value)}
                      type="text"
                      placeholder="Username"
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
                </FormControl>
                <FormControl>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      color="gray.500"
                      children={<LockIcon color="gray.500" />}
                    />
                    <Input
                      onChange={(e) => setcPass(e.target.value)}
                      type={showCPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      required
                    />
                    <InputRightElement width="3.5rem">
                      <IconButton
                        h="1.75rem"
                        size="sm"
                        aria-label="ViewMode Changer"
                        icon={showCPassword ? <ViewOffIcon /> : <ViewIcon />}
                        onClick={handleShowCClick}
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                <FormControl>
                  <InputGroup>
                    <Input
                      type="file"
                      onChange={handleProfilePictureChange}
                      accept="image/*"
                    />
                  </InputGroup>
                </FormControl>
                <Button
                  borderRadius={0}
                  type="submit"
                  variant="solid"
                  colorScheme="teal"
                  width="full"
                  isLoading={loading}
                >
                  Register
                </Button>
              </Stack>
            </form>
          </Box>
        </Stack>
        <Box>
          Already have an account?{" "}
          <ChakraLink color="teal.500" as={Link} href="/">
            Sign In
          </ChakraLink>
        </Box>
      </Flex>
    </ColorChange>
  );
};

export default Register;
