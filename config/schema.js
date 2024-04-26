import mongoose from "mongoose";

export const booking_schema = new mongoose.Schema({
    phoneNo: String,
    city: String,
    time: Date,
    entry: { type: Boolean, default: false }
}, { collection: 'vehicle_data' });

export const parkingLotSchema = new mongoose.Schema({
    pinCode: String,
    name: String,
    location: String,
    capacity: Number,
    tolalCapicity:Number
    
}, { collection: 'parking_lot_data' });

export const lotLogin = new mongoose.Schema({
    email: String,
    lotId: String,
    password: String
}, { collection: 'Lot_login' });

export const user_data = new mongoose.Schema({
    Name: String,
    Uid: String,
    PhoneNo: String,
    email: String,
    city: String,
    balence: Number
}, { collection: 'User_data' });

