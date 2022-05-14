const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();

let app = express();
app.listen(8080, () => console.log('App is running on port 8080'));
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use('/snippet', require('./routers/snippetRouter'));
app.use('/auth', require('./routers/userRouter'));

mongoose.connect(process.env.MDB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if (err) return console.error(err);
    console.log('connected to mongoDB');
});

// mongodb+srv://shayan:<password>@cluster0.wyxq0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority