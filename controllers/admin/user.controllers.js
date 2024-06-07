const User = require('../../models/user.models')
const Role = require('../../models/role.models')
const fs = require('fs')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mailer = require('../../config/mailer')
const os = require('os')
const randomString = require('randomstring');
const { reset } = require('nodemon');


class AdminController {

    /**
  * @Method userAuth
  * @description to authenticate the user
  */

    async userAuth(req, res, next) {
        try {
            if (!_.isEmpty(req.user)) {
                next();
            } else {
                res.redirect('/admin')
            }
        } catch (error) {
            return error
        }
    }

    /**
     * @Method showDashboardPage
     * @description to show dashboard page
     */
    async showDashboardPage(req, res) {
        try {
            let user_details = await User.findOne({ _id: req.user.id });
            res.render('dashboard', {
                title: "Home",
                user_details
            })
        } catch (error) {
            return error
        }
    }

      /**
     * @Method showUserList
     * @description to show users listing
     */
      async showUserList(req, res) {
        try {
            let user_details = await User.findOne({ _id: req.user.id });
            let role_details=await Role.findOne({role_group:'user'})
            
            let all_users=await User.find({role:{$eq:role_details._id}})
            res.render('users', {
                title: "Users List",
                all_users,
                user_details,
                success: req.flash('success'),
                error: req.flash('error')

            })

        } catch (error) {
            return error
        }
    }

    /**
     * @Method statusUsers
     * @description to change the status of users for get paermission to login
     */
    async statusUsers(req,res){
        try {
            let exist_user = await User.findById(req.params.id)
            let update_status = exist_user.status === "Inactive" ? "Active" : "Inactive";
            let updated_status = await User.findByIdAndUpdate(req.params.id, { status: update_status })
            if (!_.isEmpty(updated_status) && updated_status._id) {
                // await mailer.sendMail('dutta.priyanka013@gmail.com', exist_user.email, "Confidential", `<h1>your ac is activated now you can login </h1>`)

                return res.redirect('/admin/users');

            } else {
                return res.redirect('/admin/users');

            }
        } catch (error) {
            return error
        }
    }

    /**
     * @Method deleteUsers
     * @description to delete users
     */

    async deleteUsers(req,res){
        try {
            let exist_user = await User.findByIdAndUpdate(req.params.id, { isDeleted: true })

            if (!_.isEmpty(exist_user)) {
                req.flash('success', 'User Deleted Successfully')
                return res.redirect('/admin/users');

            } else {
                req.flash('error', 'User not Deleted')
                return res.redirect('/admin/users');
            }
            
        } catch (error) {
            return error
        }
    }

    /**
     * @Method showLoginPage
     * @description to show login page
     */
    async showLoginPage(req, res) {
        try {
            res.render('login', {
                title: "Login Page",
                success: req.flash('success'),
                error: req.flash('error')
            })

        } catch (error) {
            return error
        }
    }

    /**
  * @Method login
  * @description to login
  */
    async login(req, res) {
        try {


            if (_.isEmpty(req.body.email.trim())) {
                req.flash('error', 'Please enter your email!');
                return res.redirect('/admin');
            }

            if (_.isEmpty(req.body.password.trim())) {
                req.flash('error', 'Please enter password!');
                return res.redirect('/admin');
            }

            let user_exist = await User.findOne({ email: req.body.email })
            let role_details = await Role.findOne({ role_group: 'admin' })

            const device = os.type();        // -----------device name-----------
            const dateTime = new Date().toLocaleString()     //--------------current date and time-------

            if (_.isEmpty(user_exist)) {

                req.flash('error', 'email is not exist')
                return res.redirect('/admin');
            }

            if (user_exist.role.toString() === role_details._id.toString()) {

                const has_password = user_exist.password

                if (bcrypt.compareSync(req.body.password, has_password)) {
                    const token = jwt.sign({ id: user_exist._id }, 'A1B1C1D1', { expiresIn: '1d' })
                    res.cookie("user_token", token);

                    // await mailer.sendMail('dutta.priyanka013@gmail.com', user_exist.email, "Confidential", `your ac has been login from ${device} device at ${dateTime} `)

                    return res.redirect('/admin/dashboard');
                } else {
                    req.flash('error', 'password not match')
                    return res.redirect('/admin');
                }
            } else {
                req.flash('error', 'could not log in')
                return res.redirect('/admin');
            }
        } catch (error) {
            throw error
        }
    }

