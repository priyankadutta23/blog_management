const router = require('express').Router()
const categorycontroller = require('../../controllers/admin/category.controllers')
const usercontroller = require('../../controllers/admin/user.controllers')



router.get('/',usercontroller.userAuth,categorycontroller.showCategoryPage)
// ------- create category------

router.get('/add-category',usercontroller.userAuth,categorycontroller.addCategory)
router.post('/create-category',usercontroller.userAuth,categorycontroller.createCategory)

// // // -------update category---------
router.get('/edit-category/:id',usercontroller.userAuth,categorycontroller.editCategory)
router.post('/update-category',usercontroller.userAuth,categorycontroller.updateCategory)

// // // -------delete category--------
router.get('/delete-category/:id',usercontroller.userAuth,categorycontroller.deleteCategory)

// // // -------status category--------
router.get('/status-category/:id',usercontroller.userAuth,categorycontroller.statusCategory)


module.exports=router