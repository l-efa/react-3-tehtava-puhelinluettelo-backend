import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'

const url = process.env.MONGODB_URL
mongoose.set('strictQuery', false)
console.log('connecting to mongodb..')

mongoose
  .connect(url)
  .then(console.log('connected to mongodb'))
  .catch((error) => {
    console.log('Error connecting to mongodb', error.message)
  })

const phoneNumberSchema = new mongoose.Schema({
  id: Number,
  name: {
    type: String,
    minlength: 3,
    requierd: true,
  },
  number: {
    type: Number,
    minlength: 8,
    validate: {
      validator: function (v) {
        return /^(?:\d{2}-\d{7,9}|\d{3}-\d{7,8})$/.test(v)
      },
      message: (props) =>
        `${props.value} is not a valid phone number! Format should be: 123-1234567, 123-12345678, 12-12345678, 12-123456789`,
    },
    required: [true, 'User phone number required'],
  },
})

export default mongoose.model('PhoneNumber', phoneNumberSchema)

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
