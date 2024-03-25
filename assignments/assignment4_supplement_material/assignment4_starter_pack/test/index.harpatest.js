// Import supertest for HTTP requests
const request = require("supertest");
// note that we take advantage of @jest/globals (describe, it, expect, etc.)
// API for expect can be found here: https://jestjs.io/docs/expect

const app = require("../index");

describe("Endpoint tests", () => {
  beforeEach(async () => {
    // Reset the server state before each test to ensure test isolation
    await request(app).get("/api/v1/reset");
  });

  /*---------------------------
   Success tests
  ---------------------------*/

  it("GET /events - should return all events", async () => {
    // Request to GET /events
    const response = await request(app).get("/api/v1/events");
    // Check that response body is there and is an array
    expect(Array.isArray(response.body)).toBeTruthy();
    // Check that the status code is expected
    expect(response.statusCode).toBe(200);
    // Check if response.body has the right amount of events
    expect(response.body).toHaveLength(3);
  });

  it("POST /events - should create a new event", async () => {
    // Construct my new event to POST
    const newEvent = {
      name: "My new event",
      date: "2024-05-01",
      location: "Harpa",
    };
    // Request to POST /events
    const response = await request(app).post("/api/v1/events").send(newEvent);
    expect(response.statusCode).toBe(201);
    // TODO: check that response body is there
    expect(response.body).toHaveProperty('id', 4);
    expect(response.body).toHaveProperty('name', "My new event");
    expect(response.body).toHaveProperty('date', "2024-05-01");
    expect(response.body).toHaveProperty('location', "Harpa");
    // TODO: Check if there are only these for properties and no other
  });

  it("GET /events/:eventId - should return a single event by id", async () => {
    // TODO: implement
  });

  it("GET /events/:eventId/attendees - should return all attendees to event given an id", async () => {
    // TODO: implement
  });

  it("POST /events/:eventId/attendees - should create a new attendee to a specific event", async () => {
    // TODO: implement
  });

  /*---------------------------
   Error handling tests
  ---------------------------*/
  // TODO: Add all error handling tests

  // Try to call and endpoint that does not exists
  it("Example Test - should return a 404 status for a non-existent endpoint", async () => {
    const response = await request(app).get("/api/v1/nonExistentEndpoint");
    expect(response.statusCode).toBe(404);
  });
});
