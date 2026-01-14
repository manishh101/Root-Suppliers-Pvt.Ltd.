import connectDB from '../src/lib/db/connect';
import Settings from '../src/lib/db/models/Settings';

async function checkStats() {
  try {
    await connectDB();
    const settings = await Settings.findOne().lean();
    console.log('Settings found:', !!settings);
    console.log('Homepage settings:', JSON.stringify(settings?.homepage, null, 2));
    console.log('Stats:', JSON.stringify(settings?.homepage?.stats, null, 2));
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkStats();
