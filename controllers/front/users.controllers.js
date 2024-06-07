const User = require('../../models/user.models')
const Category=require('../../models/category.models')
const Blog=require('../../models/blog.models')
const Role = require('../../models/role.models')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mailer = require('../../config/mailer')
const os = require('os')
const fs = require('fs')
const randomString = require('randomstring');


class UserController {

    /**
     * @Method userauthJWT
     * @description to authenticate the user
     */

    async userauthJWT(req, res, next) {
        try {
            // console.log(req.front_user);
            if (!_.isEmpty(req.front_user)) {
                next();
            } else {
                res.redirect('/')
            }
        } catch (error) {
            return error
        }
    }
    /**
     * @Method registrationPage
     * @description show registration page of user
     */

    async registrationPage(req, res) {
        try {
            res.render('registration', {
                title: "Registration Page",
                success: req.flash('success'),
                error: req.flash('error'),
            })
        } catch (error) {
            throw error
        }
    }

    /**
     * @Method createRegistration
     * @description to registration for users
     */

    async createRegistration(req, res) {
        try {
            if (_.isEmpty(req.body.first_name.trim())) {
                req.flash('error', 'First should not be empty!');
                return res.redirect('/front-user');
            }
            if (_.isEmpty(req.body.last_name.trim())) {
                req.flash('error', 'Last Name should not be empty!');
                return res.redirect('/front-user/registration');
            }
            if (_.isEmpty(req.body.email.trim())) {
                req.flash('error', 'Email should not be empty!');
                return res.redirect('/front-user/registration');
            }
            if (_.isEmpty(req.body.contact.trim())) {
                req.flash('error', 'Contact should not be empty!');
                return res.redirect('/front-user/registration');
            }
            if (_.isEmpty(req.body.password.trim())) {
                req.flash('error', 'Password should not be empty!');
                return res.redirect('/front-user/registration');
            }
            if (_.isEmpty(req.body.confirm_password.trim())) {
                req.flash('error', 'Confirm password should not be empty!');
                return res.redirect('/front-user/registration');
            }
            if (_.isEmpty(req.body.address.trim())) {
                req.flash('error', 'Address should not be empty!');
                return res.redirect('/front-user/registration');
            }
            let email_exist = await User.find({ email: req.body.email })

            if (!_.isEmpty(email_exist)) {
                req.flash('error', 'Email already exist')
                return res.redirect('/front-user/registration');
            }
            let exist_contact = await User.find({ contact: req.body.contact })

            if (!_.isEmpty(exist_contact)) {
                req.flash('error', 'Contact already exist')
                return res.redirect('/front-user/registration');

            }
            if (req.body.password !== req.body.confirm_password) {
                req.flash('error', 'password should be same')
                return res.redirect('/front-user/registration');
            }
            req.body.full_name = `${req.body.first_name} ${req.body.last_name}`
            req.body.image = req.file.filename;

            let role_details = await Role.findOne({ role_group: 'user' })
            req.body.role = role_details._id
            req.body.status="Inactive"

            let pswd = req.body.password

            req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
            let save_data = await User.create(req.body);
            if (!_.isEmpty(save_data) && save_data._id) {
                // await mailer.sendMail('dutta.priyanka013@gmail.com', save_data.email, "registration", `Your registraion successfully completed!!!.
                // and your id is ${save_data.email} and password is ${pswd} `)

                req.flash('success', 'User registration successfull.')
                return res.redirect('/front-user/registration');

            } else {
                req.flash('error', 'somthing wrong')
                return res.redirect('/front-user/registration');
            }

        } catch (error) {
            throw error
        }
    }

    /**
     * @Method login
     * @description to show login page
     */
    async login(req, res) {
        try {
            res.render('log-in', {
                title: "User Login",
                success: req.flash('success'),
                error: req.flash('error'),
            })
        } catch (error) {
            throw error
        }
    }

