import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  try {
    const user = this;
    if (user.isModified("password")) {
      user.password = await bcrypt.hash(this.password, 10);
      next();
    }
  } catch (err) {
    next(err);
  }
});

const tokenSchema = new Schema(
  {
    user_id: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    token_type: { type: String, required: true },
    token: { type: String, required: true },
  },
  { timestamps: true, indexes: [{ fields: ["token"] }] }
);

export const User = mongoose.model("User", userSchema);

export const Token = mongoose.model("Token", tokenSchema);
