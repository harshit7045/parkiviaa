// Import necessary modules
import express, { response } from 'express';
import { connectMongoDB } from './mongodb.js';
import { addParkiingLot_repo, booking_repo, user,pakingSingninRepo } from './model.js'; // Import repository
import cors from 'cors';
import { sendbookingEmail } from './mailer.js';
import { checkBooking, checkEntered, dele, makeBooking, updateBooking } from '../jvavascript/iot.js';

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON in request body

// POST endpoint to book
app.post('/book', async (req, res) => {
  try {
    console.log('Booking request received');
    const data = {
      phoneNo: req.body.phone,
      city: req.body.pincode,
      time: new Date(req.body.date), // Parse req.body.date into a Date object
      entry: req.body.entry,
    };
    const userInput = new user();
    const userdata = await userInput.findUserPhone(req.body.phone)
    sendbookingEmail(userdata[0].email, userdata[0],req);
    //console.log(data.time.toTimeString()); // Accessing hours from the parsed Date object
    const booking = new booking_repo();
    await booking.book(data); // Assuming booking.book() is an asynchronous operation
    console.log("Response sent for '/book'");
    //console.log(data);
    res.json({ message: 'Booking successful' });
  } catch (error) {
    console.error('Error booking:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// PUT endpoint to find parking lot
app.put('/find', async (req, res) => {
  try {
    const { date } = req.body;
    if (!date) {
      throw new Error('Date is required');
    }
    const parkingLotRepo = new addParkiingLot_repo();
    const result = await parkingLotRepo.findlot(date);
    res.json({ message: 'Success', value: result });
    console.log('Parking lot found:', result);
  } catch (error) {
    console.error('Error finding parking lot:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// PUT endpoint to handle IoT data
app.put('/iot', async (req, res) => {
  console.log(req.body.message);
  let cbook = await checkBooking(req);
  if (cbook == true) {
    console.log('booking_found');
    let centerd = await checkEntered(req);
    if (centerd == true) {
      console.log('The vehical has entered allready');
      dele(req);
    } else {
      console.log(' the vahecal has not not_entered');
      updateBooking(req);
    }
  } else {
    console.log('booking id not found');
    makeBooking(req);
  }
});
app.put('/admin', async (req, res) => {
  //console.log(req.body.email);
  let log=new pakingSingninRepo;
  let user=await log.findpakingowner(req.body.email);
  //console.log(user);
  let lot= new addParkiingLot_repo;
  let lotdata=await lot.findlot(user[0].lotId);
  //console.log(lotdata)
  const per= (user[0].password==req.body.password);
  res.json({
    login:per,
    owner:user[0],
    lotd:lotdata[0]
  });

});
const PORT = process.env.PORT || 8000;
app.listen(PORT, async () => {
  try {
    await connectMongoDB(); // Connect to MongoDB Atlas
    console.log('Connected to MongoDB Atlas');
    console.log(`Server is running on port ${PORT}`);
    
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error);
  }
});
