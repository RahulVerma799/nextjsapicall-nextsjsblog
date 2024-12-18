import {NextResponse} from 'next/server';
import connectdb from '../../../lib/db'
import User from '../../../lib/modal/user';
import { Types } from 'mongoose';

const ObjectId=require('mongoose').Types.ObjectId;

export const GET=async()=>{

    try{
        await connectdb();
        const users=await User.find();
        return new NextResponse(JSON.stringify(users),{status:200});
    }
    catch(error){
        return new NextResponse("Error in fetcheing users"+error,{status:500})
    }
   
}

export const POST=async(req)=>{

    try{
        const putting= await req.json();
        await connectdb();
        const newUser=new User(putting);
        await newUser.save();

        return new NextResponse(JSON.stringify({
            message:'User is craeted',
            user:newUser
            
        },{status:200}))
    }
    catch(error){
        console.log(error);
        return new NextResponse(JSON.stringify({
            message:'not craeted',
            error:error
        },{status:500}))

    }
}
export const PATCH = async (req) => {
    try {
        const body = await req.json();

        const { userId, newUsername } = body;
        await connectdb();

        // Check for missing fields
        if (!userId || !newUsername) {
            return new NextResponse(
                JSON.stringify({
                    message: 'Id or new user name not found'
                }), { status: 400 }
            );
        }

        // Update user
        const updateUser = await User.findByIdAndUpdate(
            { _id: new ObjectId(userId) }, // Ensure userId is valid
            { username: newUsername },
            { new: true } // Return updated user
        );

        if (!updateUser) {
            return new NextResponse(
                JSON.stringify({
                    message: "User not found in database"
                }), { status: 400 }
            );
        }

        // Return success response
        return new NextResponse(
            JSON.stringify({
                message: "User is updated",
                user: updateUser
            }), { status: 200 }
        );

    } catch (error) {
        console.log(error);
        return new NextResponse(
            JSON.stringify({
                message: "Error in updating user",
                error: error.message
            }), { status: 500 }
        );
    }
};

export const DELETE=async(req)=>{
    try{
        const {searchParams}=new URL(req.url);
        const userId=searchParams.get("userId")

        if(!userId){
            return new NextResponse(
                JSON.stringify({message:'Id is not found in database'}),{
                    status:400
                }
            )
        }

        await connectdb()
        const deleteuser=await User.findByIdAndDelete(
            new Types.ObjectId(userId)
        );

        if(!deleteuser){
            return new NextResponse(
                JSON.stringify({message:"user not found in the datbase"}),
                {status:400}
            )
        }

        return new NextResponse(
            JSON.stringify({message:"user is deleted",user:deleteuser}),
            {status:200}
        )
    }
    catch(error){
        return new NextResponse("error in delted",error.message),{status:500}

    }
}