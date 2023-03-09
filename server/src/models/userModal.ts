import { InferSchemaType, model, Schema } from "mongoose";

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "Please provide your username"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    select: false,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minleng: 8,
    select: false,
  },
});

type User = InferSchemaType<typeof userSchema>;

export default model<User>("User", userSchema);
