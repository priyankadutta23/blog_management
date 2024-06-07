const User = require('../../models/user.models')
const FAQ = require('../../models/faq.models')

class FAQController {

     /**
    * @Method showFAQPage
    * @description to show FAQ list
    */
     async showFAQPage(req, res) {
        try {
            let user_details = await User.findOne({ _id: req.user.id });
            let all_faq = await FAQ.find({ isDeleted: false }).sort({ createdAt: -1 });

            res.render('faq', {
                title: "FAQ Page",
                success: req.flash('success'),
                error: req.flash('error'),
                user_details,
                all_faq
            })

        } catch (error) {
            return error
        }
    }

    /**
     * @Method addFAQ
     * @description show faq form
     */
    async addFAQ(req, res) {

        try {
            let user_details = await User.findOne({ _id: req.user.id });

            res.render('add-faq', {
                title: "FAQ",
                user_details,
                success: req.flash('success'),
                error: req.flash('error'),
            })

        } catch (error) {
            return error
        }
    }
    /**
    * @Method createFAQ
    * @description insert faq in  db
    */
    async createFAQ(req, res) {

        try {
            if (_.isEmpty(req.body.question.trim())) {
                req.flash('error', 'Question should not be empty!');
                return res.redirect('/admin/faq/add-faq');
            }

            if (_.isEmpty(req.body.answer.trim())) {
                req.flash('error', 'Answer should not be empty!');
                return res.redirect('/admin/faq/add-faq');
            }

            let exist_question = await FAQ.find({ question: req.body.question })

            if (!_.isEmpty(exist_question)) {
                req.flash('error', 'Question already exist')
                return res.redirect('/admin/faq/add-faq');
            } else {
                let exist_answer = await FAQ.find({ answer: req.body.answer })

                if (!_.isEmpty(exist_answer)) {
                    req.flash('error', 'Answer already exist')
                    return res.redirect('/admin/faq/add-faq');
                }
                else {
                    let save_data = await FAQ.create(req.body)
                    if (!_.isEmpty(save_data) && save_data._id) {
                        req.flash('success', 'FAQ saved')
                        return res.redirect('/admin/faq');

                    } else {
                        req.flash('error', 'FAQ not saved')
                        return res.redirect('/admin/faq/add-faq');

                    }
                }
            }

        } catch (error) {
            return error
        }
    }
    /**
     * @Method editFAQ
     * @description show edit FAQ form
     */
    async editFAQ(req, res) {
        try {
            let user_details = await User.findOne({ _id: req.user.id });

            let response = await FAQ.findById({ _id: req.params.id })
            res.render('edit-faq', {
                title: "Edit FAQ",
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
     * @Method updateFAQ
     * @description update
     */
    async updateFAQ(req, res) {
        try {
            if (_.isEmpty(req.body.question.trim())) {
                req.flash('error', 'Question should not be empty!');
                return res.redirect('/admin/faq');
            }

            if (_.isEmpty(req.body.answer.trim())) {
                req.flash('error', 'Answer should not be empty!');
                return res.redirect('/admin/faq');
            }
            let exist_question = await FAQ.find({ question: req.body.question, _id: { $ne: req.body.id } })

            if (!_.isEmpty(exist_question)) {
                req.flash('error', 'Question already exist')
                return res.redirect('/admin/faq');
            } else {
                let exist_answer = await FAQ.find({ answer: req.body.answer, _id: { $ne: req.body.id } })

                if (!_.isEmpty(exist_answer)) {
                    req.flash('error', 'Answer already exist')
                    return res.redirect('/admin/faq');
                }
                else {
                    let update_obj = {
                        question: req.body.question,
                        answer: req.body.answer
                    }
                    let updated_faq = await FAQ.findByIdAndUpdate(req.body.id, update_obj)
                    if (!_.isEmpty(updated_faq) && updated_faq._id) {
                        req.flash('success', 'FAQ updated successfully')
                        return res.redirect('/admin/faq');

                    } else {
                        req.flash('error', 'FAQ not updated')
                        return res.redirect('/admin/faq');

                    }
                }
            }
        } catch (error) {
            return error
        }
    }


    /**
     * @Method deleteFAQ
     * @description delete FAQ from database
     */
    async deleteFAQ(req, res) {
        try {
            let exist_faq = await FAQ.findByIdAndUpdate(req.params.id, { isDeleted: true })

            if (!_.isEmpty(exist_faq)) {
                req.flash('success', 'FAQ Deleted Successfully')
                return res.redirect('/admin/faq');

            } else {
                req.flash('error', 'FAQ not Deleted')
                return res.redirect('/admin/faq');
            }
        } catch (error) {
            return error
        }
    }

    /**
     * @Method statusFAQ
     * @description status change of FAQ
     */
    async statusFAQ(req, res) {
        try {
            let exist_faq = await FAQ.findById(req.params.id)
            let update_status = exist_faq.status === "Active" ? "Inactive" : "Active";
            let updated_status = await FAQ.findByIdAndUpdate(req.params.id, { status: update_status })
            if (!_.isEmpty(updated_status) && updated_status._id) {
                return res.redirect('/admin/faq');

            } else {
                return res.redirect('/admin/faq');

            }
        } catch (error) {
            return error
        }
    }

    /**
     * @Method viewFAQ
     * @description to view faq page
     */

    async viewFAQ(req, res) {
        try {
            let faq_details = await FAQ.findById({ _id: req.params.id });
            let user_details = await User.findOne({ _id: req.user.id });

            res.render('view-faq', {
                title: "View FAQ",
                faq_details,
                user_details
            })
        } catch (error) {
            return error
        }
    }
}

module.exports = new FAQController();