const Banner = require('../../models/banner.models')
const Category = require('../../models/category.models')
const Role = require('../../models/role.models')
const Blog = require('../../models/blog.models')
const User = require('../../models/user.models');
const { login } = require('./users.controllers');
const { default: mongoose, isValidObjectId } = require('mongoose');



class FontController {
    /**
     * @Method showIndex
     * @description to show the front page
     */
    async showIndex(req, res) {
        try {

            let banner_details = await Banner.find({ status: "Active", isDeleted: false }).sort({ createdAt: -1 });
            let category_details = await Category.find({ status: "Active", isDeleted: false }).sort({ createdAt: -1 });

            if (!_.isEmpty(req.front_user)) {

                var front_user = await User.findById(req.front_user.id)
            }
           

            let blog_details = await Blog.aggregate([
                {
                    $match: {
                        $expr: {
                            $and: [
                                
                                { $eq: ['$status', "Active"] },
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
                        as: 'user_details',
                    }
                },
                {
                    $unwind: '$user_details'

                },

                {
                    $unwind: '$category_details'
                },

            ]);

            res.render('index', {
                title: "Home",
                banner_details,
                category_details,
                front_user,
                blog_details,
            })
        } catch (error) {
            throw error
        }
    }

    /**
     * @Method showAbout
     * @description to show the about page
     */
    async showAbout(req, res) {
        try {
            let category_details = await Category.find({ status: "Active", isDeleted: false }).sort({ createdAt: -1 });
            let role_details = await Role.findOne({ role_group: 'admin' })
            let admin = await User.find({ role: { $eq: role_details._id } })
            if (!_.isEmpty(req.front_user)) {

                var front_user = await User.findById(req.front_user.id)
            }
            res.render('about', {
                title: "About",
                category_details,
                front_user,
                admin
            })
        } catch (error) {
            return error
        }
    }


    /**
     * @Method seePost
     * @description to read the post
     */
    async seePost(req, res) {
        try {
            let category_details = await Category.find({ status: "Active", isDeleted: false }).sort({ createdAt: -1 });
            let blog_data = await Blog.findById({ _id: req.params.id });
            let blog_details = await Blog.aggregate([
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: ['$_id', blog_data._id] },
                                { $eq: ['$status', "Active"] },
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
                        as: 'user_details',
                    }
                },
                {
                    $unwind: '$user_details'

                },

                {
                    $unwind: '$category_details'
                },

            ]);
            if (!_.isEmpty(req.front_user)) {

                var front_user = await User.findById(req.front_user.id)
            }
            res.render('see-post', {
                title: 'See Post',
                category_details,
                blog_details,
                front_user,

            })
        } catch (error) {
            throw error
        }
    }

    /**
     * @Method categoryBlog
     * @description to view blogs category wise
     */
    async categoryBlog(req, res) {
        try {
            let category_details = await Category.find({ status: "Active", isDeleted: false }).sort({ createdAt: -1 });
            let category_data = await Category.findById({ _id: req.params.id });

            let all_blogs = await Blog.aggregate([
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: ['$isDeleted', false] },
                                { $eq: ['$status', "Active"] },

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
                                }
                            }
                        ],
                        as: 'user_details',
                    }
                },

                {
                    $unwind: '$user_details'

                },

                {
                    $unwind: '$category_details'
                },

            ]);

            let blog_details = await Blog.aggregate([
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: ['$category_id', category_data._id] },
                                { $eq: ['$status', "Active"] },

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
                        as: 'user_details',
                    }
                },
                {
                    $unwind: '$user_details'

                },

                {
                    $unwind: '$category_details'
                },

            ]);
            if (!_.isEmpty(req.front_user)) {

                var front_user = await User.findById(req.front_user.id)
            }
            res.render('category-blog', {
                title: "Category Blog",
                category_details,
                front_user,
                blog_details,
                all_blogs

            })
        } catch (error) {
            return error
        }
    }

    /**
     * @Method bannerPost
     * @description read banner blog
     */

    async bannerPost(req,res){
        try {
            let category_details = await Category.find({ status: "Active", isDeleted: false }).sort({ createdAt: -1 });
            let banner_details=await Banner.findById(req.params.id)
            if (!_.isEmpty(req.front_user)) {

                var front_user = await User.findById(req.front_user.id)
            }
            res.render('banner-post',{
                title:"Read Banner Post",
                category_details,
                front_user,
                banner_details
            })
            
        } catch (error) {
            return error
        }
    }
}

module.exports = new FontController();