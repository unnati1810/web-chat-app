import {
  Flex,
  Heading,
  Input,
  Button,
  Stack,
  InputGroup,
  InputLeftElement,
  Box,
  Link as ChakraLink,
  Avatar,
  FormControl,
  FormHelperText,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { EmailIcon, LockIcon } from "@chakra-ui/icons";
import ColorChange from "../layout/ColorChange";
import { NextSeo } from "next-seo";
import Axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate  } from 'react-router-dom';

const OTP = () => {
  const [userData, setUserData] = useState({});
  const [verificationCode, setVerificationCode] = useState("");
  const [email, setEmail] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const color = useColorModeValue("#000", "#fff");
  const bg = useColorModeValue("gray.200", "#2e2b2b");
  const profileColor = useColorModeValue("whiteAlpha.900", "#292626");
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    let data = JSON.parse(localStorage.getItem("userInfo"));
    if (data == null || Object.keys(data).length === 0) {
    navigate('/');
    } else {
      setUserData(data);
      setEmail(data.userObject.email); // Set email from localStorage
    }
  }, []);

  const sendOtp = async (e) => {
    e.preventDefault();
    setResendDisabled(true); // Disable the resend button after clicking
    try {
      const { data } = await Axios.post(
        "https://hq7xe49h0d.execute-api.us-east-1.amazonaws.com/dev1/emailverify",
        { action: 'sendVerificationCode', email: email }
      );
      console.log('sendOtp response:', data);  // Add logging here
      toast({
        title: "OTP sent successfully!",
        description: "Check your email for the verification code.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (err) {
      console.error('sendOtp error:', err);  // Add logging here
      toast({
        title: "Failed to send OTP!",
        description: err.response?.data?.message || "An error occurred.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } finally {
      setResendDisabled(false); // Re-enable the resend button after processing
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    try {
      const { data } = await Axios.post(
        "https://hq7xe49h0d.execute-api.us-east-1.amazonaws.com/dev1/emailverify",
        { action: 'verifyVerificationCode', email: email, verificationCode: verificationCode }
      );
      console.log('verifyOtp response:', data);  // Add logging here
      if (data.body.message === 'Email verification successful') {
        toast({
          title: "Verification successful!",
          description: "Your email has been verified.",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
            navigate('/');

      } else {
        throw new Error(data.body.message || "Verification failed.");
      }
    } catch (err) {
      console.error('verifyOtp error:', err);  // Add logging here
      toast({
        title: "Verification failed!",
        description: err.response?.data?.body?.message || err.message || "An error occurred.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <ColorChange>
      <NextSeo
        description={"OTP to activate the account in Web Chat App"}
        title={"WebChatApp - OTP"}
      />
      <Flex
        flexDirection="column"
        height="100vh"
        justifyContent="center"
        alignItems="center"
        color={color}
        bgColor={bg}
        width={"full"}
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
          <Heading color="teal.400">Verify Your Email</Heading>
          <Box minW={{ base: "90%", md: "468px" }}>
            <form onSubmit={verifyOtp}>
              <Stack
                spacing={4}
                px="1rem"
                py={"2rem"}
                bgColor={profileColor}
                boxShadow="md"
              >
                {email && (
                  <FormControl>
                    <InputGroup>
                      <InputLeftElement
                        pointerEvents="none"
                        children={<EmailIcon color="gray.500" />}
                      />
                      <Input
                        type="email"
                        value={email}
                        disabled
                        placeholder="Email address"
                        required
                      />
                    </InputGroup>
                    <FormHelperText pl={"2"} color={resendDisabled ? "red" : "green"}>
                      {resendDisabled
                        ? "Resend button is disabled while processing."
                        : "Click the button below to resend the OTP."}
                    </FormHelperText>
                  </FormControl>
                )}
                <FormControl>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      children={<LockIcon color="gray.500" />}
                    />
                    <Input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="Enter OTP"
                      required
                    />
                  </InputGroup>
                </FormControl>
                <Button
                  borderRadius={0}
                  variant="outline"
                  colorScheme="teal"
                  width="full"
                  onClick={sendOtp}
                  isDisabled={resendDisabled}
                >
                  Resend OTP
                </Button>
                <Button
                  borderRadius={0}
                  type="submit"
                  variant="solid"
                  colorScheme="teal"
                  width="full"
                >
                  Verify OTP
                </Button>
              </Stack>
            </form>
          </Box>
        </Stack>
        <Box>
          Verified already?{" "}
          <ChakraLink color="teal.500"  as={Link} href="/">
            Sign in
          </ChakraLink>
        </Box>
      </Flex>
    </ColorChange>
  );
};

export default OTP;
