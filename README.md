# 🤖 Little House — بوت ديسكورد شامل

بوت ديسكورد متكامل يحتوي على 34 أمر سلاش: نظام تذاكر، تحذيرات، إشراف كامل، قيف اواي، نظام تقديمات، وقوانين.

## 📋 قائمة الأوامر

**عام:** `/ping` `/avatar` `/banner` `/server` `/user` `/roles`

**إشراف:** `/ban` `/unban` `/kick` `/timeout` `/rtimeout` `/mute` `/unmute` `/warn` `/warns` `/unwarn` `/clear` `/lock` `/unlock` `/hide` `/unhide` `/move` `/role` `/rrole` `/setnick`

**رسائل:** `/say with-embed` `/say without-embed`

**التذاكر:** `/ticket-setup channel` `/ticket` `/add-type add|list|remove`

**التقديمات:** `/apply setup` `/apply status` `/apply clear`

**أخرى:** `/rules setup` `/giveaway` `/setup channels|config|test` `/stats admin|leaderboard`

---

## 🚀 خطوات التشغيل

### 1) إنشاء البوت في ديسكورد

1. روح إلى: https://discord.com/developers/applications
2. اضغط **New Application** واختر اسم.
3. من القائمة الجانبية اذهب لـ **Bot** → اضغط **Reset Token** وانسخ التوكن (خله سري، ما تشاركه مع أحد).
4. في نفس صفحة Bot، فعّل هذه الخيارات تحت **Privileged Gateway Intents**:
   - `SERVER MEMBERS INTENT`
   - `MESSAGE CONTENT INTENT`
5. من القائمة الجانبية اذهب لـ **OAuth2 → URL Generator**:
   - في **Scopes** اختر: `bot` و `applications.commands`
   - في **Bot Permissions** اختر: `Administrator` (أسهل خيار)، أو حدد الصلاحيات المطلوبة يدويًا (إدارة الرتب، القنوات، الرسائل، الطرد، الحظر، التايم آوت).
   - انسخ الرابط اللي يطلع بالأسفل وافتحه بالمتصفح لإضافة البوت لسيرفرك.
6. من صفحة **General Information** انسخ **Application ID** (هذا هو الـ `CLIENT_ID`).

### 2) تجهيز الملفات محليًا (اختياري للتجربة قبل الرفع)

```bash
npm install
cp .env.example .env
# افتح .env وحط فيه التوكن والـ CLIENT_ID
npm run deploy   # يرفع أوامر السلاش لديسكورد
npm start        # يشغّل البوت
```

---

## ☁️ الرفع على Railway (خطوة بخطوة)

### الطريقة 1: عن طريق GitHub (موصى بها)

1. ارفع مجلد المشروع إلى مستودع GitHub جديد:
   ```bash
   cd little-house
   git init
   git add .
   git commit -m "أول رفعة للبوت"
   git branch -M main
   git remote add origin https://github.com/USERNAME/REPO.git
   git push -u origin main
   ```
2. روح إلى https://railway.app وسجل دخول (يفضل بحساب GitHub).
3. اضغط **New Project** → **Deploy from GitHub repo** → اختر المستودع اللي رفعته.
4. Railway بيكتشف تلقائيًا إنه مشروع Node.js ويبدأ البناء.
5. اذهب لتبويب **Variables** وأضف المتغيرات التالية:
   - `DISCORD_TOKEN` = توكن البوت
   - `CLIENT_ID` = آيدي التطبيق
   - `GUILD_ID` = (اختياري) آيدي سيرفرك لو تبي الأوامر تظهر فورًا وقت التجربة
6. اذهب لتبويب **Settings** وتأكد إن:
   - **Start Command** = `npm start`
7. **مهم جدًا:** أوامر السلاش لازم تُرفع مرة وحدة لديسكورد. افتح تبويب **Settings** في Railway وأضف كـ **Custom Deploy/Build step**، أو ببساطة شغّل مرة وحدة من جهازك:
   ```bash
   npm run deploy
   ```
   (يكفي تسويها مرة واحدة من جهازك محليًا بنفس التوكن، أو تضيف `npm run deploy &&` قبل أمر start في Railway بشكل مؤقت أول مرة فقط).
8. بعد نجاح الرفع، Railway بيشغل البوت تلقائيًا ويبقى شغّال 24/7. أي تحديث ترفعه على GitHub، Railway بيحدث البوت تلقائيًا.

### الطريقة 2: عن طريق Railway CLI (بدون GitHub)

```bash
npm install -g @railway/cli
railway login
cd little-house
railway init
railway up
```
بعدها روح للوحة تحكم railway.app وأضف نفس المتغيرات (`DISCORD_TOKEN`, `CLIENT_ID`) من تبويب Variables، وشغّل `npm run deploy` محليًا مرة واحدة لرفع أوامر السلاش.

### ⚠️ ملاحظة عن قاعدة البيانات

البوت يستخدم SQLite (ملف `data/neon.sqlite`) يُنشأ تلقائيًا. على Railway، نظام الملفات **يُعاد تصفيره مع كل إعادة نشر (redeploy)** إلا إذا أضفت **Volume**:

1. في مشروعك على Railway اذهب لتبويب **Volumes**.
2. اضغط **New Volume** واربطه بمسار `/app/data`.
3. بهذا تبقى بيانات التذاكر والتحذيرات والتقديمات محفوظة حتى بعد أي تحديث.

---

## ⚙️ بعد التشغيل مباشرة

1. `/setup channels` — حدد كاتيجوري التذاكر وروم السجل ورتبة الإدارة.
2. `/ticket-setup channel` — حدد نفس الكاتيجوري (أو كاتيجوري تانية) لإنشاء رومات التذاكر فيها.
3. `/add-type add` — أضف أنواع التذاكر (دعم فني، شكوى، استفسار...).
4. `/ticket` — أرسل لوحة فتح التذاكر في الروم اللي تبيه.
5. `/apply setup` — لتفعيل نظام التقديم على وظيفة الإدارة.
6. `/rules setup` — لنشر القوانين (مع رتبة تلقائية اختيارية).
7. `/setup test` — للتأكد إن كل شي شغّال صح (صلاحيات + قاعدة البيانات).

بالتوفيق! 🚀
