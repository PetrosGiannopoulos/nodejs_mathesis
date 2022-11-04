import {Book, User, BookUser} from './bookList_seq_pg.mjs'
import bcrypt from 'bcrypt'
import { Sequelize, Op } from 'sequelize'
import { router } from '../routes.mjs'

async function addUser(username, password){
    try {
        if(!username || !password)
            throw new Error("Λείπει το όνομα ή το συνθηματικό του χρήστη")
        let user = await User.findOne({where: {name: username}})

        if(user)
            throw new Error("Υπάρχει ήδη χρήστης με όνομα " + username)

        const hash = await bcrypt.hash(password, 10)

        user = await User.create({name: username, password:hash})
        return user
    } catch (error) {
        throw error
    }
}

async function login(username, password){
    try {
        if(!username || !password)
            throw new Error("Λείπει το όνομα ή το συνθηματικό του χρήστη")
        let user = await User.findOne({where: {name: username}})

        if(!user)
            throw new Error("Δεν υπάρχει χρήστης με όνομα " + username)

        const match = await bcrypt.compare(password, user.password)
        if(match)
            return user
        else
            throw new Error("Λάθος στοιχεία πρόσβασης")
    } catch (error) {
        throw error
    }
}

async function loadBooks(username){
    try{

        if(!username)
            throw new Error("Πρέπει να δοθεί όνομα χρήστη")

        const user = await User.findOne({where: {name: username}});
        if(!user)
            throw new Error("Άγνωστος χρήστης")
        const myBooks = await user.getBooks({raw: true});
        return myBooks
    }catch(error){
        throw error
    }
}

async function addBook(newBook, username){
    try {

        if(!username)
        throw new Error("Πρέπει να δοθεί όνομα χρήστη")

        const user = await User.findOne({where: {name: username}});
        if(!user)
            throw new Error("Άγνωστος χρήστης")

        const [book, created] = await Book.findOrCreate({
            where: {
                title: newBook.title,
                author: newBook.author
            }
        })
        await user.addBook(book)
    } catch (error) {
        throw error
    }
}

async function addCommentToBookUser(book, username, userComment){
    const bookTitle = book.title
    const bookAuthor = book.author

    try {

        
        if(!username)
            throw new Error("Πρέπει να δοθεί όνομα χρήστη")
        if(!book)
            throw new Error("Πρέπει να δοθεί βιβλίο ")
        
        
        const editedComment = await BookUser.update({
            comment : userComment,
            }, { 
            where : {
                BookTitle: bookTitle,
                UserName: username,
            }
        })

        console.log(editedComment)
    } catch (error) {
        throw error
    }
    
}

async function deleteBook(book){
    try {
        await this.findOrAddUser()
        const bookToRemove = await Book.findOne(
            {where: {title: book.title}}
        )
        await bookToRemove.removeUser(this.user)

        const numberOfUsers = await bookToRemove.countUsers()
        if(numberOfUsers == 0){
            Book.destroy(
                {where: {title: book.title}}
            )
        }
    } catch (error) {
        throw error
    }
}

async function deleteBookFromUser(book, username){
    try {
        const user = await User.findOne({where: {name:username}});
        const bookToRemove = await Book.findOne(
            {where: {title: book.title}}
        )
        await bookToRemove.removeUser(user)

        const numberOfUsers = await bookToRemove.countUsers()
        if(numberOfUsers == 0){
            Book.destroy(
                {where: {title: book.title}}
            )
        }
    } catch (error) {
        throw error
    }
}

async function loadCommentsFromBook(book, username){
    try{
        if(!book){
            throw new Error("Είναι αδύνατη η φόρτωση των σχολίων για αυτό το βιβλίο. Το βιβλίο αυτό δεν υπάρχει")
        }
        
        const comments = await BookUser.findAll({where : {BookTitle :book.title, comment: {[Op.ne]: null}, UserName: {[Op.ne]: username}}, raw: true})
        return comments

    }catch(error){
        throw error
    }
}

async function loadUserCommentFromBook(book, username){

    try{
        if(!book){
            throw new Error("Είναι αδύνατη η φόρτωση των σχολίων για αυτό το βιβλίο. Το βιβλίο αυτό δεν υπάρχει")
        }
        
        const userComment = await BookUser.findAll({where : {BookTitle :book.title, comment: {[Op.ne]: null}, UserName : username}, raw: true})
        
        if(!userComment || userComment[0] === undefined)return userComment
        else return userComment[0].comment

    }catch(error){
        throw error
    }
}



async function findOrAddUser(){
    if(this.user == undefined)
        try {
            const [user, created] = await User.findOrCreate({where: {name: this.username}})
            this.user = user
        } catch (error) {
            throw error
        }
}

export { addUser, login, loadBooks, addBook, deleteBookFromUser, loadCommentsFromBook, loadUserCommentFromBook, addCommentToBookUser}