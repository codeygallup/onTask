const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const Project = require("./Project");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, "Must use a valid email address"],
    },
    password: {
      type: String,
      required: true,
    },
    recoveryToken: String,
    recoveryTokenExpiry: Date,
    projects: [Project.schema],
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.generateRecoveryToken = function () {
  const recoveryToken = crypto.randomBytes(20).toString("hex");
  this.recoveryToken = recoveryToken;
  this.recoveryTokenExpiry = Date.now() + 3600000; // Token expires in 1 hour
  return recoveryToken;
};

const User = model("User", userSchema);

module.exports = User;