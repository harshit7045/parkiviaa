
import { user, booking_repo, bookingModel, addParkiingLot_repo, parkingModel } from "../config/model.js";
import { sendbookingEmail, sendexitEmail } from "../config/mailer.js";
async function checkBooking(req) {
    try {
        const use = new user();
        const use1 = await use.findUser(req.body.message);
        console.log("Founded user by uid");
        const booking = new booking_repo();
        const book = await booking.findBooking(use1[0].PhoneNo);
        
        return book.length > 0;
    } catch (error) {
        console.error('Error checking booking:', error.message);
        return false;
    }
}


async function checkEntered(req) {
    try {
        const use = new user();
        const use1 = await use.findUser(req.body.message);
        const booking = new booking_repo();
        const book = await booking.findBooking(use1[0].PhoneNo);
        // console.log(book)
        console.log(book[0].entry == true)
        return book[0].entry == true;
    } catch (error) {
        console.error('Error checking entry:', error.message);

    }
}


async function makeBooking(req) {
    try {
        const userInput = new user();
        const userdata = await userInput.findUser(req.body.message);

        console.log("a new on time booking is made");
        const data = {
            pincode: req.body.pincode.toString(),
            date: new Date(),
            phone: userdata[0].PhoneNo,
            entry: true
        };
        const lot = new addParkiingLot_repo;
        console.log('occupancy+1');
        const lotdata = await lot.findlot(req.body.pincode);
        await parkingModel.updateOne(
            { pinCode: data.pincode },
            { $set: { capacity: lotdata[0].capacity + 1 } }
        );


        sendbookingEmail(userdata[0].email, userdata[0], data);
        const response = await fetch('http://localhost:8000/book', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Add any other headers as needed
            },
            body: JSON.stringify(data)
        });
        console.log('Booking request sent successfully.');
    } catch (error) {
        console.error('Error making booking:', error.message);
    }

}

async function updateBooking(req) {
    try {
        console.log("the vehical has enterd after websitte booking");
        const userInput = new user();
        const userdata = await userInput.findUser(req.body.message);
        await bookingModel.updateOne(
            { phoneNo: userdata[0].PhoneNo },
            { $set: { entry: true } }
        );
        const lot = new addParkiingLot_repo;
        console.log('occupancy+1');
        const lotdata = await lot.findlot(req.body.pincode);
        let pin = req.body.pincode;
        await parkingModel.updateOne(
            { pinCode: pin.toString() },
            { $set: { capacity: lotdata[0].capacity + 1 } }
        );
        console.log('Booking entry updated successfully.');
    } catch (error) {
        console.error('Error updating booking:', error.message);
    }
}
async function dele(req) {
    let booking = new booking_repo;
    const userInput = new user();
    const userdata = await userInput.findUser(req.body.message);
    let x = await booking.findBooking(userdata[0].PhoneNo);
    booking.deleteBookingsByPhone(userdata[0].PhoneNo);
    const lot = new addParkiingLot_repo;
    console.log('occupancy-1');
    const lotdata = await lot.findlot(req.body.pincode);
    let pin = req.body.pincode;
    let rate=(Date.now()-x[0].time.getTime())/6000;
    sendexitEmail(userdata[0].email, userdata[0], rate);
    await parkingModel.updateOne(
        { pinCode: pin.toString() },
        { $set: { capacity: lotdata[0].capacity - 1 } }
    );


    console.log("deleted")
}

export { checkBooking, checkEntered, makeBooking, updateBooking, dele };
