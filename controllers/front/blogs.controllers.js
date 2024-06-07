const Blog = require('../../models/blog.models')
const Category = require('../../models/category.models')
const User = require('../../models/user.models')
const Role = require('../../models/role.models')
const fs = require('fs')
const { default: mongoose } = require('mongoose')



class BlogController {

    /**
     * @Method addBlog 
     * @description to show the blogs posts form 
     */

    async addBlog(req, res) {
        try {
            let category_details = await Category.find({ status: "Active", isDeleted: false }).sort({ createdAt: -1 });
            // if (!_.isEmpty(req.front_user)) {

                var front_user = await User.findById(req.front_user.id)
            // }
            res.render('add-blog', {
                title: "Create Blog page",
                category_details,
                front_user,
                success: req.flash('success'),
                error: req.flash('error')

            })
        } catch (error) {
            throw error
        }
    }

    /**
     * @Method CreateBlog
     * @description to insert blog in db
     */
    async CreateBlog(req, res) {
        try {
            if (_.isEmpty(req.body.heading.trim())) {
                req.flash('error', 'Heading should not be empty!');
                return res.redirect('/front-user/blog');
            }
            if (_.isEmpty(req.body.description.trim())) {
                req.flash('error', 'Description should not be empty!');
                return res.redirect('/front-user/blog');
            }
            let exist_heading = await Blog.find({ heading: req.body.heading })

            if (!_.isEmpty(exist_heading)) {
                req.flash('error', 'Heading already exist')
                return res.redirect('/front-user/blog');

            }
            let exist_description = await Blog.find({ description: req.body.description })

            if (!_.isEmpty(exist_description)) {
                req.flash('error', 'Description already exist')
                return res.redirect('/front-user/blog');

            }
            let user_details = await User.findOne({ _id: req.front_user.id });
            req.body.user_id = user_details._id
            req.body.image = req.file.filename;
            req.body.status = 'Inactive'

            let save_data = await Blog.create(req.body);
            if (save_data && save_data._id) {
                req.flash('success', 'Your post created successfully')
                return res.redirect('/front-user/blog/blog-list');
            }
            else {
                req.flash('error', 'something wrong')
                return res.redirect('/front-user/blog');
            }
        } catch (error) {
            throw error
        }
    }

    /**
     * @Method showBlogList
     * @description to show the list of all blogs of logged user
     */
    async showBlogList(req, res) {
        try {
            let category_details = await Category.find({ status: "Active", isDeleted: false }).sort({ createdAt: -1 });
            let user_details = await User.findOne({ _id: req.front_user.id });
            let blog_details = await Blog.aggregate([
                {
                    $match: {
                        $expr: {
                            $and: [
                                {$eq:['$user_id',user_details._id]},
                    

                                { $eq: ['$isDeleted', false] },
                            ]
                        }
                    }
                },
                {
                    $lookup: {
                        from: 'categories',
                        let: {
                            category_id: '$category_id'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$_id', '$$category_id'] },
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
                        as: 'category_details',
                    },
                    
                },
                {
                    $lookup:{
                        from:'users',
                        let:{
                            user_id:'$user_id'
                        },
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $and:[
                                            {$eq:['$_id','$$user_id']},
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
                        as:'user_details',
                    }
                },
                {
                    $unwind:'$user_details'

                },

                {
                    $unwind: '$category_details'
                },

            ]);
            if (!_.isEmpty(req.front_user)) {

                var front_user = await User.findById(req.front_user.id)
            }
            res.render('blog-list', {
                title: "blog list",
                success: req.flash('success'),
                error: req.flash('error'),
                category_details,
                front_user,
                blog_details

            })

        } catch (error) {
            return error
        }
    }

    /**
     * @Method editBlog
     * @description to show blog edit page
     */
    async editBlog(req, res) {
        try {
            let category_details = await Category.find({ status: "Active", isDeleted: false }).sort({ createdAt: -1 });
            let response = await Blog.findById({ _id: req.params.id })
            if (!_.isEmpty(req.front_user)) {

                var front_user = await User.findById(req.front_user.id)
            }
            res.render('edit-blog', {
                title: 'Edit Blog',
                success: req.flash('success'),
                error: req.flash('error'),
                category_details,
                front_user,
                response

            })
        } catch (error) {
            return error
        }
    }

    /**
     * @Method updateBlog
     * @description update the blog in database
     */
    async updateBlog(req, res) {
        try {
            if (_.isEmpty(req.body.heading.trim())) {
                req.flash('error', 'Heading should not be empty!');
                return res.redirect('/front-user/blog/blog-list');
            }
            if (_.isEmpty(req.body.description.trim())) {
                req.flash('error', 'Description should not be empty!');
                return res.redirect('/front-user/blog/blog-list');
            }

            let exist_heading = await Blog.find({ heading: req.body.heading, _id: { $ne: req.body.id }, isDeleted: false })

            if (!_.isEmpty(exist_heading)) {
                req.flash('error', 'Heading already exist')
                return res.redirect('/front-user/blog/blog-list');
            }
            let exist_description = await Blog.find({ description: req.body.description, _id: { $ne: req.body.id }, isDeleted: false })
            if (!_.isEmpty(exist_description)) {
                req.flash('error', 'Description already exist')
                return res.redirect('/front-user/blog/blog-list');
            }

            let updated_obj = {
                category_id: req.body.category_id,
                heading: req.body.heading,
                description: req.body.description,

            }
            let blog_data = await Blog.findOne({ _id: req.body.id });
            if (!_.isEmpty(req.file)) {

                fs.unlinkSync(`./public/front/uploads/${blog_data.image}`)
                updated_obj.image = req.file.filename
            }

            let updated_data = await Blog.findByIdAndUpdate(req.body.id, updated_obj)
            if (updated_data && updated_data._id) {
                req.flash('success', 'data updated');
                return res.redirect('/front-user/blog/blog-list');

            } else {
                req.flash('error', 'somthing wrong');
                return res.redirect('/front-user/blog/blog-list');

            }
        } catch (error) {
            return error
        }
    }

    /**
     * @Method viewBlog
     * @description to read the blog by logged users
     */
    async viewBlog(req, res) {
        try {
            let category_details = await Category.find({ status: "Active", isDeleted: false }).sort({ createdAt: -1 });

            let blog_details = await Blog.findById({ _id: req.params.id });
            if (!_.isEmpty(req.front_user)) {

                var front_user = await User.findById(req.front_user.id)
            }
            res.render('view-blog', {
                title: "View Blog",
                success: req.flash('success'),
                error: req.flash('error'),
                category_details,
                front_user,
                blog_details
            })

        } catch (error) {
            return error
        }
    }
}
module.exports = new BlogController();