import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

const url = process.env.MONGODB_URL;
mongoose.set("strictQuery", false);
console.log("connecting to mongodb..");

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to mongodb");
  })
  .catch((error) => {
    console.log("Error connecting to mongodb", error.message);
  });

const phoneNumberSchema = new mongoose.Schema({
  id: Number,
  name: {
    type: String,
    minlength: 3,
    requierd: true,
  },
  number: Number,
});

export default mongoose.model("PhoneNumber", phoneNumberSchema);

/*
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
}*/
