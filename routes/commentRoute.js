const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/middleware')
const users = require('../Schema/userModel')
const Comment = require('../Schema/commentModel')

const Blog = require('../Schema/blogModel')

// Add a comment to a blog post route
router.post('/add/:id', authenticateToken, async (req, res) => {
    try {
        const { content } = req.body;
        const blogId = req.params.id;
        const userId = req.user._id;

        // Find the blog post by ID
        const blog = await Blog.findById(blogId);

        // Check if the blog post exists
        if (!blog) {
            return res.status(404).json({ success: false, message: 'Blog post not found' });
        }

        // Create a new comment
        const newComment = new Comment({
            author: userId,
            content
        });

        // Save the new comment
        await newComment.save();

        // Push the comment's ID into the 'comments' array of the blog post
        blog.comments.push(newComment._id);
        
        // Save the updated blog post
        await blog.save();

        res.status(201).json({ success: true, message: 'Comment added successfully', comment: newComment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});


// Edit a comment route
router.put('/edit/:commentId', authenticateToken, async (req, res) => {
    try {
        const { content } = req.body;
        const commentId = req.params.commentId;
        const userId = req.user._id;

        // Find the comment by ID
        const comment = await Comment.findById(commentId);

        // Check if the comment exists
        if (!comment) {
            return res.status(404).json({ success: false, message: 'Comment not found' });
        }

        // Check if the user is the author of the comment
        if (comment.author.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: 'Unauthorized - You are not the author of this comment' });
        }

        // Update the comment content
        comment.content = content;
        await comment.save();

        res.json({ success: true, message: 'Comment updated successfully', comment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});


// Delete a comment route
router.delete('/delete/:commentId', authenticateToken, async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const userId = req.user._id;

        // Find the comment by ID
        const comment = await Comment.findById(commentId);

        // Check if the comment exists
        if (!comment) {
            return res.status(404).json({ success: false, message: 'Comment not found' });
        }

        // Check if the user is the author of the comment
        if (comment.author.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: 'Unauthorized - You are not the author of this comment' });
        }

        // Delete the comment
        await Comment.findByIdAndDelete(commentId);

        res.json({ success: true, message: 'Comment deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});


module.exports = router;