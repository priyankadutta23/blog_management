const router = require('express').Router()
const usercontroller = require('../../controllers/admin/user.controllers')
const blogcontroller = require('../../controllers/admin/blog.controllers')


router.get('/',usercontroller.userAuth,blogcontroller.blogListing)

router.get('/status-blog/:id',usercontroller.userAuth,blogcontroller.statusBlog)

router.get('/delete-blog/:id',usercontroller.userAuth,blogcontroller.deleteBlog)

router.get('/read-blog/:id',usercontroller.userAuth,blogcontroller.readBlog)


module.exports=router