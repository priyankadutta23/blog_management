const Category = require('../../models/category.models')
const Contacts = require('../../models/contact.models')
const mailer = require('../../config/mailer')
const User= require('../../models/user.models')


class ContactsController {

    /**
     * @Method showContactPage
     * @des to show contact page
     */
    async showContactPage(req, res) {
        try {
            let category_details = await Category.find({ status: "Active", isDeleted: false }).sort({ createdAt: -1 });
            if (!_.isEmpty(req.front_user)) {

                var front_user = await User.findById(req.front_user.id)
            }
            res.render('contact', {
                title: "Contact",
                category_details,
                success:req.flash('success'),
                error:req.flash('error'),
                front_user,


            })
        } catch (error) {
            throw error
        }
    }

    /**
     * @Method createContacts
     * @description to innsert contact data in db
     */
    async createContacts(req, res) {
        try {
            
            if (_.isEmpty(req.body.name.trim())) {
                req.flash('error', 'Please enter your name!');
                return  res.redirect('/contact');
            }
            if (_.isEmpty(req.body.email.trim())) {
                req.flash('error', 'Please enter your email!');
                return  res.redirect('/contact');
            }

            if (_.isEmpty(req.body.subject.trim())) {
                req.flash('error', 'Subject should not be empty!');
                return  res.redirect('/contact');
            }
            if (_.isEmpty(req.body.message.trim())) {
                req.flash('error', 'Message should not be empty!');
                return  res.redirect('/contact');
            }

            let save_data=await Contacts.create(req.body)
            let admin_email=process.env.ADMIN_EMAIL

            if(!_.isEmpty(save_data) && save_data._id){

                // await mailer.sendMail('dutta.priyanka013@gmail.com',save_data.email,`A new message`, `Thank you for visit our site!!`)
                // await mailer.sendMail('dutta.priyanka013@gmail.com',admin_email,`${save_data.subject}`, ` ${save_data.message}`)
                req.flash('success', 'massege sent successfully!!!')
                return  res.redirect('/contact');
            }else{
                
                req.flash('error', 'something wrong')
                return  res.redirect('/contact');
            }
        } catch (error) {
            return error
        }
    }


}

module.exports = new ContactsController();