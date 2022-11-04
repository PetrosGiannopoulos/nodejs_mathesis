import * as BookList from '../model/booklist_model.mjs'
import { Book, BookUser } from '../model/bookList_seq_pg.mjs'
import { router } from '../routes.mjs'

async function showBookList(req,res, next){
    try{
        
        const myBooks = await BookList.loadBooks(req.session.username)
        res.render("booklist", {books: myBooks})
    }catch(error){
        next(error)
    }
   
}

const addBook = async (req, res, next) =>{
   
    
    try {
        await BookList.addBook({
            "title": req.body["newBookTitle"],
            "author": req.body["newBookAuthor"]

        }, req.session.username)
        next()
    } catch (error) {
        next(error)
    }
   
}

const addComment = async (req, res, next)=>{

    
    try {
        
        await BookList.addCommentToBookUser({
            "title" : req.body["bookCommentTitle"],
            "author": req.body["bookCommentAuthor"]
        }, req.session.username, req.body["newBookComment"])
        //res.render("/commentSection/"+req.body["bookCommentTitle"])
        next()
    } catch (error) {
        next(error)
    }
}

const deleteBook = async (req, res,next)=>{
    const title = req.params.title;
    //console.log("Title: ", title)
    try{
        
        //const bookList = new BookList(req.session.username)
        //await BookList.deleteBook({title:title})
        await BookList.deleteBookFromUser({title: title}, req.session.username)
        next()
    }catch(error){
        next(error)
    }
}

const showBookComments = async(req, res, next)=>{
    const title = req.params.title;
    const bookRef = await Book.findOne({where : {title: title}})
    const bookAuthor = bookRef.author
    const bookTitle = bookRef.title

    const comments = await BookList.loadCommentsFromBook({title: bookTitle}, req.session.username)
    const userComment = await BookList.loadUserCommentFromBook({title: bookTitle}, req.session.username)
    
    if(!comments)
        if(!userComment || userComment[0] === undefined)
            res.render("commentSection", {bookTitle: bookTitle, bookAuthor: bookAuthor})

        else res.render("commentSection", {userComment: userComment, bookTitle: bookTitle, bookAuthor: bookAuthor})
    else
        if(!userComment || userComment[0] === undefined)
            res.render("commentSection", {comments: comments, bookTitle: bookTitle, bookAuthor: bookAuthor})
        else res.render("commentSection", {comments: comments, userComment: userComment, bookTitle: bookTitle, bookAuthor: bookAuthor})
    
    
}


export {showBookList, addBook, deleteBook, showBookComments, addComment}