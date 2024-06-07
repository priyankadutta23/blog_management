const router = require('express').Router()
const bannercontroller = require('../../controllers/admin/banner.controllers')
const usercontroller = require('../../controllers/admin/user.controllers')


const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/admin/uploads')
        // console.log(file, 'file');
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


// ------- create banner------

router.get('/',usercontroller.userAuth,bannercontroller.showBannerPage)
router.get('/add-banner',usercontroller.userAuth,bannercontroller.addBanner)
router.post('/create-banner',usercontroller.userAuth,upload.single('image'),bannercontroller.createBanner)

// // -------update banner---------
router.get('/edit-banner/:id',usercontroller.userAuth,bannercontroller.editBanner)
router.post('/update-banner',usercontroller.userAuth,upload.single('image'),bannercontroller.updateBanner)

// // -------delete banner--------
router.get('/delete-banner/:id',usercontroller.userAuth,bannercontroller.deleteBanner)

// // -------status banner--------
router.get('/status-banner/:id',usercontroller.userAuth,bannercontroller.statusBanner)

// // -------view banner--------
router.get('/view-banner/:id',usercontroller.userAuth,bannercontroller.viewBanner)





module.exports=router