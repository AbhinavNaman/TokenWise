import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { fetchAndStoreTopHolders } from './services/tokenHolderService';
import { pollWalletActivity } from './services/txMonitorService';
import insightRoutes from './routes/insightRoutes';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('TokenWise backend running!');
});


app.use('/api/insights', insightRoutes);


setInterval(() => {
  pollWalletActivity().catch(console.error);
}, 60000); // every 60 sec

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  fetchAndStoreTopHolders()
  .then(() => console.log("Top holders fetched ✅"))
  .catch(console.error);
});
