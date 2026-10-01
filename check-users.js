/**
 * Quick script to check all users in Supabase database
 * Run with: node check-users.js
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tegsmahtigsrgjvsnzef.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlZ3NtYWh0aWdzcmdqdnNuemVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyNDI4NjAsImV4cCI6MjEwMzgxODg2MH0.LuIjUaFfyd59NzSpC6DgiXXjL1Jn0WtXEMohMhX2uzY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUsers() {
  console.log('🔍 Checking all users in database...\n');

  try {
    // Query 1: Get all profiles (public data)
    console.log('📋 Query 1: Fetching all profiles...');
    const { data: profiles, error: profilesError, count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (profilesError) {
      console.error('❌ Error fetching profiles:', profilesError);
      console.log('Error code:', profilesError.code);
      console.log('Error message:', profilesError.message);
      console.log('Error details:', profilesError.details);
    } else {
      console.log(`✅ Found ${profiles.length} users in profiles table\n`);
      
      if (profiles.length === 0) {
        console.log('⚠️ No users found in profiles table!');
      } else {
        console.log('👥 USER LIST:');
        console.log('='.repeat(120));
        profiles.forEach((user, index) => {
          console.log(`\n${index + 1}. ${user.email || 'No email'}`);
          console.log(`   Name: ${user.full_name || 'N/A'}`);
          console.log(`   Phone: ${user.phone || 'N/A'}`);
          console.log(`   Role: ${user.role || 'N/A'}`);
          console.log(`   User Type: ${user.user_type || 'N/A'}`);
          console.log(`   Verification: ${user.verification_status || 'N/A'}`);
          console.log(`   Created: ${new Date(user.created_at).toLocaleString()}`);
        });
        console.log('\n' + '='.repeat(120));
      }
    }

    // Query 2: Check role distribution
    console.log('\n📊 Role Distribution:');
    const roleCount = {};
    profiles?.forEach(p => {
      const role = p.role || 'no_role';
      roleCount[role] = (roleCount[role] || 0) + 1;
    });
    Object.entries(roleCount).forEach(([role, count]) => {
      console.log(`   ${role}: ${count}`);
    });

    // Query 3: Check user_type distribution
    console.log('\n📊 User Type Distribution:');
    const typeCount = {};
    profiles?.forEach(p => {
      const type = p.user_type || 'no_type';
      typeCount[type] = (typeCount[type] || 0) + 1;
    });
    Object.entries(typeCount).forEach(([type, count]) => {
      console.log(`   ${type}: ${count}`);
    });

    // Query 4: Try using service_role to bypass RLS (if you have the key)
    console.log('\n\n🔓 Attempting to check auth.users table...');
    console.log('⚠️ This requires service_role key (not included for security)');
    console.log('   Go to Supabase Dashboard -> Settings -> API -> service_role key');
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

checkUsers().then(() => {
  console.log('\n✅ Check complete!');
  process.exit(0);
});
