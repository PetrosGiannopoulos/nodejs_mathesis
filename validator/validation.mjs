import { body, validationResult } from 'express-validator'
import validator from 'validator'

const validateLogin = [
    body("username")
        .trim().escape().isLength({min:4})
        .withMessage("Δώστε όνομα με τουλάχιστον 4 χαρακτήρες"),

    (req, res, next) =>{
        const errors = validationResult(req)
            if(errors.isEmpty){
                next()
            }
            else{
                res.render("home", {message: errors.mapped})
            }
    }
]

const validateNewComment = [

    body ("newBookComment")
        .custom(value=>{
            for(let ch of value){
                if(!validator.isAlpha(ch, 'el-GR') &&
                !validator.isAlpha(ch, 'en-US') &&
                !validator.isNumeric(ch, 'en)-US') &&
                ch != ' '){
                        throw new Error('Επιτρέπονται ελληνικοί και λατινικοί χαραξτήρες, καθώς και αριθμοί, μη αποδεκτό χαρακτήρας: "'+ch+'"')
                }
            }
            return true;
        })
        .trim().escape()
        .isLength({min:4})
        .withMessage("Τουλάχιστον 4 γράμματα"),
    (req, res, next) =>{
        const errors = validationResult(req)
        if(errors.isEmpty()){
            next()
        }
        else{
            throw new Error("Comment Validation Error")
        }
    }
        
]

const validateNewBook = [

    body("newBookTitle")
        .custom(value=>{
            for(let ch of value){
                if(!validator.isAlpha(ch, 'el-GR') &&
                   !validator.isAlpha(ch, 'en-US') &&
                   !validator.isNumeric(ch, 'en)-US') &&
                   ch != ' '){
                        throw new Error('Επιτρέπονται ελληνικοί και λατινικοί χαραξτήρες, καθώς και αριθμοί, μη αποδεκτό χαρακτήρας: "'+ch+'"')
                   }
            }
            return true;
        })
        .trim().escape()
        .isLength({min:5})
        .withMessage("Τουλάχιστον 5 γράμματα"),
    body("newBookAuthor")
        .custom(value =>{
            for(let ch of value){
                if(!validator.isAlpha(ch, 'el-GR') &&
                   !validator.isAlpha(ch, 'en-US') &&
                   ch != ' '){
                        throw new Error('Επιτρέπονται ελληνικοί και λατινικοί χαραξτήρες, μη αποδεκτό χαρακτήρας: "' +ch+'"')
                   }
            }
            return true;
        })
        .trim().escape()
        .isLength({min:5})
        .withMessage("Τουλάχιτον 5 γράμματα"),
    (req, res, next) =>{
        const errors = validationResult(req)
        if(errors.isEmpty()){
            next()
        }
        else{
            res.render("addbookform", {
                message: errors.mapped(),
                title: req.body["newBookTItle"],
                author: req.body["newBookAuthor"]
            })
        }
    }
]

const validateNewUser = [
    body("username")
        .trim().escape().isLength({min:4})
        .withMessage("Δώστε όνομα με τουλάχιστον 4 χαρακτήρες"),
    body("password-confirm")
        .trim()
        .isLength({min: 4, max: 18})
        .withMessage('Το συνθηματικό πρέπει να έχει από 4 μέχρι 18 χαρακτήρες')
        .custom((value, {req}) =>{
            if(value !=req.req.body.password)
                throw new Error("Το συνθηματικό πρέπει να είναι το ίδιο και στα δύο πεδία")
            else
                return true
    }),
    (req, res, next)=>{
        const errors = validationResult(req)
        if(errors.isEmpty){
            next()
        }
        else{
            res.render("registrationform", {
                message: errors.mapped()
            })  
        }
    }

]

export {validateLogin, validateNewBook, validateNewUser, validateNewComment}