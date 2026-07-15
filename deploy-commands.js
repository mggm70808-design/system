require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');

if (!process.env.DISCORD_TOKEN || !process.env.CLIENT_ID) {
  console.error('❌ خطأ: تأكد من تحديد DISCORD_TOKEN و CLIENT_ID في ملف .env');
  process.exit(1);
}

const commands = [];
const commandsPath = path.join(__dirname, 'src', 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  if (command?.data) commands.push(command.data.toJSON());
}

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log(`🚀 جاري رفع ${commands.length} أمر سلاش...`);

    let route;
    if (process.env.GUILD_ID) {
      route = Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID);
      console.log(`📍 سيتم الرفع على السيرفر المحدد (GUILD_ID) فقط - تظهر فورًا.`);
    } else {
      route = Routes.applicationCommands(process.env.CLIENT_ID);
      console.log(`🌍 سيتم الرفع عالميًا (Global) - قد تأخذ حتى ساعة لتظهر أول مرة.`);
    }

    const data = await rest.put(route, { body: commands });
    console.log(`✅ تم رفع ${data.length} أمر سلاش بنجاح!`);
  } catch (error) {
    console.error('❌ فشل رفع الأوامر:', error);
  }
})();
