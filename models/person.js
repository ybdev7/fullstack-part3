const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

try {
  console.log(
    `Connecting to ${url.replace(process.env.MONGODB_PWD, "********")}`
  );
} catch {}

mongoose.set("strictQuery", false);
mongoose
  .connect(url)
  .then(() => console.log("connected"))
  .catch((ex) => console.error("Failed to connect", ex));

const personSchema = new mongoose.Schema({
  name: { type: String, minLength: 3, required: true },
  number: {
    type: String,
    // phone number must have length of 8 or more be formed of two parts that are separated by -, the first part has two or three numbers and the second part also consists of numbers
    validate: {
      validator: function (num) {
        return /[0-9]{2}-[0-9]{6,}/.test(num) || /[0-9]{3}-[0-9]{5,}/.test(num);
      },
      message: (props) =>
        `phone number must have length of 8 or more and be formed as ##-###### or ###-#####`,
    },
    required: [true, "Phone number required."],
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
const Person = mongoose.model("Person", personSchema);

module.exports = Person;
