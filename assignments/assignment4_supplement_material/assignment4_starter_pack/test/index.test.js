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

  // Try to call and endpoint that does not exists
  it("Example Test: should return a 404 status for a non-existent endpoint", async () => {
    const response = await request(app).get("/api/v1/nonExistentEndpoint");
    expect(response.statusCode).toBe(404);    
  });

  it("GET /API/v1/books, Displays all books and their properties.", async () => {
    const response = await request(app).get("/api/v1/books");
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body).toHaveLength(3)
  });

  it("GET /api/v1/genres/:genreId/books/:bookId, Retrieves a specific book in a specific genre by its id.", async () => {
    const genreId = 1;
    const bookId = 1;
    const response = await request(app).get(`/api/v1/genres/${genreId}/books/${bookId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("title");
    expect(response.body).toHaveProperty("author");
    expect(response.body).toHaveProperty("genreId");
    expect(response.body).toBeTruthy();
    // expect(response.body.id).toBe(bookId);
    // expect(response.body.genreId).toBe(genreId);

    expect(typeof response.body.id).toBe("number");
    expect(typeof response.body.genreId).toBe("number");
    expect(typeof response.body.title).toBe("string");
    expect(typeof response.body.author).toBe("string");
  });


  it("PATCH /api/v1/genres/:genreId/books/:bookId, Partially updates a book's properties.", async () => {

    const bookId = 1;
    const genreId = 1;

    const changed_book = {
      "title": "CoolBook",
      "author": "SomeAuthor",
      "genreId": 2
    };

    const response = await request(app).patch(`/api/v1/genres/${genreId}/books/${bookId}`).send(changed_book);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeTruthy();
    expect(response.body.id).toBe(bookId);
    expect(response.body.genreId).toBe(changed_book.genreId);
    expect(response.body.title).toBe(changed_book.title);
    expect(response.body.author).toBe(changed_book.author);

    expect(typeof response.body.id).toBe("number");
    expect(typeof response.body.genreId).toBe("number");
    expect(typeof response.body.title).toBe("string");
    expect(typeof response.body.author).toBe("string");
  });

  /*---------------------------
   Failure test
  ---------------------------*/

  it("PATCH /api/v1/genres/:genreId/books/:bookId, should fail when an existing book is addressed using an incorrect, but existing genreId.", async () => {
    
    const bookId = 1;
    const genreId = 2;

    const changed_book = {
      "title": "CoolBook",
      "author": "SomeAuthor",
      "genreId": 3
    };

    const response = await request(app).patch(`/api/v1/genres/${genreId}/books/${bookId}`).send(changed_book);
    expect(response.statusCode).toBe(404, "Id of genre's book needs to be it's existing id.");
    expect(response.body).toBeTruthy();
  });

  it("PATCH /api/v1/genres/:genreId/books/:bookId, should fail when a request is mad with a non-empty request body that does not contain any valid property for a book (title, author, genreId).", async () => {
    const bookId = 1;
    const genreId = 1;

    const changed_book = {
      nameofbook: "BookOne",
      name: "Author",
      num: 3
    };
  
    const response = await request(app).patch(`/api/v1/genres/${genreId}/books/${bookId}`).send(changed_book);
    expect(response.statusCode).toBe(400, "Missing valid properties for new book, title, author or Id of genre.");
    expect(response.body).toBeTruthy();
  });

  it("GET /api/v1/genres/:genreId/books/:bookId, hould fail when the book with the provided id does not exist.", async () => {

    const bookId = 300;
    const genreId = 3;

    const response = await request(app).get(`/api/v1/genres/${genreId}/books/${bookId}`);
    expect(response.statusCode).toBe(404, "Id of book does not exist.");
    expect(response.body).toBeTruthy();
  });

  it("POST /api/v1/genres/:genreId/books/, should fail when the request body does not contain the author property.", async () => {

    const genreId = 2

    const new_book = {
      "title": "FunBook",
      "genreId": 2
    }

    const response = await request(app).post(`/api/v1/genres/${genreId}/books/`).send(new_book);
    expect(response.statusCode).toBe(400, "Missing author property in request body.");
    expect(response.body).toBeTruthy();
    expect(response.body.author).toBeUndefined();
  });

  it("POST /api/v1/genres, should fail when missing the correct authorization.", async () => {

    const new_genre = {
      "some_attribute": "string",
      "some_number": "not_a_num"
    }

    const response = await request(app).post(`/api/v1/genres`).send(new_genre);
    expect(response.statusCode).toBe(401, "Incorrect properties entered for new genre.");
    expect(response.body).toBeTruthy();

  });

  /*---------------------------
   Genre test
  ---------------------------*/

  it("POST /api/v1/genres HTTP/1.1", async () => {

    const new_genre = {
      "some_attribute": "string",
      "some_number": "not_a_num"
    }

    const response = await request(app).post(`/api/v1/genres`).send(new_genre);
    expect(response.statusCode).toBe(401, "Incorrect properties entered for new genre.");
    expect(response.body).toBeTruthy();

  });

});
