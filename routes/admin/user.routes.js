const router = require('express').Router()
const usercontroller = require('../../controllers/admin/user.controllers')

const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/admin/uploads')
    },

    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + 'my_img' + path.extname(file.originalname))
    }
})

const max_size = 1024 * 1024;
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.filename == 'image/jpg' || file.mimetype == 'image/png' || file.mimetype == 'image/gif' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/svg') {
            cb(null, true)
        } else {
            cb(null, false);
            return cb(new error('only jpg,jpeg,png and svg file allowed'))
        }
    },
    limits: max_size

})

router.get('/', usercontroller.showLoginPage)
router.post('/login', usercontroller.login)

router.get('/register', usercontroller.showRegisterPage)
router.post('/register-insert', upload.single('image'), usercontroller.registerInsert)

router.get('/dashboard',usercontroller.userAuth, usercontroller.showDashboardPage)

router.get('/profile',usercontroller.userAuth,usercontroller.showProfileEditPage)
router.post('/profile-update',usercontroller.userAuth, upload.single('image'), usercontroller.profileUpdate)

router.get('/password-change',usercontroller.userAuth,usercontroller.showPasswordChangePage)
router.post('/password-changed',usercontroller.userAuth, usercontroller.passwordChanged)

router.get('/logout',usercontroller.userAuth, usercontroller.logout)

router.get('/forgot-password',usercontroller.showForgetPasswordPage)
router.post('/forgot-password-update',usercontroller.forgotPassword)

router.get('/users',usercontroller.userAuth,usercontroller.showUserList)

router.get('/status-users/:id',usercontroller.userAuth,usercontroller.statusUsers)

router.get('/delete-users/:id',usercontroller.userAuth,usercontroller.deleteUsers)




module.exports = router