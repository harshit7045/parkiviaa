import mongoose from "mongoose";
import { booking_schema, parkingLotSchema, lotLogin, user_data } from "./schema.js";

export const bookingModel = mongoose.model('booking data', booking_schema);
export const parkingModel = mongoose.model('lot data', parkingLotSchema);
const lotloginModel = mongoose.model('lot login', lotLogin);
const userModel = mongoose.model('User_data', user_data);

export class booking_repo {
  async book(booking) {
    const newBooking = new bookingModel(booking);
    await newBooking.save();
    console.log("Booking saved successfully");
  }
  async findBooking(phone) {
    const booking = bookingModel.find({ phoneNo: phone });
    return booking;
  }
  async deleteBookingsByPhone(phone) {
    try {
      const result = await bookingModel.deleteMany({ phoneNo: phone });
      console.log(`${result.deletedCount} booking(s) deleted for phone number: ${phone}`);
      return result;
    } catch (error) {
      console.error('Error deleting bookings:', error.message);
      throw error;
    }
  }

}

export class addParkiingLot_repo {
  async addParkiingLot(lot) {
    const newLot = new parkingModel(lot);
    await newLot.save();
    console.log("Parking lot added");
  }
  async findlot(str) {
    const lot = await parkingModel.find({ pinCode: str });
    return lot;
  }
}

export class pakingSingninRepo {
  async lot(signin) {
    const newSign = new lotloginModel(signin);
    await newSign.save();
    console.log('Parking data added');
  }
  async findpakingowner(str) {
    const lot = await lotloginModel.find({email: str });
    return lot;
  }
}
export class user {
  async user_put(data) {
    const newUser = new userModel(data);
    await newUser.save();
    console.log("user added")
  }
  async findUser(str) {
    const userf = await userModel.find({
      Uid: str
    });
    return userf;
  }
  async findUserPhone(str) {
    const userf = await userModel.find({
      PhoneNo: str
    });
    return userf;
  }
}
