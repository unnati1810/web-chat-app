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
  Grid,
  Image
} from "@chakra-ui/react";
import { FaRegUser } from "react-icons/fa";
import { EmailIcon, ViewIcon, ViewOffIcon, LockIcon } from "@chakra-ui/icons";
import { NextSeo } from "next-seo";
import Axios from "axios";
import ColorChange from "../layout/ColorChange";
import { Link, useNavigate } from 'react-router-dom';

const femaleAvatarUrls = [
  26, 44, 6, 1, 14, 13, 33, 36, 17, 30, 28, 40, 10, 27, 49, 7, 38,
  12, 31, 42, 9, 46, 34, 45, 29, 48, 43, 47, 24, 4, 18, 41, 25, 19,
  3, 23, 21, 5, 11, 35, 16, 20, 50, 15, 39, 8, 22, 2, 32, 37, 83, 87, 62, 97, 64, 85, 51, 68, 95, 81, 69, 72, 55, 74, 56, 58,
  96, 82, 53, 84, 91, 93, 76, 59, 88, 52, 94, 71, 75, 78, 90, 70,
  65, 61, 86, 60, 77, 63, 89, 67, 92, 57, 79, 98, 66, 54, 100, 73,
  80, 99
].map(id => `https://avatar.iran.liara.run/public/${id}`);

const getRandomAvatars = (count = 10) => {
  const shuffled = [...femaleAvatarUrls].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const Register = () => {
  const color = useColorModeValue("#000", "#fff");
  const bg = useColorModeValue("gray.200", "#2e2b2b");
  const profileColor = useColorModeValue("whiteAlpha.900", "#292626");
  const toast = useToast();
  const [pass, setPass] = useState("");
  const [cpass, setcPass] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState("");
  const [profilePicture, setProfilePicture] = useState(""); // URL of the selected profile picture
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAvatarGrid, setShowAvatarGrid] = useState(false); // State to toggle avatar grid visibility
  const navigate = useNavigate();

  const handleShowClick = () => setShowPassword(!showPassword);
  const handleShowCClick = () => setShowCPassword(!showCPassword);

  useEffect(() => {
    let data = JSON.parse(localStorage.getItem("userInfo"));
    if (data) {
      navigate('/chat');
    }
  }, [navigate]);

  const handleProfilePictureSelect = (url) => {
    setProfilePicture(url);
    setShowAvatarGrid(false); // Hide avatar grid after selection
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

  const avatarUrls = showAvatarGrid ? getRandomAvatars() : [];

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
                    <Heading size="sm" mb={2}>Select Profile Picture</Heading>
                    <Button
                        onClick={() => setShowAvatarGrid(!showAvatarGrid)}
                        variant="outline"
                        colorScheme="teal"
                    >
                      {showAvatarGrid ? "Hide Avatars" : "Choose Avatar"}
                    </Button>
                    {showAvatarGrid && (
                        <Grid templateColumns="repeat(auto-fill, minmax(120px, 1fr))" gap={4} mt={4}>
                          {avatarUrls.map((url, index) => (
                              <Box
                                  key={index}
                                  onClick={() => handleProfilePictureSelect(url)}
                                  cursor="pointer"
                              >
                                <Image
                                    src={url}
                                    alt={`Avatar ${index}`}
                                    borderRadius="full"
                                    boxSize="120px"
                                    objectFit="cover"
                                    borderWidth={profilePicture === url ? "2px" : "0"}
                                    borderColor="teal.500"
                                />
                              </Box>
                          ))}
                        </Grid>
                    )}
                  </FormControl>
                  <Button
                      isLoading={loading}
                      type="submit"
                      variant="solid"
                      colorScheme="teal"
                  >
                    Register
                  </Button>
                  <Flex>
                    <ChakraLink as={Link} to="/login" color="teal.400">
                      Already have an account? Login here
                    </ChakraLink>
                  </Flex>
                </Stack>
              </form>
            </Box>
          </Stack>
        </Flex>
      </ColorChange>
  );
};

export default Register;
