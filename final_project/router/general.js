const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
/*
public_users.get('/',function (req, res) {
  const formattedJson = JSON.stringify(books, null, 2);
  res.setHeader('Content-Type', 'application/json');
  res.send(formattedJson);
});
*/

// Get the book list available in the shop ASYNC
public_users.get('/', function (req, res) {
  
  let booksPromise = new Promise((resolve, reject) => {
      if (books) {
          resolve(books);
      } else {
          reject("Books not found");
      }
  });

  booksPromise.then((booksFromDB) => {
    const formattedJson = JSON.stringify(booksFromDB, null, 2);
    res.setHeader('Content-Type', 'application/json');
    res.send(formattedJson);
  }).catch((errorMessage) => {
    res.status(404).send(errorMessage);
  });

});

// Get book details based on ISBN
/*
public_users.get('/isbn/:isbn',function (req, res) {

  const requestedIsbn = req.params.isbn;
  const foundBook = books[requestedIsbn];

  if(foundBook) {
    return res.status(200).json(foundBook);
  }
  return res.status(404).json({ message: "No book with the given ISBN" });
});
*/

// Get book details based on ISBN ASYNC
public_users.get('/isbn/:isbn', function (req, res) {
  
  const requestedIsbn = req.params.isbn;
  
  let booksPromise = new Promise((resolve, reject) => {
      const book = books[requestedIsbn];
      if (book) {
          resolve(book);
      } else {
          reject("Book not found for ISBN: " + requestedIsbn);
      }
  });

  booksPromise.then((bookFromDB) => {
    const formattedJson = JSON.stringify(bookFromDB, null, 2);
    res.setHeader('Content-Type', 'application/json');
    res.send(formattedJson);
  }).catch((errorMessage) => {
    res.status(404).send(errorMessage);
  });

});

const standardizeString = (str) => {
    return str.normalize("NFD").toLowerCase().replace(/\s+/g, '');
}
  
// Get book details based on author
/*
public_users.get('/author/:author',function (req, res) {

    const requestedAuthor = standardizeString(req.params.author);
    let foundBooks = [];

    for (let key in books) {
        let bookAuthor = standardizeString(books[key].author);
        if (bookAuthor === requestedAuthor) {
            foundBooks.push(books[key]);
        }
    }

    if (foundBooks.length > 0) {
        return res.status(200).json(foundBooks);
    } else {
        return res.status(404).json({ message: "No books found by the given author" });
    }
});
*/

// Get book details based on author ASYNC
public_users.get('/author/:author', function (req, res) {

    const requestedAuthor = standardizeString(req.params.author);
    
    let booksPromise = new Promise((resolve, reject) => {
        let foundBooks = [];
        for (let key in books) {
            let bookAuthor = standardizeString(books[key].author);
            if (bookAuthor === requestedAuthor) {
                foundBooks.push(books[key]);
            }
        }

        if (foundBooks.length > 0) {
            resolve(foundBooks);
        } else {
            reject("No books found by the given author");
        }
    });

    booksPromise.then((booksFromDB) => {
        const formattedJson = JSON.stringify(booksFromDB, null, 2);
        res.setHeader('Content-Type', 'application/json');
        res.send(formattedJson);
    }).catch((errorMessage) => {
        res.status(404).send(errorMessage);
    });

});

// Get all books based on title
/*
public_users.get('/title/:title',function (req, res) {
    const requestedTitle = standardizeString(req.params.title);
    let foundBooks = [];

    for (let key in books) {
        let bookTitle = standardizeString(books[key].title);
        if (bookTitle.includes(requestedTitle)) {
            foundBooks.push(books[key]);
        }
    }

    if (foundBooks.length > 0) {
        return res.status(200).json(foundBooks);
    } else {
        return res.status(404).json({ message: "No books found with the given title" });
    }
});
*/

// Get all books based on title ASYNC
public_users.get('/title/:title', function (req, res) {

    const requestedTitle = standardizeString(req.params.title);
    
    let booksPromise = new Promise((resolve, reject) => {
        let foundBooks = [];
        for (let key in books) {
            let bookTitle = standardizeString(books[key].title);
            if (bookTitle.includes(requestedTitle)) {
                foundBooks.push(books[key]);
            }
        }

        if (foundBooks.length > 0) {
            resolve(foundBooks);
        } else {
            reject("No books found with the given title");
        }
    });

    booksPromise.then((booksFromDB) => {
        const formattedJson = JSON.stringify(booksFromDB, null, 2);
        res.setHeader('Content-Type', 'application/json');
        res.send(formattedJson);
    }).catch((errorMessage) => {
        res.status(404).send(errorMessage);
    });
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    // Check if the book exists in the database
    if (books[isbn]) {
        const bookReviews = books[isbn].reviews;

        // Check if there are any reviews
        if (Object.keys(bookReviews).length > 0) {
            return res.status(200).json(bookReviews);
        } else {
            return res.status(404).json({ message: "No reviews found for this book" });
        }
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
