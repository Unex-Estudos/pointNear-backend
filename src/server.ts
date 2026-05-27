import { app } from './app';
import { env } from './config/env';

app.listen(env.PORT, () => {
  console.log(`PointNear API running on http://localhost:${env.PORT}`);
  console.log(`Swagger docs available on http://localhost:${env.PORT}/api/docs`);
});
