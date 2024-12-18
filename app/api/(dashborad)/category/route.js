import connectdb from "../../../lib/db";
import User from "../../../lib/modal/user";
import { NextResponse } from "next/server";
import { Types } from "mongoose";
import Category from "../../../lib/modal/category";

export const GET=async(req)=>{
    try{

        const {searchParams}=new URL(req.url);
        const userId=searchParams.get('userId');

        if(!userId ||!Types.ObjectId.isValid(userId)){
            return new NextResponse(
                JSON.stringify({message:'Invalid user'}),{
                    status:400
                }
            )
        }

        await connectdb();
        const user =await User.findById(userId);
        if(!user){
            return new NextResponse(
                JSON.stringify({message:"user is not in database"}),{status:401}
            )
        }

    }catch(error){

    }
}

export const POST=async(req)=>{
    try{
        const {searchParams}=new URL(req.url);
        const userId=searchParams.get('userId');

        const {title}=await req.json();

        if(!userId||!Types.ObjectId.isValid(userId)){
            return new NextResponse(
                JSON.stringify({message:"inivallid user is missing"},{status:400})
            )
        }

        await connectdb();

        const user=await User.findById(userId);

        if(!user){
            return new NextResponse(JSON.stringify({message:'User Not found'}),{status:404})
        }

        const newCategory= new Category({title,user: new Types.ObjectId(userId),})

        await newCategory.save();

        return new NextResponse(
            JSON.stringify({message:"CAtegory s=is craeted",category:newCategory}),{status:200}

        )
    }

    catch(error){
        return new NextResponse("Error in categoy"+error.message,{
            status:500 
        })

    }
}

