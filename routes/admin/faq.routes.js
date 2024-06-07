const router = require('express').Router()
const faqcontroller = require('../../controllers/admin/faq.controllers')
const usercontroller = require('../../controllers/admin/user.controllers')


// ------- create faq------

router.get('/',usercontroller.userAuth,faqcontroller.showFAQPage)

router.get('/add-faq',usercontroller.userAuth,faqcontroller.addFAQ)
router.post('/create-faq',usercontroller.userAuth,faqcontroller.createFAQ)

// -------update faq---------
router.get('/edit-faq/:id',usercontroller.userAuth,faqcontroller.editFAQ)
router.post('/update-faq',usercontroller.userAuth,faqcontroller.updateFAQ)

// -------delete faq--------
router.get('/delete-faq/:id',usercontroller.userAuth,faqcontroller.deleteFAQ)

// -------status faq--------
router.get('/status-faq/:id',usercontroller.userAuth,faqcontroller.statusFAQ)

// -------view faq--------
router.get('/view-faq/:id',usercontroller.userAuth,faqcontroller.viewFAQ)



module.exports=router