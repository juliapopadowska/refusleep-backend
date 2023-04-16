import mongoose, { Schema } from "mongoose";

const PlaceSchema = new Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  city: String,
  type: String,
  address: String,
  polishDetails: String,
  englishDetails: String,
  germanDetails: String,
  ukrainianDetails: String,
  photos: [String],
  phoneNumber: String,
});

const PlaceModel = mongoose.model("Place", PlaceSchema);

export default PlaceModel;
