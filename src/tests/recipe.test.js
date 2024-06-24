const request = require("supertest");
const mongoose = require("mongoose");
const { app, server } = require("../index");
const Recipe = require("../models/recipe");

const testRecipe = {
  title: "Test Recipe",
  ingredients: ["Ingredient 1", "Ingredient 2"],
  instructions: "Test instructions",
  category: "Test category",
  userId: new mongoose.Types.ObjectId(), // Mock userId for testing
};

const createTestRecipe = async () => {
  return await Recipe.create(testRecipe);
};

beforeEach(async () => {
  await Recipe.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  server.close(); // Close the server after all tests are done
});

describe("Recipe API", () => {
  describe("POST /api/recipes", () => {
    test("should create a new recipe", async () => {
      const res = await request(app)
        .post("/api/recipes")
        .send(testRecipe)
        .expect(200);

      expect(res.body.title).toBe(testRecipe.title);
      expect(res.body.ingredients).toEqual(
        expect.arrayContaining(testRecipe.ingredients)
      );
      expect(res.body.instructions).toBe(testRecipe.instructions);
      expect(res.body.category).toBe(testRecipe.category);
      expect(res.body).toHaveProperty("_id");
    });

    test("should return 500 on server error", async () => {
      const invalidRecipe = { title: "" }; // Example of invalid data to trigger a server error

      const res = await request(app)
        .post("/api/recipes")
        .send(invalidRecipe)
        .expect(500);

      expect(res.body).toHaveProperty("msg", "Server Error");
    });
  });

  describe("GET /api/recipes", () => {
    test("should get all recipes", async () => {
      await createTestRecipe();

      const res = await request(app).get("/api/recipes").expect(200);

      expect(res.body.length).toBe(1);
      expect(res.body[0].title).toBe(testRecipe.title);
    });
  });

  describe("GET /api/recipes/:id", () => {
    test("should get a recipe by ID", async () => {
      const createdRecipe = await createTestRecipe();

      const res = await request(app)
        .get(`/api/recipes/${createdRecipe._id}`)
        .expect(200);

      expect(res.body.title).toBe(testRecipe.title);
    });

    test("should return 404 if recipe not found", async () => {
      const invalidId = new mongoose.Types.ObjectId();

      await request(app).get(`/api/recipes/${invalidId}`).expect(404);
    });

    test("should return 404 for invalid MongoDB ObjectId", async () => {
      await request(app).get("/api/recipes/invalid-id").expect(404);
    });
  });

  describe("PATCH /api/recipes/:id", () => {
    test("should update a recipe by ID", async () => {
      const createdRecipe = await createTestRecipe();
      const updatedData = { title: "Updated Title" };

      const res = await request(app)
        .patch(`/api/recipes/${createdRecipe._id}`)
        .send(updatedData)
        .expect(200);

      expect(res.body.title).toBe(updatedData.title);
    });

    test("should return 404 if recipe not found", async () => {
      const invalidId = new mongoose.Types.ObjectId();

      await request(app)
        .patch(`/api/recipes/${invalidId}`)
        .send({ title: "Updated Title" })
        .expect(404);
    });

    test("should return 404 for invalid MongoDB ObjectId", async () => {
      await request(app)
        .patch("/api/recipes/invalid-id")
        .send({ title: "Updated Title" })
        .expect(404);
    });
  });

  describe("DELETE /api/recipes/:id", () => {
    test("should delete a recipe by ID", async () => {
      const createdRecipe = await createTestRecipe();

      await request(app)
        .delete(`/api/recipes/${createdRecipe._id}`)
        .expect(200);

      const deletedRecipe = await Recipe.findById(createdRecipe._id);
      expect(deletedRecipe).toBeNull();
    });

    test("should return 404 if recipe not found", async () => {
      const invalidId = new mongoose.Types.ObjectId();

      await request(app).delete(`/api/recipes/${invalidId}`).expect(404);
    });

    test("should return 404 for invalid MongoDB ObjectId", async () => {
      await request(app).delete("/api/recipes/invalid-id").expect(404);
    });
  });
});
