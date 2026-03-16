import app from './app';
import dotenv from 'dotenv';
import { initCache } from './lib/cache';
dotenv.config();

const PORT = process.env.PORT || 3000;

initCache().catch((error) => {
  console.warn('[cache] Startup cache initialization failed', error);
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
