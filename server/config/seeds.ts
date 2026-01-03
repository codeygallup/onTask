import { db } from "./connection";
import { User } from "../models";

// Seed function for local development and testing
db.once("open", async () => {
  await User.deleteMany({});

  await User.create({
    username: "TestAccount",
    email: "test@test.com",
    password: "Password123!",
  });

  console.log("Seeding complete!");

  process.exit();
});
