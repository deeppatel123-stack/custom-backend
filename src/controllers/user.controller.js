import { json } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { use } from 'react';
import { User } from '../models/user.model.js'
import { uploadoncloudinary } from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js';

const registerUser = asyncHandler(async (req, res) => {

    const { username, email, fullname, password } = req.body;
    console.log("Email :", email);

    if (
        [username, email, fullname, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "field required")
    }

    res.status(201).json({
        success: true,
        message: "User registered successfully",
    });

    const existedUser = User.findOne({
        $or: [{username},{email}]
    })

    if(existedUser){
        throw new ApiError(409, "User with same username or email alerady exists")
    }

    const avatarlocalpath = req.files?.avatar[0]?.path;
    const coverImagelocatpath = req.files?.coverImage[0]?.path;

    if(!avatarlocalpath){
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadoncloudinary(avatarlocalpath)
    const coverImage = await uploadoncloudinary(coverImagelocatpath)

    if(!avatar){
        throw new ApiError(400, "Avatar file is required")
    }

    const user = await User.create({
        username: username.toLowerCase(),
        fullname,
        password,
        email,
        avatar: avatar.url,
        coverImage : coverImage?.url || ""
    })

    const createdUser = user.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    )

})

export { registerUser }