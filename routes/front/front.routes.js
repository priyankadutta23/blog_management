const router=require('express').Router()
const fontcontroller=require('../../controllers/front/front.controllers')
const usercontroller=require('../../controllers/front/users.controllers')


router.get('/',fontcontroller.showIndex)
router.get('/about',fontcontroller.showAbout)
router.get('/see-post/:id',fontcontroller.seePost)
router.get('/category-blog/:id',fontcontroller.categoryBlog)
router.get('/banner-post/:id',fontcontroller.bannerPost)


module.exports=router