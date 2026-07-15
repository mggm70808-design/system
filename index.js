require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Collection, Partials } = require('discord.js');
const { initDB } = require('./src/database'); // التعديل: استدعاء دالة تهيئة القاعدة

if (!process.env.DISCORD_TOKEN) {
  console.error('❌ خطأ: لم يتم تحديد DISCORD_TOKEN في متغيرات البيئة (.env).');
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
  partials: [Partials.Channel, Partials.Message, Partials.GuildMember, Partials.User],
});

client.commands = new Collection();

// تحميل الأوامر
const commandsPath = path.join(__dirname, 'src', 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  if (command?.data && command?.execute) {
    client.commands.set(command.data.name, command);
  } else {
    console.warn(`⚠️ الملف ${file} لا يحتوي على data أو execute صحيحة.`);
  }
}

// تحميل الأحداث
const eventsPath = path.join(__dirname, 'src', 'events');
const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith('.js'));
for (const file of eventFiles) {
  const event = require(path.join(eventsPath, file));
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.on('error', (err) => console.error('خطأ في العميل:', err));
process.on('unhandledRejection', (err) => console.error('Unhandled rejection:', err));

// التعديل: دالة لتشغيل البوت وقاعدة البيانات بالترتيب
async function startBot() {
  try {
    await initDB(); // تشغيل وتجهيز جداول PostgreSQL أولاً
    await client.login(process.env.DISCORD_TOKEN); // ثم تشغيل البوت
  } catch (err) {
    console.error('❌ حدث خطأ أثناء تشغيل البوت أو قاعدة البيانات:', err);
  }
}

startBot();