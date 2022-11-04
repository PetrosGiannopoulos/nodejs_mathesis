import express from 'express'
import * as Validator from './validator/validation.mjs'
import * as UserController from './controller/user_controller.mjs'
import * as BookController from './controller/book_controller.mjs'

const router = express.Router()

router.get("/", (req, res)=>{
    if(req.session.username)
        res.redirect("/books")
    else
        res.render("home")
})

router.get("/books",
    UserController.checkIfAuthenticated,
    BookController.showBookList)

router.get("/books",
    UserController.checkIfAuthenticated,
    BookController.showBookList)

router.get("/addbookform",
    UserController.checkIfAuthenticated,
    (req, res) =>{
        res.render("addbookform")
    })

router.get("/commentSection/:title", 
    UserController.checkIfAuthenticated,
    BookController.showBookComments
    )

router.post("/doaddcomment",
    UserController.checkIfAuthenticated,
    BookController.addComment
)

router.post("/books",
    //UserController.checkIfAuthenticated,
    Validator.validateLogin,
    UserController.doLogin,
    BookController.showBookList)

router.post("/doaddbook", 
    UserController.checkIfAuthenticated,
    Validator.validateNewBook,
    BookController.addBook,
    BookController.showBookList)


router.get("/delete/:title",
    UserController.checkIfAuthenticated,
    BookController.deleteBook,
    BookController.showBookList
)

router.get("/logout", UserController.doLogout, (req, res)=>{
    //req.session.destroy()
    res.redirect("/")
})

router.get("/register", (req, res)=>{
    res.render("registrationform")
})

router.post("/doregister",
    
    Validator.validateNewUser,
    UserController.doRegister)



export {router}