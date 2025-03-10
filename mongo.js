import mongoose from "mongoose";

console.log("args length: ", process.argv.length);

let index = 1;
const password = process.argv[2];
const url = `mongodb+srv://lefa-atlas:${password}@noteapp.ueu8a.mongodb.net/phonenumberApp`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const phoneNumberSchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: Number,
});

const PhoneNumberModel = mongoose.model("PhoneNumber", phoneNumberSchema);

if (process.argv.length <= 3) {
  console.log("no params, log all numbers!");

  PhoneNumberModel.find({}).then((result) => {
    console.log("phonebook: ");
    result.forEach((node, index) => {
      console.log(`listig ${index}: ${node}`);
    });
    mongoose.connection.close();
  });
} else if (process.argv.length > 3 && process.argv.length < 6) {
  const phoneNumber = new PhoneNumberModel({
    id: index,
    name: process.argv[3],
    number: process.argv[4],
  });

  phoneNumber.save().then((result) => {
    console.log(
      `Added ${phoneNumber.name}, ${phoneNumber.number} to the database!`
    );
    mongoose.connection.close();
  });
}
