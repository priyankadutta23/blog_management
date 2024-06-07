const User = require('../../models/user.models')
const Blog = require('../../models/blog.models')
const Category=require('../../models/category.models')

class BlogController {

    /**
     * @Method blogListing
     * @description to listing all blogs uploaded by users
     */

    async blogListing(req, res) {

        try {
            let user_details = await User.findOne({ _id: req.user.id });

            let all_blogs = await Blog.aggregate([
                {
                    $match: {
                        $expr: {
                            $and: [

                                { $eq: ['$isDeleted', false] }
                            ]
                        }
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        let: {
                            user_id: '$user_id'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$_id', '$$user_id'] },
                                            { $eq: ['$isDeleted', false] }

                                        ]
                                    }
                                }
                            },

                            {
                                $project: {
                                    isDeleted: 0,
                                    updatedAt: 0,
                                    createdAt: 0
                                }
                            }
                        ],
                        as: 'all_user',
                    }
                },

                {
                    $unwind: '$all_user'
                },

            ]);

            res.render('blogs', {
                title: "blog lists",
                all_blogs,
                user_details,
                success: req.flash('success'),
                error: req.flash('error'),
            })
        } catch (error) {
            throw error
        }
    }

    /**
     * @Method statusBlog
     * @description to change the status of blog
     */
    async statusBlog(req,res){
        try {
            let exist_blog = await Blog.findById(req.params.id)
            let update_status = exist_blog.status === "Active" ? "Inactive" : "Active";
            let updated_status = await Blog.findByIdAndUpdate(req.params.id, { status: update_status })
            if (!_.isEmpty(updated_status) && updated_status._id) {
                return res.redirect('/admin/blog');

            } else {
                return res.redirect('/admin/blog');

            }
            
        } catch (error) {
            return error
        }
    }

    /**
     * @Method deleteBlog
     * @description to delete the blog for unusual content
     */
    async deleteBlog(req, res) {
        try {
            let exist_blog = await Blog.findByIdAndUpdate(req.params.id, { isDeleted: true })

            if (!_.isEmpty(exist_blog)) {
                req.flash('success', 'Blog Deleted Successfully')
                return res.redirect('/admin/blog');

            } else {
                req.flash('error', 'somthing wrong')
                return res.redirect('/admin/blog');
            }

        } catch (error) {
            return error
        }
    }

    /**
     * @Method viewBlog
     * @description to view the blog details
     */

    async readBlog(req, res) {
        try {
            let category_details = await Category.find({ status: "Active", isDeleted: false }).sort({ createdAt: -1 });

            let user_details = await User.findOne({ _id: req.user.id });
            let all_blogs = await Blog.findById({ _id: req.params.id })
            

            res.render('read-blog', {
                title: "Read blog",
                all_blogs,
                user_details,
                category_details
            })
        } catch (error) {
            throw error
        }
    }
}



module.exports = new BlogController();