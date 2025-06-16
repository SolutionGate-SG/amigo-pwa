const { createClient } = require('@supabase/supabase-js');

const supabase = createClient('https://tyoxrabjrcpqfomzkmvx.supabase.co', '<ANON_KEY>');

async function testGoogleLogin() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: 'http://localhost:3000/auth/callback' },
  });
  if (error) console.error('Error:', error);
  console.log('Open this URL:', data.url);
}

testGoogleLogin();