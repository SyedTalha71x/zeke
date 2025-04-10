import express from 'express'
import cors from 'cors'
import connectToDB from './Utils/db.js';
import { configDotenv } from 'dotenv';
import UserRoutes from './Routes/user-routes.js'

configDotenv();
connectToDB();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', UserRoutes)

app.get('/', (req, res) => {
    res.send('Server is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})