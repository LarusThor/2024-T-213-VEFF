// Import supertest for HTTP requests
const request = require("supertest");
// note that we take advantage of @jest/globals (describe, it, expect, etc.)
// API for expect can be found here: https://jestjs.io/docs/expect

const app = require("../index");

describe("Endpoint tests", () => {
  // Make sure the server is in default state when testing
  beforeEach(async () => {
    await request(app).get("/api/v1/reset");
  });

  /*---------------------------
   Success test
  ---------------------------*/

  // Get all books

  it("GET /API/v1/books, Displays all books and their properties.", async () => {
    const response = await request(app).get("/api/v1/books");
    // Show the response was a success with 200
    expect(response.statusCode).toBe(200);
    // Check if the body is present and if the response body is an array
    expect(Array.isArray(response.body)).toBeTruthy();
    // Check if the number of items in the body is correct
    expect(response.body).toHaveLength(3)
  });

  // Get a specific book

  it("GET /api/v1/genres/:genreId/books/:bookId, Retrieves a specific book in a specific genre by its id.", async () => {
    // Initialize two variables to get a specific book
    const genreId = 1;
    const bookId = 1;
    const response = await request(app).get(`/api/v1/genres/${genreId}/books/${bookId}`);
    // Show the response was a success with 200
    expect(response.statusCode).toBe(200);
    // Make sure the body contains the correct properties
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("title");
    expect(response.body).toHaveProperty("author");
    expect(response.body).toHaveProperty("genreId");
    // Check if body is present
    expect(response.body).toBeTruthy();

    // Check for the correct type of the body's properties
    expect(typeof response.body.id).toBe("number");
    expect(typeof response.body.genreId).toBe("number");
    expect(typeof response.body.title).toBe("string");
    expect(typeof response.body.author).toBe("string");
  });

  // Update a specific book

  it("PATCH /api/v1/genres/:genreId/books/:bookId, Partially updates a book's properties.", async () => {
    // Initialize two variables to update a specific book 

    const bookId = 1;
    const genreId = 1;

    // Create a new item with updated details for the original book

    const changed_book = {
      "title": "CoolBook",
      "author": "SomeAuthor",
      "genreId": 2
    };

    // Send the new book details with the original book into the response so it can be updated

    const response = await request(app).patch(`/api/v1/genres/${genreId}/books/${bookId}`).send(changed_book);
    // Show the response was a success with 200
    expect(response.statusCode).toBe(200);
    // Check if body is present
    expect(response.body).toBeTruthy();
    //Keep the book id, since it should not be changed
    expect(response.body.id).toBe(bookId);
    // Make sure the new details are present in the body
    expect(response.body.genreId).toBe(changed_book.genreId);
    expect(response.body.title).toBe(changed_book.title);
    expect(response.body.author).toBe(changed_book.author);
    // Check for the correct type of the body's properties
    expect(typeof response.body.id).toBe("number");
    expect(typeof response.body.genreId).toBe("number");
    expect(typeof response.body.title).toBe("string");
    expect(typeof response.body.author).toBe("string");
  });

  /*---------------------------
   Failure test
  ---------------------------*/

  // Give error if wrong genre id entered for existing book

  it("PATCH /api/v1/genres/:genreId/books/:bookId, should fail when an existing book is addressed using an incorrect, but existing genreId.", async () => {
    // Initialize two variables to update a specific book

    const bookId = 1;
    const genreId = 2;

    // Create a new item with updated details for the original book

    const changed_book = {
      "title": "CoolBook",
      "author": "SomeAuthor",
      "genreId": 3
    };

    //Initialize response in a way so that if the wrong genre id is entered it gives an error

    const response = await request(app).patch(`/api/v1/genres/${genreId}/books/${bookId}`).send(changed_book);
    // Let the user know the wrong genre id was entered with 404
    expect(response.statusCode).toBe(404, "Id of genre's book needs to be it's existing id.");
    // Check if a body is present
    expect(response.body).toBeTruthy();
  });

  // Give error if incorrect body properties

  it("PATCH /api/v1/genres/:genreId/books/:bookId, should fail when a request is made with a non-empty request body that does not contain any valid property for a book (title, author, genreId).", async () => {
    
    // Initialize two variables to update a specific book

    const bookId = 1;
    const genreId = 1;

    // Create a new item with incorrect body properties

    const changed_book = {
      nameofbook: "BookOne",
      name: "Author",
      num: 3
    };
  
    // Initialize response so that it takes a response with incorrect body properties

    const response = await request(app).patch(`/api/v1/genres/${genreId}/books/${bookId}`).send(changed_book);
    // Let the user know the wrong body properties were entered with 400
    expect(response.statusCode).toBe(400, "Missing valid properties for new book, title, author or Id of genre.");
    // Check if a body is present
    expect(response.body).toBeTruthy();
  });

  // Give error if book does not exist

  it("GET /api/v1/genres/:genreId/books/:bookId, hould fail when the book with the provided id does not exist.", async () => {
    
    // Initialize existing varible and one non-existing variable

    const bookId = 300;
    const genreId = 3;

    // Response is initalized in a way to check for a non-existing book id

    const response = await request(app).get(`/api/v1/genres/${genreId}/books/${bookId}`);
    // Let user know the book does not exist with 404
    expect(response.statusCode).toBe(404, "Id of book does not exist.");
    // Check if a body is present
    expect(response.body).toBeTruthy();
  });

  // Give error when creating a book if the author property is not included in the body

  it("POST /api/v1/genres/:genreId/books/, should fail when the request body does not contain the author property.", async () => {
    
    // Initalize a variable for the genre of the book
    
    const genreId = 2

    // Create a new item without author body property

    const new_book = {
      "title": "FunBook",
      "genreId": 2
    }

    // Initialize response for checking if author property is missing in body

    const response = await request(app).post(`/api/v1/genres/${genreId}/books/`).send(new_book);
    // Let user know body is missing author property
    expect(response.statusCode).toBe(400, "Missing author property in request body.");
    // Check if body is present
    expect(response.body).toBeTruthy();
    // Check if author is undefined
    expect(response.body.author).toBeUndefined();
  });

  it("POST /api/v1/genres, should fail when missing the correct authorization.", async () => {

    // Wrong attributes entered for body properties

    const new_genre = {
      "some_attribute": "string",
      "some_number": "not_a_num"
    }

    // Initialize response so it tries to create a new genre with invalid properties

    const response = await request(app).post(`/api/v1/genres`).send(new_genre);
    // Let user know properties that were entered are not valid for creating a new genre
    expect(response.statusCode).toBe(401, "Incorrect properties entered for new genre.");
    // Check if body is present
    expect(response.body).toBeTruthy();

  });

  /*---------------------------
   Genre test
  ---------------------------*/

  // Check for successful interception with hashing function

  it("POST /api/v1/genres HTTP/1.1", async () => {

    // Initialize a hash variable from intercepted message, that will be used for changing the message

    const hash = "HMAC d5951928a797e3de418978abeb1c4f036672aa63b3241843493bfae1c0e60923"

    // Create an object that contains new information for updating the intercepted message

    const new_genre = {
      "name": "string"
    }

    // Initialize response with hashed variable and update it with new object

    const response = (await request(app).post(`/api/v1/genres`).set("Authorization", hash).send(new_genre));
    // Let user know the interception was a success
    expect(response.statusCode).toBe(201, "Sucessful interception.");
    // Check if the body is present
    expect(response.body).toBeTruthy();

  });

});
