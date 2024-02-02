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
  name: String,
  number: String,
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
