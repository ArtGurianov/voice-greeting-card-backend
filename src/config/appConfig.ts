export interface PGConfig {
  pgUrl: string
  // pgHost: string
  // pgPort: number
  // pgUsername: string
  // pgPassword: string
  // pgDatabase: string
  // pgTestDatabase: string
}

export default () => ({
  nodeEnv: process.env.NODE_ENV,
  frontendHostUrl: process.env.FRONTEND_HOST_URL,
  witaiKey: process.env.WITAI_KEY,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  superAdminEmail: process.env.SUPER_ADMIN_EMAIL,
  superAdminPassword: process.env.SUPER_ADMIN_PASSWORD,
  s3BucketUrl: process.env.S3_BUCKET_URL,
  s3BucketName: process.env.S3_BUCKET_NAME,
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  awsRegion: process.env.AWS_REGION,
  redisUrl: process.env.REDIS_URL,
  pg: {
    pgUrl: process.env.PG_URL,
    // pgHost: process.env.PG_HOST,
    // pgPort: process.env.PG_PORT,
    // pgUsername: process.env.PG_USERNAME,
    // pgPassword: process.env.PG_PASSWORD,
    // pgDatabase: process.env.PG_DATABASE,
    // pgTestDatabase: process.env.PG_TEST_DATABASE,
  },
})
