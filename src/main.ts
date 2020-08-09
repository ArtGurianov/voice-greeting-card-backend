import {NestFactory} from '@nestjs/core'
import {NestExpressApplication} from '@nestjs/platform-express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import {WINSTON_MODULE_NEST_PROVIDER} from 'nest-winston'
import {AppModule} from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER))
  app.use(helmet())
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 10000, // limit each IP to 100 requests per windowMs
    }),
  )
  app.set('trust proxy', 1)
  app.enableCors({
    origin: process.env.FRONTEND_HOST_URL,
    credentials: true,
  })
  app.enableShutdownHooks()
  await app.listen(8000)
}
bootstrap()
