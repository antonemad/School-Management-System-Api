const mongoose = require("mongoose");

const { Schema } = mongoose;

//questionSchema
const questionSchema = new Schema(
  {
    question: {
      type: String,
      required: true,
    },
    optionA: {
      type: String,
      required: true,
    },
    optionB: {
      type: String,
      required: true,
    },
    optionC: {
      type: String,
      required: true,
    },
    optionD: {
      type: String,
      required: true,
    },
    correctAnswer: {
      type: String,
      required: true,
    },
    isCorrect: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Override the default toJSON method to remove sensitive and unnecessary fields
// This ensures that when an Admin document is sent as a JSON response,
// fields like password, timestamps, and __v are excluded automatically
questionSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.updatedAt;
  delete obj.createdAt;
  delete obj.__v;
  return obj;
};

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
