const express = require('express')
const path = require('path')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')

const dbPath = path.join(__dirname, 'goodreads.db')
const app = express()
app.use(express.json())

const initialiseDBandServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`Database Error ${e.message}`)
  }
}

// GET BOOKS API
//

app.get('/books/', async (request, response) => {
  const getBooksQuery = `
    SELECT 
      *
    FROM 
     book 
     ORDER BY 
     book_id    
    `
  const bookArray = await db.all(getBooksQuery)
  response.send(bookArray)
})

initialiseDBandServer()

//GET BOOK API

app.get('/books/:bookId/', async (request, response) => {
  const {bookId} = request.params
  const query = `
  SELECT * FROM book WHERE book_id = ${bookId}`
  const bookArray = await db.get(query)
  response.send(bookArray)
})

//ADD BOOK API

app.post('/books/', async (request, response) => {
  const bookDetails = request.body
  const {
    book_id,
    title,
    authorId,
    rating,
    ratingCount,
    reviewCount,
    description,
    pages,
    dateOfPublication,
    editionLanguage,
    price,
    onlineStores,
  } = bookDetails

  const addBookQuery = `
    INSERT INTO
      book (title,author_id,rating,rating_count,review_count,description,pages,date_of_publication,edition_language,price,online_stores)
    VALUES
      (
        '${book_id}'
        '${title}',
         ${authorId},
         ${rating},
         ${ratingCount},
         ${reviewCount},
        '${description}',
         ${pages},
        '${dateOfPublication}',
        '${editionLanguage}',
         ${price},
        '${onlineStores}'
      );`

  const dbResponse = await db.run(addBookQuery)
  const bookId = dbResponse.lastID
  response.send({bookId: bookId})
})
