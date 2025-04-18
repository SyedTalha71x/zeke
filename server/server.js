import express from 'express'
import cors from 'cors'
import connectToDB from './Utils/db.js';
import { configDotenv } from 'dotenv';
import UserRoutes from './Routes/user-routes.js'
import CardRoutes from './Routes/card-routes.js'
import CardPackRoutes from './Routes/card-pack-routes.js'
import ProfileRoutes from './Routes/profile-routes.js'
import AdminRoutes from './Routes/admin-routes.js'
import ContactRoutes from './Routes/contact-routes.js'
import PaymentIntentRoute from './Routes/payment-intent-routes.js'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


configDotenv();
connectToDB();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/api', UserRoutes)

app.use('/api', CardRoutes)
app.use('/api', CardPackRoutes)

app.use('/api', ProfileRoutes)
app.use('/api', AdminRoutes)
app.use('/api', ContactRoutes)
app.use('/api', PaymentIntentRoute)

app.get('/', (req, res) => {
    res.send('Server is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})