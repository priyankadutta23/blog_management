const User = require('../../models/user.models')
const Contacts = require('../../models/contact.models')

class ContactsController {

    /**
     * @Method contactListing
     * @description to listing all contect details ,contact by users
     */

    async contactListing(req, res) {
        try {
            let user_details = await User.findOne({ _id: req.user.id });
            let all_contact = await Contacts.find({ isDeleted: false })

            res.render('contact_list', {
                title: "contact List",
                success: req.flash('success'),
                error: req.flash('error'),
                user_details,
                all_contact,

            })
        } catch (error) {
            return error
        }
    }

    /**
     * @Method deleteContact
     * @description to delete contact from database
     */
    async deleteContact(req, res) {
        try {
            let exist_contact = await Contacts.findByIdAndUpdate(req.params.id, { isDeleted: true })

            if (!_.isEmpty(exist_contact)) {
                req.flash('success', 'Contact Deleted Successfully')
                return res.redirect('/admin/contact');

            } else {
                req.flash('error', 'contact not Deleted')
                return res.redirect('/admin/contact');
            }

        } catch (error) {
            return error
        }
    }

    /**
     * @Method viewContact
     * @description to view the contact details
     */

    async viewContact(req, res) {
        try {
            let contact_details = await Contacts.findById({ _id: req.params.id });
            let user_details = await User.findOne({ _id: req.user.id });

            res.render('view-contact', {
                title: "View FAQ",
                contact_details,
                user_details
            })
        } catch (error) {
            return error
        }
    }
}
   
  

module.exports = new ContactsController();