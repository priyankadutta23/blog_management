const express=require('express')
const app=express();
require('dotenv').config();
const path=require('path');
_ = require('underscore');
const bodyParser=require('body-parser');
const cookieParser=require('cookie-parser')


app.use(express.static(path.join(__dirname,'/public')))
app.set('view engine', 'ejs')
app.set('views', [__dirname + '/views/front', __dirname + '/views/admin']);

const flash= require('connect-flash')
const session= require('express-session')

app.use(session({
    secret: 'A1B1C1D1',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: true
}))
app.use(flash())
app.use(cookieParser());



app.use(bodyParser.urlencoded({
    extended:true
}))
const jwtAuth=require('./middlewares/auth_jwt.middleware');
app.use([jwtAuth.userauthJWT,jwtAuth.authJWT])


// ----------------------------------------------------admin routes---------------------------------------------------


// ---------------------------user module---------------
const userRouter = require('./routes/admin/user.routes');   
app.use('/admin',userRouter);

// ---------------------------FAQ module---------------
const faqRouter = require('./routes/admin/faq.routes');
app.use('/admin/faq',faqRouter);

// ---------------------------BANNER module---------------
const bannerRouter = require('./routes/admin/banner.routes');
app.use('/admin/banner',bannerRouter);

// ------------------Category module-------------------------
const categoryRouter = require('./routes/admin/category.routes');
app.use('/admin/categories',categoryRouter);

// -------------------------contact module----------
const contactRouter = require('./routes/admin/contacts.routes');
app.use('/admin/contact',contactRouter);

// -------------------------Blog Module----------------
const blogRouter = require('./routes/admin/blog.routes');
app.use('/admin/blog',blogRouter);



// -------------------------------------------------front routes-------------------------------------------------------

const frontRouter = require('./routes/front/front.routes');
app.use(frontRouter);

// ---------------------------user module---------------
const frontUserRouter = require('./routes/front/users.routes');
app.use('/front-user',frontUserRouter);

// -------------------------contact module----------
const frontContactRouter = require('./routes/front/contact.routes');
app.use('/contact',frontContactRouter);

// -------------------------Blog Module----------------
const frontBlogRouter = require('./routes/front/blogs.routes');
app.use('/front-user/blog',frontBlogRouter);



const port =process.env.PORT
require(path.join(__dirname,'/config','database')) ()

app.listen(port,()=>{
    console.log(`connected http://127.0.0.1:${port}`);
})
