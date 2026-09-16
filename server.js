import app from './src/app.js';
import connectDB from './src/config/database.js';
import cors from 'cors';

app.use(cors({origin:"http://localhost:5173", credentials:true}));

connectDB();

app.listen(3000, () => {
   console.log("server is running");
})