    /**
     * @Method createLogin
     * @description to login for users
     */
    async createLogin(req, res) {
        try {

            if (_.isEmpty(req.body.email.trim())) {
                req.flash('error', 'Please enter your email!');
                return res.redirect('/front-user');
            }
            if (_.isEmpty(req.body.password.trim())) {
                req.flash('error', 'Please enter password!');
                return res.redirect('/front-user');
            }

            let user_exist = await User.findOne({ email: req.body.email })
            let role_details = await Role.findOne({ role_group: 'user' })

            if (_.isEmpty(user_exist)) {

                req.flash('error', 'email is not exist')
                return res.redirect('/front-user');
            }
            const device = os.type();        // -----------device name-----------
            const dateTime = new Date().toLocaleString()     //--------------current date and time-------


            if (user_exist.role.toString() === role_details._id.toString() && user_exist.status==="Active") {

                const has_password = user_exist.password

                if (bcrypt.compareSync(req.body.password, has_password)) {
                    const token = jwt.sign({ id: user_exist._id }, 'A1B1C1D1', { expiresIn: '1d' })
                    res.cookie("front_user_token", token);

                    // await mailer.sendMail('dutta.priyanka013@gmail.com', user_exist.email, "Confidential", `your ac has been login from ${device} device at ${dateTime} `)
                    return res.redirect('/');
                } else {
                    req.flash('error', 'password not match')
                    return res.redirect('/front-user');
                }
            } else {
                req.flash('error', 'Your account is not activate')
                return res.redirect('/front-user');
            }
        } catch (error) {
            throw error
        }
    }

    /**
     * @Method logout
     * @description to logout
     */
  
    async logout(req,res){
        try {
            res.clearCookie('front_user_token')
            return res.redirect('/')
        } catch (error) {
            return error
        }
    }

    /**
     * @Method forgetPassword
     * @description to get password
     */

    async forgetPassword(req,res){
        try {
            res.render('forget-password',{
                title:'Forget password',
                success: req.flash('success'),
                error: req.flash('error'),
            })
        } catch (error) {
            throw error
        }
    }

    /**
     * @Method forgetPasswordUpdate
     * @description get new password when current password forget
     */
    async forgetPasswordUpdate(req,res){
        try {

            if (_.isEmpty(req.body.email.trim())) {
                req.flash('error', 'Email should not be empty!');
                return res.redirect('/');
            }
            let user_details = await User.findOne({ email: req.body.email });
            if (_.isEmpty(user_details)) {
                req.flash('error', 'Email is not exist!');
                return res.redirect('/');
            }
            let role_details = await Role.findOne({ role_group: 'user' })
            if (user_details.role.toString() !== role_details._id.toString()) {
                req.flash('error', 'You could not change password!');
                return res.redirect('/');
            }

            let random = randomString.generate({
                length: 5,
                charset: 'alphabetic'
            });

            let sync_forget_password = await bcrypt.hashSync(random, bcrypt.genSaltSync(10))

            let update_forget_password = await User.findByIdAndUpdate({ _id: user_details._id }, { password: sync_forget_password })

            if (!_.isEmpty(update_forget_password) && update_forget_password._id) {
                // await mailer.sendMail('dutta.priyanka013@gmail.com', user_details.email, "Forget Password", `As You forget your password now you can login in this password ${random}`)
                req.flash('success', 'Password send in your email!');

                return res.redirect('/front-user');
            } else {
                req.flash('error', 'Password is not update!');
                return res.redirect('/');
            }
        } catch (error) {
            throw error
        }
    }

    /**
     * @Method changePassword
     * @description to change password
     */
    async changePassword(req,res){
        try {
            let category_details = await Category.find({ status: "Active", isDeleted: false }).sort({ createdAt: -1 });
            if (!_.isEmpty(req.front_user)) {

                var front_user = await User.findById(req.front_user.id)
            }
            res.render('change-password',{
                title:"password change",
                success: req.flash('success'),
                error: req.flash('error'),
                category_details,
                front_user
            })
        } catch (error) {
            return error
        }
    }

