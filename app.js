const path = require('path');
const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");
const session = require('express-session');
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
const randomStr = require("randomstring");
const fs = require('fs');
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const db = require("./db");
const authh = require("./login");

let url = 'mongodb+srv://ygumus:13uncucumA@senecaweb.xujfi4i.mongodb.net/Library?retryWrites=true&w=majority';
let database = db.connect(url);

let bookSchema = new Schema({
    "ID": String,
    "title": String,
    "author": String,
    "available": Boolean
});

let userSchema = new Schema({
    "username": String,
    "IDBooksBorrowed": Array
})

const Library = db.schema(bookSchema, "books")
const Clients = db.schema(userSchema, "users");


async function bookList(username){
    let availableBooks = Array();
    let unavailableBooks = Array();
    let [books, user] = await Promise.all([Library.find({}), Clients.find({username:username})]);
    
    books.forEach((dt) => {
        if (dt.available) {
            availableBooks.push(Array(
               dt.ID,
               dt.title,
               dt.available,
               dt.author
           ));
        } else if (!dt.available && user[0].IDBooksBorrowed.indexOf(dt.ID) >= 0) {
            unavailableBooks.push(Array(
                dt.ID,
                dt.title,
                dt.available,
                dt.author
            ));
        }
    })

return { "availableBooks": availableBooks, "unavailableBooks": unavailableBooks};
}

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require('body-parser').urlencoded({ extended: false }));
app.use(cookieParser());

var strRandom = randomStr.generate();

app.use(session({
    cookieName: "aSession",
    secret: strRandom,
    duration: 15 * 60 * 1000,
    activeDuration: 3 * 60 * 1000,
    secure: true,
    httpOnly: true,
    ephemeral: true,
    saveUninitialized: false,
    resave: false,
    maxAge: 1000 * 60 * 60 * 24
}));

app.use(function(req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});

Handlebars.registerPartial('header', '{{header}}');

app.engine(
    'hbs',
    exphbs.engine({
        defaultLayout: 'main',
        extname: '.hbs',
        layoutsDir: path.join(__dirname + '/views/layouts'),
        partialsDir: path.join(__dirname + '/views/layouts/partials/'),
    }),
);

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', function(req, res) {
    res.render('libraryLanding', {})
})
app.get('/signin', function(req, res) {
    res.render('librarySignin', {

    })
});

app.post('/login', function(req, res) {
    let uname = req.body.uname;
    let pass = req.body.pass;
    
    let isLogin = authh.login(uname, pass);
    
    if (isLogin.error == 0) {
        req.session = req.session;
        req.session.userid = uname;
        res.redirect('/home')
    } else {
        res.render('librarySignin', {
            unameError: isLogin.userError,
            passError: isLogin.passError
        })
    }
})

app.get('/home/:error?', function(req, res) {
    if (req.session.userid) {

        let login = {
            "uname": req.session.userid
        }

        bookList(req.session.userid).then(async function(result){
            res.render('libraryHome', {
                a_booklist: result.availableBooks,
                u_booklist: result.unavailableBooks,
                login: login,
                error:req.params.error
            })
        });
    } else {
        res.render('libraryLanding')
    }
})

app.get('/signout', function(req, res) {
    req.session.destroy();
    res.render('libraryLanding')
})

app.post('/home/borrow', function(req, res) {
    
    let error = 0;
    let books = req.body.chkBook;
    //console.log(typeof books);
    if(typeof books !== "object"){
        books = Array(req.body.chkBook);
    }
    

    Promise.all(books.map(async function(book){
        
        let doc = await Library.findOneAndUpdate({"ID":book, "available":true}, {"available":false}, {new: true});
        
        if(doc !== null){
        await doc.save();
          
        console.log("Book with ID " + book + " updated with update of available: false");
       
        let user = await Clients.findOneAndUpdate({username:req.session.userid}, {$push: {IDBooksBorrowed: book}}, {new: true});
        await user.save();
        }else{
            error = 1;
        }

    })).then(() =>{
        bookList(req.session.userid);
        if(error){
        res.redirect("/home/" + error);   
        }else{
            res.redirect("/home");
        }
    });
});

app.post('/home/return', function(req, res) {

    let books = req.body.chkBookBorrowed;

    if(typeof books !== "object"){
        books = Array(req.body.chkBookBorrowed);
    }
    
    Promise.all(books.map(async function(book){
        
        let doc = await Library.findOneAndUpdate({"ID":book, "available":false}, {"available":true}, {new: true});
        console.log(book);
        await doc.save();
            
        console.log("Book with ID " + book + " updated with update of available: true");
       
        let user = await Clients.findOneAndUpdate({username:req.session.userid}, {$pull: {IDBooksBorrowed: book}}, {new: true});
        await user.save();
        
    })).then(() =>{
        bookList(req.session.userid);
        res.redirect("/home");   
    });

    
})

const HTTP_PORT = process.env.PORT || 3000;

function onHttpStart() {
    console.log("HTTP server listening on: " + HTTP_PORT);
};

app.listen(HTTP_PORT, onHttpStart);