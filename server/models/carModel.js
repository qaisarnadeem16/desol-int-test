import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Define the schema
const carFormSchema = new Schema({
  userId: { type: String, required: true },
  carModel: { type: String, required: true },
  price: { type: Number, required: true },
  phoneNumber: { type: String, required: true },
  maxPictures: { type: Number, required: true },
  pictures: [{ type: String }] 
});

const Cars = mongoose.model('Cars', carFormSchema);

export default Cars
