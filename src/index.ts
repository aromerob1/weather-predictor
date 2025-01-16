import express from 'express';
import dotenv from 'dotenv';

import weatherRouter from './routes/weather';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Routes
app.use('/api/weather', weatherRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});