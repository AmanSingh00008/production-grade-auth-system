import dotenv from 'dotenv';    

dotenv.config();

if(!process.env.MONGO_URI){
    throw new ApiError("MONGO_URI is not defined in enviromental variables")
}

if(!process.env.JWT_SECRET){
    throw new ApiError("JWT_SECRET is not defined in enviromental variables")
}

const config = {
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET
}

export default config;