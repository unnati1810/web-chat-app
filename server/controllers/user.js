const asyncHandler = require("express-async-handler");
const { CustomError } = require("../error/custom");
const UserModel = require("../models/User");
const generateJWToken = require("../config/webtoken");


//todo: https://hq7xe49h0d.execute-api.us-east-1.amazonaws.com/dev1/getusers?email=john.doe@example.com
const getAllUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { username: { $regex: req.query.search, $options: "i" } },
          { gmail: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const AllUsers = await UserModel.find(keyword).find({
    _id: { $ne: req.user._id },
  });
  // console.log(AllUsers);
  res.send(AllUsers);
});


//todo: https://hq7xe49h0d.execute-api.us-east-1.amazonaws.com/dev1/create-user
// need to add cognito code and do not remove the profile picture uplaod and other fields
const registerUser = asyncHandler(async (req, res) => {
  const { username, gmail, password } = req.body;
  if (!username || !gmail || !password) {
    throw new CustomError("Specify the required fields!", 400);
  }
  const UserExists = await UserModel.findOne({
    $or: [{ username: username }, { gmail: gmail }],
  });
  if (UserExists) {
    throw new CustomError("Username or gmail already exist!", 400);
  }

  const newUser = await UserModel.create({
    username,
    gmail,
    password,
  });
  const token = generateJWToken(newUser._id);
  if (newUser) {
    res.status(200).json({
      _id: newUser._id,
      username: newUser.username,
      gmail: newUser.gmail,
      image: newUser.image,
      friends: newUser.friends,
      token: token,
      verified: newUser.verified,
    });
  } else {
    throw new CustomError("Failed to create user!", 400);
  }
});


//todo: https://hq7xe49h0d.execute-api.us-east-1.amazonaws.com/dev1/login
// need to add cognito code
const loginUser = asyncHandler(async (req, res) => {
  const { gmail, password } = req.body;
  if (!gmail || !password) {
    throw new CustomError("Specify the required fields!", 400);
  }
  const selectUser = await UserModel.findOne({
    gmail: gmail,
  });
  // console.log(selectUser);
  if (selectUser) {
    if (await selectUser.matchPassword(password)) {
      res.status(200).json({
        _id: selectUser._id,
        username: selectUser.username,
        gmail: selectUser.gmail,
        image: selectUser.image,
        friends: selectUser.friends,
        token: generateJWToken(selectUser._id),
        verified: selectUser.verified,
      });
    } else {
      throw new CustomError("Password is incorrect!", 400);
    }
  } else {
    throw new CustomError("Gmail  is incorrect!", 400);
  }
});

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
};
