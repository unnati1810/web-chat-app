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
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Reset = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const [otpSent, setOtpSent] = useState(false); // State to track if OTP is sent
  const color = useColorModeValue("#000", "#fff");
  const bg = useColorModeValue("gray.200", "#2e2b2b");
  const profileColor = useColorModeValue("whiteAlpha.900", "#292626");
  const toast = useToast();
  const navigate = useNavigate();

  const sendVerificationCode = async (e) => {
    e.preventDefault();
    setResendDisabled(true);
    try {
      const { data } = await Axios.post(
        "https://hq7xe49h0d.execute-api.us-east-1.amazonaws.com/dev1/forgotPassword",
        { "body":{email} }
      );
      console.log("sendVerificationCode response:", data);
      toast({
        title: "Verification code sent!",
        description: "Check your email for the verification code.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setOtpSent(true); // Set otpSent to true after the OTP is sent
    } catch (err) {
      console.error("sendVerificationCode error:", err);
      toast({
        title: "Failed to send verification code!",
        description: err.response?.data?.message || "An error occurred.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } finally {
      setResendDisabled(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await Axios.post(
        "https://hq7xe49h0d.execute-api.us-east-1.amazonaws.com/dev1/resetPassword",
               { "body":{ email, otp, newPassword } }


      );
      console.log("resetPassword response:", data);
      toast({
        title: "Password reset successful!",
        description: "Your password has been updated.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      navigate("/");
    } catch (err) {
      console.error("resetPassword error:", err);
      toast({
        title: "Failed to reset password!",
        description: err.response?.data?.message || "An error occurred.",
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
        description={"Reset your password"}
        title={"WebChatApp - Reset Password"}
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
          <Heading color="teal.400">Reset Your Password</Heading>
          <Box minW={{ base: "90%", md: "468px" }}>
            <form onSubmit={resetPassword}>
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
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email address"
                      required
                    />
                  </InputGroup>
                  <FormHelperText pl={"2"} color={resendDisabled ? "red" : "green"}>
                    {resendDisabled
                      ? "Resend button is disabled while processing."
                      : "Click the button below to resend the verification code."}
                  </FormHelperText>
                </FormControl>
                {otpSent && (
                  <>
                    <FormControl>
                      <InputGroup>
                        <InputLeftElement
                          pointerEvents="none"
                          children={<LockIcon color="gray.500" />}
                        />
                        <Input
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="Enter OTP"
                          required
                        />
                      </InputGroup>
                    </FormControl>
                    <FormControl>
                      <InputGroup>
                        <InputLeftElement
                          pointerEvents="none"
                          children={<LockIcon color="gray.500" />}
                        />
                        <Input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="New Password"
                          required
                        />
                      </InputGroup>
                    </FormControl>
                  </>
                )}
                <Button
                  borderRadius={0}
                  variant="outline"
                  colorScheme="teal"
                  width="full"
                  onClick={sendVerificationCode}
                  isDisabled={resendDisabled}
                >
                  Resend Verification Code
                </Button>
                <Button
                  borderRadius={0}
                  type="submit"
                  variant="solid"
                  colorScheme="teal"
                  width="full"
                  isDisabled={!otpSent} // Disable reset button until OTP is sent
                >
                  Reset Password
                </Button>
              </Stack>
            </form>
          </Box>
        </Stack>
        <Box>
          Remembered your password?{" "}
          <ChakraLink color="teal.500" as={Link} to="/">
            Sign in
          </ChakraLink>
        </Box>
      </Flex>
    </ColorChange>
  );
};

export default Reset;
