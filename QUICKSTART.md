# ⚡ QUICK START - For Complete Beginners

**Never used Node.js before? No problem!**

---

## 🎯 Goal
Get the Switch app running on your laptop in **5 minutes**.

---

## 📋 Step-by-Step (Copy & Paste Each Command)

### **Step 1: Install Node.js**

1. Go to: **https://nodejs.org/**
2. Download the **LTS version** (big green button)
3. Run the installer
4. Click "Next" → "Next" → "Install" → "Finish"
5. **Restart your terminal/command prompt**

**Verify installation:**
```bash
node --version
```
Should show: `v18.x.x` or higher ✅

---

### **Step 2: Download Project Files**

You should have a folder with these files:
```
switch-app/
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── index.html
├── README.md
├── setup.sh
└── src/
    ├── main.jsx
    ├── index.css
    └── App.jsx
```

---

### **Step 3: Open Terminal**

**On Windows:**
- Press `Windows + R`
- Type: `cmd`
- Press Enter

**On Mac:**
- Press `Cmd + Space`
- Type: `terminal`
- Press Enter

**On Linux:**
- Press `Ctrl + Alt + T`

---

### **Step 4: Navigate to Project Folder**

```bash
# Replace with your actual path
cd /path/to/switch-app

# Example Windows:
cd C:\Users\YourName\Desktop\switch-app

# Example Mac:
cd ~/Desktop/switch-app
```

---

### **Step 5: Install Dependencies**

Copy and paste this command:

```bash
npm install
```

This will:
- Download all required packages
- Takes 1-2 minutes
- Creates a `node_modules` folder

**Wait until you see:** ✅ `added 200 packages`

---

### **Step 6: Run the App**

Copy and paste this command:

```bash
npm run dev
```

**You should see:**
```
  VITE v5.0.8  ready in 300 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.1.5:3000/
  ➜  press h + enter to show help
```

---

### **Step 7: Open in Browser**

1. Open **Google Chrome**
2. Go to: **http://localhost:3000**
3. You should see the Switch app! 🎉

---

## 🎨 What You'll See

1. **Onboarding screens** (3 pages)
2. **Home page** with job cards
3. **Swipe the cards!**
   - Drag left = Skip
   - Drag right = Apply
4. **Bottom tabs** to navigate

---

## 📱 Test on Your Phone

### **Find Your Laptop's IP:**

**Windows:**
```bash
ipconfig
```
Look for: `IPv4 Address: 192.168.1.5`

**Mac/Linux:**
```bash
ifconfig
```
Look for: `inet 192.168.1.5`

### **Open on Phone:**
1. Connect phone to **same WiFi** as laptop
2. Open phone browser
3. Go to: `http://192.168.1.5:3000` (use your IP)
4. Swipe the cards on your phone! 📱

---

## ⚠️ Troubleshooting

### **Problem: "npm: command not found"**
**Solution:** 
- Node.js not installed properly
- Restart terminal after installing Node.js
- Try: `node --version` first

### **Problem: "Cannot find package.json"**
**Solution:**
- You're in the wrong folder
- Use `cd` command to navigate to project folder
- Check with: `ls` (Mac/Linux) or `dir` (Windows)

### **Problem: Port 3000 already in use**
**Solution:**
- Another app is using port 3000
- Kill that app or change port
- Edit `vite.config.js`, change `port: 3000` to `port: 3001`

### **Problem: "Cannot access on phone"**
**Solution:**
- Check both devices on same WiFi
- Windows Firewall might be blocking
- Try: `npm run dev -- --host`

### **Problem: "Module not found"**
**Solution:**
- Dependencies not installed
- Run: `npm install` again
- Delete `node_modules` folder and run `npm install`

---

## 🛑 Stop the App

Press: **Ctrl + C** in terminal (Mac/Windows/Linux)

---

## 🔄 Restart the App

```bash
npm run dev
```

---

## 📊 That's It!

**You're now running the Switch app locally! 🎉**

### **Next Steps:**
1. ✅ Play with the app
2. ✅ Edit code in `src/App.jsx`
3. ✅ Changes appear automatically (hot reload)
4. ✅ Deploy to production (see README.md)

### **Happy coding! 💚**

---

## 🆘 Still Stuck?

Check:
1. Node.js version: `node --version` (needs v18+)
2. In correct folder: `ls` should show `package.json`
3. Internet connection (for `npm install`)
4. Firewall/antivirus not blocking

---

**Questions?** Read the full README.md for detailed info!
