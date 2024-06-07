const User = require('../../models/user.models')
const Category = require('../../models/category.models')

class CategoryController {

    /**
    * @Method showCategoryPage
    * @description to show the list of all category
    */
    async showCategoryPage(req, res) {
        try {
            let user_details = await User.findOne({ _id: req.user.id });
            let all_category = await Category.find({ isDeleted: false }).sort({ createdAt: -1 });

            res.render('categories', {
                title: "category",
                success: req.flash('success'),
                error: req.flash('error'),
                user_details,
                all_category,
            })
        } catch (error) {
            return error
        }
    }

    /**
     * @Method addCategory
     * @description show category insert form
     */
    async addCategory(req, res) {

        try {
            let user_details = await User.findOne({ _id: req.user.id });

            res.render('add-category', {
                title: "add category",
                success: req.flash('success'),
                error: req.flash('error'),
                user_details,
            })

        } catch (error) {
            return error
        }
    }

    /**
    * @Method createCategory
    * @description insert category in  db
    */
    async createCategory(req, res) {

        try {
            if (_.isEmpty(req.body.category_name.trim())) {
                req.flash('error', 'Category name should not be empty!');
                return res.redirect('/admin/categories/add-category');
            }
            let exist_category_name = await Category.find({ category_name: req.body.category_name })

            if (!_.isEmpty(exist_category_name)) {
                req.flash('error', 'Category name already exist')
                return res.redirect('/admin/categories/add-category');
            } else {
                let save_data = await Category.create(req.body)

                if (!_.isEmpty(save_data) && save_data._id) {
                    req.flash('success', 'Category Name saved')
                    return res.redirect('/admin/categories');
                } else {
                    req.flash('error', 'Category name not saved')
                    return res.redirect('/admin/categories/add-category');
                }
            }

        } catch (error) {
            return error
        }
    }

    /**
     * @Method editCategory
     * @description show edit category form
     */
    async editCategory(req, res) {
        try {
            let user_details = await User.findOne({ _id: req.user.id });
            let response = await Category.findById({ _id: req.params.id })

            res.render('edit-category', {
                title: "Edit Category",
                response,
                user_details,
                success: req.flash('success'),
                error: req.flash('error'),
            })
        } catch (error) {
            return error
        }
    }

    /**
     * @Method updateCategory
     * @description update category name
     */
    async updateCategory(req, res) {
        try {
            if (_.isEmpty(req.body.category_name.trim())) {
                req.flash('error', 'Category Name should not be empty!');
                return res.redirect('/admin/categories');
            }

            let exist_category_name = await Category.find({ category_name: req.body.category_name, _id: { $ne: req.body.id } })

            if (!_.isEmpty(exist_category_name)) {
                req.flash('error', 'Category name already exist')
                return res.redirect('/admin/categories');
            } else {

                let update_obj = {
                    category_name: req.body.category_name,
                }
                let updated_category_name = await Category.findByIdAndUpdate(req.body.id, update_obj)
                if (!_.isEmpty(updated_category_name) && updated_category_name._id) {
                    req.flash('success', 'Category name updated successfully')
                    return res.redirect('/admin/categories');

                } else {
                    req.flash('error', 'Category name not updated')
                    return res.redirect('/admin/categories');
                }
            }

        } catch (error) {
            return error
        }
    }


    /**
     * @Method deleteCategory
     * @description delete category from database
     */
    async deleteCategory(req, res) {
        try {
            let exist_category_name = await Category.findByIdAndUpdate(req.params.id, { isDeleted: true })

            if (!_.isEmpty(exist_category_name)) {
                req.flash('success', 'Category Name Deleted Successfully')
                return res.redirect('/admin/categories');

            } else {
                req.flash('error', 'Category Name not Deleted')
                return res.redirect('/admin/categories');
            }
        } catch (error) {
            return error
        }
    }

    /**
     * @Method statusCategory
     * @description change the status of category to show in the  category list
     */
    async statusCategory(req, res) {
        try {
            let exist_category_name = await Category.findById(req.params.id)
            let update_status = exist_category_name.status === "Active" ? "Inactive" : "Active";
            let updated_status = await Category.findByIdAndUpdate(req.params.id, { status: update_status })
            if (!_.isEmpty(updated_status) && updated_status._id) {
                return res.redirect('/admin/categories');

            } else {
                return res.redirect('/admin/categories');

            }
        } catch (error) {
            return error
        }
    }
}

module.exports = new CategoryController();