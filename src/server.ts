import { app } from './app';
import { environment } from './config/environment';
import { AppDataSource } from './database/data-source';

AppDataSource.initialize()
  .then(() => {
    app.listen(environment.PORT, () => {
      console.log(`PointNear API running on port ${environment.PORT}`);
      console.log(`Swagger docs available at ${environment.API_BASE_URL}/docs`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed', error);
    process.exit(1);
  });
