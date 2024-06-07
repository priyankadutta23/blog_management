const User = require('../../models/user.models')
const Role = require('../../models/role.models')
const Banner = require('../../models/banner.models')
const fs = require('fs')

class BannerController {

    /**
     * @Method showBannerPage
     * @description to show the list of banner data
     */
    async showBannerPage(req, res) {
        try {
            let user_details = await User.findOne({ _id: req.user.id });
            let all_banner = await Banner.find({isDeleted: false })
            res.render('banner', {
                title: "banner Page",
                success: req.flash('success'),
                error: req.flash('error'),
                user_details,
                all_banner

            }) 
        } catch (error) {
            return error
        }
    }

    /**
     * @Method addBanner
     * @description to insert banner data in db
     */

    async addBanner(req, res) {
        try {
            let user_details = await User.findById({ _id: req.user.id });

            res.render('add-banner', {
                title: "Add Banner",
                user_details,
                success: req.flash('success'),
                error: req.flash('error')

            })
        } catch (error) {
            return error
        }
    }

    /**
     * @Method createBanner
     * @description to insert banner data in database
     */
    async createBanner(req, res) {
        try {

            if (_.isEmpty(req.body.heading.trim())) {
                req.flash('error', 'Heading should not be empty!');
                return res.redirect('/admin/banner/add-banner');
            }

            if (_.isEmpty(req.body.description.trim())) {
                req.flash('error', 'Description should not be empty!');
                return res.redirect('/admin/banner/add-banner');
            }

            let exist_heading = await Banner.find({ heading: req.body.heading })

            if (!_.isEmpty(exist_heading)) {
                req.flash('error', 'Heading already exist');
                return res.redirect('/admin/banner/add-banner');
            } else {

                let exist_description = await Banner.find({ description: req.body.description })

                if (!_.isEmpty(exist_description)) {
                    req.flash('error', 'Description already exist');
                    return res.redirect('/admin/banner/add-banner');
                } else {
                    req.body.image = req.file.filename;

                    let save_data = await Banner.create(req.body);
                    if (save_data && save_data._id) {
                        req.flash('success', 'Banner data insert successfully done')
                        return res.redirect('/admin/banner');
                    }
                    else {
                        console.log("not done");
                        req.flash('error', 'something wrong')
                        return res.redirect('/admin/banner/add-banner');
                    }
                }
            }
        } catch (error) {
            return error
        }

    }

    /**
     * @Method editBanner
     * @description edit banner form
     */
    async editBanner(req, res) {
        try {
            let user_details = await User.findOne({ _id: req.user.id });

            let response = await Banner.findById({ _id: req.params.id })

            res.render('edit-banner', {
                title: "Edit Banner",
                response,
                user_details,
                success: req.flash('success'),
                error: req.flash('error')
            })
        } catch (error) {
            throw error
        }
    }

    /**
    * @Method updateBanner 
    * @description to update banner data
    */
    async updateBanner(req, res) {
        try {
            if (_.isEmpty(req.body.heading.trim())) {
                req.flash('error', 'Heading should not be empty!');
                return res.redirect('/admin/banner');
            }
            if (_.isEmpty(req.body.description.trim())) {
                req.flash('error', 'Description should not be empty!');
                return res.redirect('/admin/banner');
            }
            let exist_heading = await Banner.find({ heading: req.body.heading, _id: { $ne: req.body.id },isDeleted:false })

            if (!_.isEmpty(exist_heading)) {
                req.flash('error', 'Heading already exist')
                return res.redirect('/admin/banner');
            } else {
                let exist_description = await Banner.find({ description: req.body.description, _id: { $ne: req.body.id },isDeleted:false })

                if (!_.isEmpty(exist_description)) {
                    req.flash('error', 'description already exist')
                    return  res.redirect('/admin/banner');
                } else {
                    let updated_obj = {
                        heading: req.body.heading,
                        description: req.body.description
                    }
                    let banner_data = await Banner.findOne({ _id: req.body.id });
                    if (!_.isEmpty(req.file)) {

                        fs.unlinkSync(`./public/admin/uploads/${banner_data.image}`)
                        updated_obj.image = req.file.filename
                    }

                    let updated_data = await Banner.findByIdAndUpdate(req.body.id, updated_obj)
                    if (updated_data && updated_data._id) {
                        req.flash('success', 'data updated');
                        return res.redirect('/admin/banner');

                    } else {
                        req.flash('error', 'somthing wrong');
                        return res.redirect('/admin/banner');

                    }
                }
            }
        } catch (error) {
            return error
        }
    }

    /**
     * @Method deleteBanner
     * @description to delete banner from db
    */
    async deleteBanner(req, res) {
        try {
            let exist_banner = await Banner.findByIdAndUpdate(req.params.id, { isDeleted: true })
            if (!_.isEmpty(exist_banner)) {
                req.flash('success', 'banner data deleted')
                return res.redirect('/admin/banner');
            } else {
                req.flash('error', 'banner data not deleted')
                return res.redirect('/admin/banner');
            }

        } catch (error) {
            return error
        }
    }


    /**
     * @Method statusBanner
     * @description change the status of banner to display on front page
     */
    async statusBanner(req, res) {
        try {
            let exist_banner = await Banner.findById(req.params.id)
            let update_status = exist_banner.status === "Active" ? "Inactive" : "Active";
            let updated_status = await Banner.findByIdAndUpdate(req.params.id, { status: update_status })
            if (!_.isEmpty(updated_status) && updated_status._id) {
                return res.redirect('/admin/banner');

            } else {
                return res.redirect('/admin/banner');
            }
        } catch (error) {
            return error
        }
    }

    /**
     * @Method viewBanner
     * @description to view banner data
     */
    async viewBanner(req, res) {
        try {
            let banner_details = await Banner.findById({ _id: req.params.id });
            let user_details = await User.findOne({ _id: req.user.id });

            res.render('view-banner', {
                title: "View Banner",
                banner_details,
                user_details
            })
        } catch (error) {
            return error
        }
    }
}

module.exports = new BannerController();