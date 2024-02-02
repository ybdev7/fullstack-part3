const mongoose = require("mongoose");

const pwd = process.argv[2];

const get_conn_str = (pwd) => {
  return `mongodb+srv://course7:${pwd}@cluster0.goh54gk.mongodb.net/?retryWrites=true&w=majority`;
};

const url = get_conn_str(pwd);

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });

  person.save().then((res) => {
    console.log(`Added ${person.name} number ${person.number} to phonebook`);
    mongoose.connection.close();
  });
} else if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    console.log("Phonebook:");
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
} else {
  console.log("Please provide a password for MongoDB");
  process.exit(1);
}