    /**
    * @Method showPasswordChangePage
    * @description to show password change page
    */
    async showPasswordChangePage(req, res) {
        try {
            let response = await User.findOne({ _id: req.user.id });
            let user_details = await User.findOne({ _id: req.user.id });

            res.render('password-change', {
                title: "Password Change",
                response,
                user_details,
                success: req.flash('success'),
                error: req.flash('error')
            })
        } catch (error) {
            return error
        }
    }

    /**
     *  @Method passwordChanged
     * @description to changed exist password
    */
    async passwordChanged(req, res) {
        try {
            if (_.isEmpty(req.body.old_password.trim())) {
                req.flash('error', 'Old password should not be empty!');
                return res.redirect('/admin/password-change');
            }
            if (_.isEmpty(req.body.new_password.trim())) {
                req.flash('error', 'New Passord should not be empty!');
                return res.redirect('/admin/password-change');
            }
            if (_.isEmpty(req.body.confirm_password.trim())) {
                req.flash('error', 'Confirmation password should not be empty!');
                return res.redirect('/admin/password-change');
            }

            let exist_data = await User.findById(req.user.id)

            if (!_.isEmpty(exist_data)) {

                if (bcrypt.compareSync(req.body.old_password, exist_data.password)) {

                    if (req.body.new_password !== req.body.confirm_password) {
                        req.flash('error', 'Confirm password not match!')
                        return res.redirect('/admin/password-change')
                    } else {
                        let update_paswd = await bcrypt.hashSync(req.body.new_password, bcrypt.genSaltSync(10))

                        await User.updateOne({ _id: req.user.id }, { password: update_paswd })

                        // await mailer.sendMail('dutta.priyanka013@gmail.com', exist_data.email, "Password updated Successfully", "password updation Completed!!!")
                        req.flash('success', 'Password Changed Successfully!')

                        return res.redirect('/admin');
                    }
                } else {
                    req.flash('error', 'Old Password not match!')

                    return res.redirect('/admin/password-change');
                }
            } else {
                req.flash('error', 'Data not found in db!')
                return res.redirect('/admin/password-change')
            }

        } catch (err) {
            throw err;
        }
    }

    /**
   * @Method showProfileEditPage
   * @description to show profile update page
   */
    async showProfileEditPage(req, res) {
        try {
            let response = await User.findById({ _id: req.user.id })
            let user_details = await User.findOne({ _id: req.user.id });

            res.render('profile', {
                title: "profile page",
                success: req.flash('success'),
                error: req.flash('error'),
                response,
                user_details
            })

        } catch (error) {
            return error
        }
    }

    /**
     *  @Method profileUpdate
     * @description to update profile
     */
    async profileUpdate(req, res) {
        try {
            if (_.isEmpty(req.body.first_name.trim())) {
                req.flash('error', 'First name should not be empty!');
                return res.redirect('/admin/profile');
            }
            if (_.isEmpty(req.body.last_name.trim())) {
                req.flash('error', 'Last name should not be empty!');
                return res.redirect('/admin/profile');
            }
            if (_.isEmpty(req.body.email.trim())) {
                req.flash('error', 'Email should not be empty!');
                return res.redirect('/admin/profile');
            }

            let check_email = await User.find({ email: req.body.email, _id: { $ne: req.user.id } })
            if (!_.isEmpty(check_email)) {

                req.flash('error', 'Email already exist')
                return res.redirect('/admin/profile')
            } else {

                let update_obj = {
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    full_name: `${req.body.first_name} ${req.body.last_name}`,
                    email: req.body.email
                }
                let user_data = await User.findOne({ _id: req.body.id });
                if (!_.isEmpty(req.file)) {

                    fs.unlinkSync(`./public/admin/uploads/${user_data.image}`)
                    update_obj.image = req.file.filename
                }

                let update_data = await User.findByIdAndUpdate({ _id: req.user.id }, update_obj)
                if (update_data && update_data._id) {

                    // await mailer.sendMail('dutta.priyanka013@gmail.com', update_data.email, "Profile Updation", "Your profile successfully updated!!!")

                    req.flash('success', 'Data Updated successfully')
                    return res.redirect('/admin/profile')

                } else {
                    req.flash('error', 'Data not Updated, somthing wrong')
                    return res.redirect('/admin/profile')

                }
            }

        } catch (error) {
            return error
        }
    }   


