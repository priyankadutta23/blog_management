const router=require('express').Router()
const blogcontroller=require('../../controllers/front/blogs.controllers')
const usercontroller = require('../../controllers/front/users.controllers')

const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/front/uploads')
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
   
router.get('/',usercontroller.userauthJWT,blogcontroller.addBlog)
router.post('/create-blog',usercontroller.userauthJWT, upload.single('image'),blogcontroller.CreateBlog)

router.get('/blog-list',usercontroller.userauthJWT,blogcontroller.showBlogList)

router.get('/edit-blog/:id',usercontroller.userauthJWT,blogcontroller.editBlog)
router.post('/update-blog',usercontroller.userauthJWT,upload.single('image'),blogcontroller.updateBlog)

router.get('/view-blog/:id',usercontroller.userauthJWT,blogcontroller.viewBlog)

module.exports=router