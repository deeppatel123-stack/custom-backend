import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import { uploadoncloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const registerUser = asyncHandler(async (req, res) => {
  console.log('--- registerUser called ---');
  console.log('body:', req.body);
  console.log('files:', req.files);

  const { fullname, email, username, password } = req.body

  if (fullname === "") {
    throw new ApiError(400, "fullname is required")
  }

  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "all fields are required")
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }]
  })

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exsist")
  }

  const avatarLocalPath = req.files?.avatar[0]?.path
  const coverImagePath = req.files?.coverImage[0]?.path

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required")
  }

  const avatar = await uploadoncloudinary(avatarLocalPath)
  const coverImage = await uploadoncloudinary(coverImagePath)

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required")
  }

  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    username: username.toLowerCase(),
    password
  })

  const createdUser = await User.findById(user._id).select("-password -refreshToken")

  if (!createdUser) {
    throw new ApiError(500, "User registration failed")
  }

  return res.status(201).json(new ApiResponse(201, createdUser, "User registered successfully"));

});

export { registerUser };
