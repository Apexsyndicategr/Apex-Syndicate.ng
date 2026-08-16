import express from 'express';
import apiRoutes from '../server/routes/api';

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/api', apiRoutes);

export default app;
