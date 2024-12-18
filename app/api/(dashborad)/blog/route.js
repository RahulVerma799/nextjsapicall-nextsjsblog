import connectdb from "../../../lib/db";
import User from "../../../lib/modal/user";
import { NextResponse } from "next/server";
import { Types } from "mongoose";
import Category from "../../../lib/modal/category";
import Blog from "../../../lib/modal/blog";

export const GET = async (req) => {
    try {
        // Extract query parameters
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');
        const categoryId = searchParams.get('categoryId');

        // Validate userId and categoryId
        if (!userId || !Types.ObjectId.isValid(userId)) {
            console.error("Invalid userId:", userId);
            return new NextResponse(
                JSON.stringify({ message: "Invalid user ID" }),
                { status: 400 }
            );
        }

        if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
            console.error("Invalid categoryId:", categoryId);
            return new NextResponse(
                JSON.stringify({ message: "Invalid category ID" }),
                { status: 400 }
            );
        }

        // Connect to the database
        await connectdb();

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            console.error("User not found:", userId);
            return new NextResponse(
                JSON.stringify({ message: "User not found" }),
                { status: 404 }
            );
        }

        // Check if the category exists
        const category = await Category.findById(categoryId);
        if (!category) {
            console.error("Category not found:", categoryId);
            return new NextResponse(
                JSON.stringify({ message: "Category not found" }),
                { status: 404 }
            );
        }

        // Construct the filter for the blog search
        const filter = {
            user: new Types.ObjectId(userId),
            category: new Types.ObjectId(categoryId),
        };

        // Find blogs matching the filter
        const blogs = await Blog.find(filter);

        // Return the blogs in the response
        return new NextResponse(
            JSON.stringify({ blogs }),
            { status: 200 }
        );

    } catch (error) {
        console.error("Error in GET /blog:", error.message);
        return new NextResponse(
            JSON.stringify({ message: "Error fetching blogs", error: error.message }),
            { status: 500 }
        );
    }
};


export const POST=async(req)=>{
    try{
        const searchParams= new URL(req.url)
        const userId=searchParams.get('userId');
        const categoryId=searchParams.get('categoryId');

        const {title,description}=await req.json();

        if (!userId || !Types.ObjectId.isValid(userId)) {
            console.error("Invalid userId:", userId);
            return new NextResponse(
                JSON.stringify({ message: "Invalid user ID" }),
                { status: 400 }
            );
        }

        if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
            console.error("Invalid categoryId:", categoryId);
            return new NextResponse(
                JSON.stringify({ message: "Invalid category ID" }),
                { status: 400 }
            );
        }

        const newBlog=new Blog({
            title,
            description,
            user:new Types.ObjectId(userId),
            category:new Types.ObjectId(categoryId)

        })

        await newBlog.save();
        return new NextResponse(JSON.stringify({message:"Blog is created"},{status:200}))


    }
    catch(error){
        console.log(error)
        return new NextResponse(JSON.stringify({message:"post  not craeetd"+error.message},{status:500}))
    }
}