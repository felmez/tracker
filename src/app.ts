require("dotenv").config();
import express from 'express';


import connectDB from './database/config';
import routes from './routes';


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", "views");

app.use('/api', routes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    connectDB();
});