    /**
     * @Method changePasswordUpdate
     * @descrption to change password of the user
     */
    async changePasswordUpdate(req,res){
        try {
            if (_.isEmpty(req.body.old_password.trim())) {
                req.flash('error', 'Old password should not be empty!');
                return res.redirect('/front-user/change-password');
            }
            if (_.isEmpty(req.body.new_password.trim())) {
                req.flash('error', 'New Passord should not be empty!');
                return res.redirect('/front-user/change-password');
            }
            if (_.isEmpty(req.body.confirm_password.trim())) {
                req.flash('error', 'Confirmation password should not be empty!');
                return res.redirect('/front-user/change-password');
            }

            let exist_data = await User.findById(req.front_user.id)

            if (!_.isEmpty(exist_data)) {

                if (bcrypt.compareSync(req.body.old_password, exist_data.password)) {

                    if (req.body.new_password !== req.body.confirm_password) {
                        req.flash('error', 'Confirm password not match!')
                        return res.redirect('/front-user/change-password')
                    } else {
                        let update_paswd = await bcrypt.hashSync(req.body.new_password, bcrypt.genSaltSync(10))

                        await User.updateOne({ _id: req.front_user.id }, { password: update_paswd })

                        // await mailer.sendMail('dutta.priyanka013@gmail.com', exist_data.email, "Password updated Successfully", "password updation Completed!!!")
                        req.flash('success', 'Password Changed Successfully!')

                        return res.redirect('/front-user');
                    }
                } else {
                    req.flash('error', 'Old Password not match!')

                    return res.redirect('/front-user/change-password');
                }
            } else {
                req.flash('error', 'Data not found in db!')
                return res.redirect('/front-user/change-password')
            }

        }catch (error) {
            return error
        }
    }

    /**
     * @Method editProfile
     * @description show edit the profile form
     */
    async editProfile(req,res){
        try {
            let response = await User.findById({ _id: req.front_user.id })

            let category_details = await Category.find({ status: "Active", isDeleted: false }).sort({ createdAt: -1 });

            if (!_.isEmpty(req.front_user)) {

                var front_user = await User.findById(req.front_user.id)
            }
            res.render('edit-profile',{
                title:"profile edit",
                success: req.flash('success'),
                error: req.flash('error'),
                category_details,
                front_user,
                response
            })
        } catch (error) {
            throw error
        }
    }

    /**
     * @Method editProfileUpdate
     * @description update profile
     */
    async editProfileUpdate(req,res){
        try {
            if (_.isEmpty(req.body.first_name.trim())) {
                req.flash('error', 'First name should not be empty!');
                return res.redirect('/front-user/edit-profile');
            }
            if (_.isEmpty(req.body.last_name.trim())) {
                req.flash('error', 'Last name should not be empty!');
                return res.redirect('/front-user/edit-profile');
            }
            if (_.isEmpty(req.body.email.trim())) {
                req.flash('error', 'Email should not be empty!');
                return res.redirect('/front-user/edit-profile');
            }
            if (_.isEmpty(req.body.contact.trim())) {
                req.flash('error', 'contact should not be empty!');
                return res.redirect('/front-user/edit-profile');
            }

            let check_email = await User.find({ email: req.body.email, _id: { $ne: req.front_user.id } })
            if (!_.isEmpty(check_email)) {

                req.flash('error', 'Email already exist')
                return res.redirect('/front-user/edit-profile');
            } 
            
            let check_contact = await User.find({ contact: req.body.contact, _id: { $ne: req.front_user.id } })
            if (!_.isEmpty(check_contact)) {

                req.flash('error', 'contact already exist')
                return res.redirect('/front-user/edit-profile');
            }else {

                let update_obj = {
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    full_name: `${req.body.first_name} ${req.body.last_name}`,
                    email: req.body.email,
                    contact: req.body.contact

                }
                let user_data = await User.findOne({ _id: req.body.id });
                console.log(req.file);
                if (!_.isEmpty(req.file)) {

                    fs.unlinkSync(`./public/front/uploads/${user_data.image}`)
                    update_obj.image = req.file.filename
                }

                let update_data = await User.findByIdAndUpdate({ _id: req.front_user.id }, update_obj)
                if (update_data && update_data._id) {

                    // await mailer.sendMail('dutta.priyanka013@gmail.com', update_data.email, "Profile Updation", "Your profile successfully updated!!!")

                    req.flash('success', 'Data Updated successfully')
                    return res.redirect('/front-user/edit-profile');

                } else {
                    req.flash('error', 'Data not Updated, somthing wrong')
                    return res.redirect('/front-user/edit-profile');

                }
            }

        } catch (error) {
            throw error
        }
    }

     
}


module.exports = new UserController();