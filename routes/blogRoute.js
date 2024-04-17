

const router = require("express").Router();
const Blogs = require('../Schema/blogModel');
const user = require('../Schema/userModel');
const authenticateTOken = require("../middlewares/middleware");

// adding a blog

router.post('/add', authenticateTOken, async (req, res) => {
    // Ensure the user is logged in before adding a blog post (middleware already does this)
    if (!req.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized - Please log in to add a blog post' });
    }

    try {
        const { content } = req.body;
        const author = req.user._id;

        // Create a new blog post with the provided content
        const newBlog = new Blogs({
            content,
            author
        });

        // Save the new blog post
        await newBlog.save();

        // Send success response
        res.status(201).json({ success: true, message: 'Blog post added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// showing all the blogs

router.get('/all', authenticateTOken, async (req, res) => {
    try {
        // Fetch all blog posts from the database and populate the 'author' field with the 'name' of the user
        const allBlogs = await Blogs.find().populate({
            path: 'author',
            select: 'name'
        }).populate({
            path: 'comments', // Populate the 'comments' field
            populate: {
                path: 'author',
                select: 'name'
            }
        });

        // Send the fetched blog posts as a response
        res.status(200).json({ success: true, blogs: allBlogs });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});


// editing the selected blog

router.put('/edit/:id', authenticateTOken, async (req, res) => {
    try {
        const { content } = req.body;
        const blogId = req.params.id;
        
        
        // Find the blog post by ID
        const blog = await Blogs.findById(blogId);
        
        // Check if the blog post exists
        if (!blog) {
            return res.status(404).json({ success: false, message: 'Blog post not found' });
        }

        // Check if the user is the author of the blog post
        if (blog.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Unauthorized - You are not the author of this blog post' });
        }

        // Update the content of the blog post
        blog.content = content;

        // Save the updated blog post
        await blog.save();

        // Send success response
        res.json({ success: true, message: 'Blog post updated successfully', blog });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// deleting the selected blogs

router.delete('/delete/:id', authenticateTOken, async (req, res) => {
    try {
        const blogId = req.params.id;

        // Find the blog post by ID
        const blog = await Blogs.findById(blogId);

        // Check if the blog post exists
        if (!blog) {
            return res.status(404).json({ success: false, message: 'Blog post not found' });
        }

        // Check if the user is the author of the blog post
        if (blog.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Unauthorized - You are not the author of this blog post' });
        }

        // Delete the blog post
        const deletedBlog = await Blogs.findByIdAndDelete(blogId);

        if (!deletedBlog) {
            return res.status(404).json({ success: false, message: 'Blog post not found' });
        }

        res.json({ success: true, message: 'Blog post deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});



module.exports = router;



