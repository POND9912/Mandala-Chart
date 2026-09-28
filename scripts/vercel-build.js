// Build entry for Vercel: generate the Prisma client, apply migrations, build Next.
//
// schema.prisma reads the migration (unpooled) URL from DATABASE_URL_UNPOOLED.
// Different Postgres providers name that variable differently, so fill it in
// from whichever one exists, falling back to DATABASE_URL.
const { execSync } = require('child_process');

const CANDIDATES = ['DATABASE_URL_UNPOOLED', 'POSTGRES_URL_NON_POOLING', 'DIRECT_URL', 'DATABASE_URL'];

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set — add a Postgres database to this Vercel project first.');
  process.exit(1);
}

// NextAuth throws NO_SECRET on every request in production without this,
// so fail the build instead of shipping a site that 500s.
if (!process.env.NEXTAUTH_SECRET) {
  console.error('NEXTAUTH_SECRET is not set — add it in Settings → Environment Variables, then redeploy.');
  process.exit(1);
}

const source = CANDIDATES.find((name) => process.env[name]);
process.env.DATABASE_URL_UNPOOLED = process.env[source];
console.log(`Migrations will use ${source}`);

for (const cmd of ['prisma generate', 'prisma migrate deploy', 'next build']) {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { stdio: 'inherit', env: process.env });
}
