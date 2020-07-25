import {NestFactory} from '@nestjs/core'
import {NestExpressApplication} from '@nestjs/platform-express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import {AppModule} from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.use(helmet())
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 10000, // limit each IP to 100 requests per windowMs
    }),
  )
  app.set('trust proxy', 1)
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
  //initializing global guard in appModule
  //app.useGlobalGuards(new RolesGuard(new Reflector()))
  app.enableShutdownHooks()
  await app.listen(8000)
}
bootstrap()
