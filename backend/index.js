const express = require('express');
const app = express();
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require('cors');
const userRoutes = require("./routes/userRoutes");
const testRoutes = require("./routes/testRoutes"); // Corrected the variable name
const submissionRoute=require('./routes/submissionRoute')
dotenv.config();
connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/test', testRoutes); 
app.use('/api/submissions',submissionRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
