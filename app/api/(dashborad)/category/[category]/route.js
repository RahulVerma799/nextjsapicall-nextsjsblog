import connectdb from "../../../lib/db";
import User from "../../../lib/modal/user";
import { NextResponse } from "next/server";
import { Types } from "mongoose";
import Category from "../../../lib/modal/category";

export const PATCH = async (req, context) => {
    try {
        // Extract category ID from route parameters
        const categoryId = context.params.category;

        // Validate category ID
        if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
            console.error("Invalid category ID:", categoryId);
            return new NextResponse(
                JSON.stringify({ message: "Invalid category ID" }),
                { status: 400 }
            );
        }

        // Parse the request body
        const { title } = await req.json();

        if (!title) {
            console.error("Missing title in request body");
            return new NextResponse(
                JSON.stringify({ message: "Title is required" }),
                { status: 400 }
            );
        }

        // Parse query parameters
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId || !Types.ObjectId.isValid(userId)) {
            console.error("Invalid user ID:", userId);
            return new NextResponse(
                JSON.stringify({ message: "Invalid user ID" }),
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

        // Check if the category exists and belongs to the user
        const category = await Category.findOne({ _id: categoryId, user: userId });
        if (!category) {
            console.error("Category not found for user:", { categoryId, userId });
            return new NextResponse(
                JSON.stringify({ message: "Category not found" }),
                { status: 404 }
            );
        }

        // Update the category
        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            { title },
            { new: true } // Return the updated document
        );

        if (!updatedCategory) {
            console.error("Failed to update category:", categoryId);
            return new NextResponse(
                JSON.stringify({ message: "Failed to update category" }),
                { status: 500 }
            );
        }

        // Return success response
        return new NextResponse(
            JSON.stringify({
                message: "Category updated successfully",
                category: updatedCategory,
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating category:", error);
        return new NextResponse(
            JSON.stringify({
                message: "Error updating category",
                error: error.message,
            }),
            { status: 500 }
        );
    }
};
