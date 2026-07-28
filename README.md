# Chat Video Generator

Convert your chat scripts into realistic animated video recordings that look like Instagram DM, iMessage, or WhatsApp.

## Features

✨ **Real-time preview** - See your chat as you type  
🎬 **Video generation** - Export as .webm video file  
🎨 **Multiple styles** - Instagram, iMessage, WhatsApp  
⚡ **Fast & responsive** - Built with Next.js  
📱 **Mobile friendly** - Works on all devices  

---

## 🚀 Deploy to Vercel (FREE & EASIEST)

### Step 1: Prepare Your Files

1. Download/copy these files to your computer:
   - `package.json`
   - `next.config.js`
   - `.gitignore`
   - `app/` folder (all files inside)

2. Create a new folder called `chat-video-generator` and put all files inside

### Step 2: Create a GitHub Account (Free)

1. Go to https://github.com/signup
2. Sign up with any email
3. Verify your email

### Step 3: Upload to GitHub

1. Go to https://github.com/new
2. Name it: `chat-video-generator`
3. Click "Create repository"
4. You'll see instructions. Follow this instead:

**On your computer:**
```bash
cd chat-video-generator
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/chat-video-generator.git
git push -u origin main
```

(Replace `YOUR_USERNAME` with your actual GitHub username)

### Step 4: Deploy to Vercel

1. Go to https://vercel.com/signup
2. Click **"Continue with GitHub"**
3. Authorize Vercel to access your GitHub
4. Click **"Import Project"**
5. Select your `chat-video-generator` repository
6. Click **"Import"** (leave settings as default)
7. Wait ~2 minutes for deployment ✅

**Done!** Your site will have a URL like:
```
https://chat-video-generator-xyz123.vercel.app
```

---

## 💻 Run Locally (For Testing)

If you want to test on your computer first:

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
# Go to http://localhost:3000
```

---

## 📝 How to Use

### Script Format

```
me: Hey! How are you?
him: I'm doing great!
me: What's up?
him: Not much, just chilling
```

Supported formats:
- `me:` - Your messages
- `him:` - Other person (male)
- `her:` - Other person (female)  
- `them:` - Other person (neutral)

### Generate Video

1. Paste your script
2. Choose chat style (Instagram/iMessage/WhatsApp)
3. Click "Generate Video"
4. Video downloads automatically as `.webm` file

### Convert Video Format

If you need MP4 or other formats, use free tools:
- **Online**: https://convertio.co (webm to mp4)
- **Windows**: Windows Media Player or VLC
- **Mac**: QuickTime Player
- **Online Editor**: https://www.kapwing.com

---

## 🛠️ Customization

### Change Colors

Edit `app/page.js` and find this section:

```javascript
const bgBubbleColor = isMine ? '#007AFF' : '#E5E5EA'
```

- `#007AFF` = Your message color (blue)
- `#E5E5EA` = Their message color (gray)

### Add More Chat Styles

In `app/page.js`, add new style options to the select:

```javascript
<option value="telegram">Telegram</option>
<option value="discord">Discord</option>
```

### Adjust Video Speed

In `app/page.js`, change this line:

```javascript
const messageDelay = idx * 1000  // 1000ms = 1 second between messages
```

Lower = faster video, Higher = slower video

---

## 📋 Troubleshooting

### "Video won't generate"
- Try a different browser (Chrome/Firefox work best)
- Check that you have at least 2 messages
- Try smaller messages (fewer characters)

### "Video downloads but won't play"
- Download a media player: VLC (free)
- Or convert to MP4 using Convertio.co

### "Page shows error"
- Hard refresh: Press Ctrl+Shift+R (or Cmd+Shift+R on Mac)
- Clear browser cache

### "Can't push to GitHub"
- Make sure you're in the correct folder: `cd chat-video-generator`
- Replace YOUR_USERNAME with your actual GitHub username
- Try again slowly, line by line

---

## 📚 File Structure

```
chat-video-generator/
├── app/
│   ├── layout.js           # Main layout
│   ├── page.js             # Main component
│   ├── page.module.css     # Styles
│   └── globals.css         # Global styles
├── package.json            # Dependencies
├── next.config.js          # Next.js config
├── .gitignore             # Git ignore
└── README.md              # This file
```

---

## 🎯 Next Steps

After deployment:

1. ✅ Share your site URL with friends
2. ✅ Test with different chat scripts
3. ✅ Download and share videos
4. ✅ Customize colors/styles if desired
5. ✅ Export videos to TikTok, Instagram, YouTube

---

## 💡 Tips

- **Shorter messages** = Better videos
- **More messages** = Longer video
- **Use emojis** in scripts - they'll show in preview
- **Test locally first** if you're making changes

---

## Need Help?

- **Vercel docs**: https://vercel.com/docs
- **Next.js docs**: https://nextjs.org/docs
- **Video format issues**: Use https://convertio.co to convert .webm to .mp4

---

Enjoy! 🎬✨
