import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";
import { generateAndSetTokens } from "../utils/genrateTokens.js";

export const verifyJWT = asyncHandler(async(req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        
        if (!token) throw new ApiError(401, "Unauthorized request")
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!user) {
            const token = req.cookies?.refreshToken
        
            if (!token) throw new ApiError(401, "Unauthorized request")
    
            const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)

            const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
            
            if(!user){
                throw new ApiError(401, "Invalid Access Token")
            }else{          
                generateAndSetTokens(user._id);
                req.user = user._id;
                return next()
            }
        }
    
        req.user = user._id;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})