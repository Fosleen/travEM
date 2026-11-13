// Read-only provider smoke test. Never imports application models or writes destinations.
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
dotenv.config({ path: fileURLToPath(new URL('../.env', import.meta.url)) });
const { createMeteostatService } = await import('../app/services/meteostatService.js');
const service = createMeteostatService();
for (const [name, latitude, longitude] of [
  ['Zagreb', 45.815, 15.9819], ['Split', 43.5081, 16.4402], ['Istanbul', 41.0082, 28.9784],
]) {
  try {
    const result = await service.preview({ latitude, longitude });
    console.log(JSON.stringify({ name, months: result.months.length, january: result.months[0], july: result.months[6], cached: result.cached, budget: result.budget }));
  } catch (error) {
    console.error(JSON.stringify({ name, status: error.status || 503, error: error.status ? error.message : 'Provjera nije uspjela.' }));
    process.exitCode = 1;
    break;
  }
}
