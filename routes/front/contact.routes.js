const router=require('express').Router()
const contactscontroller=require('../../controllers/front/contact.controllers')

router.get('/',contactscontroller.showContactPage)

router.post('/create-contacts',contactscontroller.createContacts)
module.exports=router