    /**
     * @Method showRegisterPage
     * @description to show register page
     */
    async showRegisterPage(req, res) {
        try {

            res.render('register', {
                title: "Register Page",
                success: req.flash('success'),
                error: req.flash('error')
            })
        } catch (error) {
            return error
        }
    }

    /**
     * @Method registerInsert
     * @description to  data insert in db for registration
     */
    async registerInsert(req, res) {
        try {
            if (_.isEmpty(req.body.first_name.trim())) {
                req.flash('error', 'First name should not be empty!');
                return res.redirect('/admin/register');
            }
            if (_.isEmpty(req.body.last_name.trim())) {
                req.flash('error', 'Last name should not be empty!');
                return res.redirect('/admin/register');
            }
            if (_.isEmpty(req.body.email.trim())) {
                req.flash('error', 'Email should not be empty!');
                return res.redirect('/admin/register');
            }
            if (_.isEmpty(req.body.password.trim())) {
                req.flash('error', 'Password should not be empty!');
                return res.redirect('/admin/register');
            }
            if (_.isEmpty(req.body.confirm_password.trim())) {
                req.flash('error', 'Confirmation password should not be empty!');
                return res.redirect('/admin/register');
            }

            let email_exist = await User.find({ email: req.body.email })

            if (!_.isEmpty(email_exist)) {
                req.flash('error', 'Email already exist')
                return res.redirect('/admin/register');

            }
            let pswd = req.body.password
            if (req.body.password !== req.body.confirm_password) {
                req.flash('error', 'password should be same')
                return res.redirect('/admin/register');
            }
            req.body.full_name = `${req.body.first_name} ${req.body.last_name}`
            req.body.image = req.file.filename;
            let role_details = await Role.findOne({ role_group: 'admin' })
            req.body.role = role_details._id

            req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
            let save_data = await User.create(req.body);
            if (save_data && save_data._id) {
                // await mailer.sendMail('dutta.priyanka013@gmail.com', save_data.email, "Registration", `Your registraion successfully completed!!!.
                //  and your id is ${save_data.email} and password is ${pswd}`)

                req.flash('success', 'Registration done')
                return res.redirect('/admin/register');
            }
            else {
                req.flash('error', 'Registation not done')
                return res.redirect('/admin/register');
            }

        } catch (error) {
            throw error
        }
    }

    /**
    * @Method logout
    * @description to logout
    */
    async logout(req, res) {
        try {
            res.clearCookie('user_token')
            return res.redirect('/admin')

        } catch (error) {
            return error
        }
    }

    /**
   * @Method showForgetPasswordPage
   * @description to show forget password page
   */
    async showForgetPasswordPage(req, res) {
        try {
            res.render('forgot-password', {
                title: "forgot passwd Page",
                success: req.flash('success'),
                error: req.flash('error')
            })

        } catch (error) {
            return error
        }
    }

    /**
   *  @Method forgotPassword
   * @description to to get new password
   */
    async forgotPassword(req, res) {
        try {

            if (_.isEmpty(req.body.email.trim())) {
                req.flash('error', 'Email should not be empty!');
                return res.redirect('/admin/forgot-password');
            }
            let user_details = await User.findOne({ email: req.body.email });
            if (_.isEmpty(user_details)) {
                req.flash('error', 'Email is not exist!');
                return res.redirect('/admin/forgot-password');
            }
            let role_details = await Role.findOne({ role_group: 'admin' })
            if (user_details.role.toString() !== role_details._id.toString()) {
                req.flash('error', 'You could not change password!');
                return res.redirect('/admin/forgot-password');
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

                return res.redirect('/admin/forgot-password');
            } else {
                req.flash('error', 'Password is not update!');
                return res.redirect('/admin/forgot-password');
            }
        } catch (err) {
            throw err;
        }
    }

    

}

module.exports = new AdminController();