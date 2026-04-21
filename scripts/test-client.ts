import { createClient } from '../utils/supabase/client';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

function testClient() {
  try {
    createClient();
    console.log('✅ Client created successfully!');
    console.log('🔗 Project URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  } catch (error) {
    console.error('❌ Client creation failed!');
    console.error(error);
  }
}

testClient();
