const router = require('express').Router()
const contactcontroller = require('../../controllers/admin/contacts.controllers')
const usercontroller = require('../../controllers/admin/user.controllers')


// ------- create category------

router.get('/',usercontroller.userAuth,contactcontroller.contactListing)

router.get('/delete-contact/:id',usercontroller.userAuth,contactcontroller.deleteContact)

router.get('/view-contact/:id',usercontroller.userAuth,contactcontroller.viewContact)


module.exports=router