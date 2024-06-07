const router=require('express').Router()
const usercontroller=require('../../controllers/front/users.controllers')

const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/front/uploads')
        // console.log(req.file);
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

router.get('/',usercontroller.login)
router.post('/create-login',usercontroller.createLogin)


router.get('/registration',usercontroller.registrationPage)
router.post('/create-registration',upload.single('image'),usercontroller.createRegistration)


router.get('/forget-password',usercontroller.forgetPassword)
router.post('/forget-password-update',usercontroller.forgetPasswordUpdate)

router.get('/logout',usercontroller.userauthJWT,usercontroller.logout)

router.get('/change-password',usercontroller.userauthJWT,usercontroller.changePassword)
router.post('/change-password-update',usercontroller.userauthJWT,usercontroller.changePasswordUpdate)

router.get('/edit-profile',usercontroller.userauthJWT,usercontroller.editProfile)
router.post('/edit-profile-update',upload.single('image'),usercontroller.userauthJWT,usercontroller.editProfileUpdate)







module.exports=router