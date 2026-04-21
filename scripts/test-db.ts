import postgres from 'postgres';
import * as dotenv from 'dotenv';
dotenv.config();

async function testConnection() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error('❌ DATABASE_URL is not set in .env file');
    process.exit(1);
  }

  console.log(`🔍 Testing connection to: ${url.split('@')[1]}`);
  
  const sql = postgres(url, { max: 1, connect_timeout: 5 });

  try {
    const result = await sql`SELECT version()`;
    console.log('✅ Connection successful!');
    console.log(`📊 DB Version: ${result[0].version}`);

    // 실제 데이터 조회 테스트 추가
    console.log('🔍 Testing actual table query (rooms)...');
    const rooms = await sql`SELECT count(*) FROM rooms`;
    console.log(`✅ Table query successful! Total rooms: ${rooms[0].count}`);
  } catch (error) {
    console.error('❌ Connection failed!');
    if (error instanceof Error) {
      const err = error as Error & { code?: string };
      if (err.code === 'ENOTFOUND') {
        console.error('👉 Error: Hostname not found. Please check if DATABASE_URL host is correct.');
      } else {
        console.error(`👉 Error Details: ${err.message}`);
      }
    }
  } finally {
    await sql.end();
  }
}

testConnection();
