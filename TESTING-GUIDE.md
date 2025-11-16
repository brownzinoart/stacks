# 📱 Stacks App - Tester Guide

## For Testers: How to Install

### iPhone Users

1. Click the Diawi link we sent you
2. Tap "Install application"
3. When prompted, tap "Allow" to download
4. Go to Settings → General → Device Management
5. Trust "Stacks Library" developer
6. Open the app!

### Android Users

1. Click the Diawi link we sent you
2. Tap "Install application"
3. If blocked, go to Settings → Security → Install unknown apps
4. Allow Chrome/your browser to install apps
5. Open the APK and install
6. Open Stacks from your app drawer!

## What to Test

- [ ] Can you browse books?
- [ ] Does search work?
- [ ] Can you add books to your queue?
- [ ] Any crashes or freezes?
- [ ] Does it feel fast enough?

## Report Issues

Send us a screenshot and what you were doing when it happened!

---

# 🚀 For the Founder: Your Testing Playbook

## Fastest Way to Get Testing Today

### Option 1: Diawi (Recommended - No Setup!)

1. **For iOS**, open Xcode:

   ```bash
   cd mobile
   npx cap open ios
   ```

   - In Xcode: Product → Archive
   - Once done: Window → Organizer
   - Select your archive → Distribute App
   - Choose "Development" → Next → Next
   - Export to Desktop

2. **For Android**, you need Java installed first:

   ```bash
   # Install Java (one time)
   brew install openjdk

   # Then build
   cd mobile
   npx cap build android
   ```

3. **Upload to Diawi**:
   - Go to https://www.diawi.com
   - Drag your .ipa (iOS) or .apk (Android)
   - Get instant link to share!

### Option 2: Direct Install (Your Phone Only)

**Fastest for your own testing:**

```bash
# iOS - Connect your iPhone
cd mobile
npx cap run ios --device

# Android - Connect your Android
cd mobile
npx cap run android --device
```

### Option 3: TestFlight (Best for Ongoing Testing)

**Worth it if testing for more than a week:**

1. Get Apple Developer account ($99/year)
2. Use Xcode to upload to App Store Connect
3. Add testers in TestFlight
4. They get professional install experience

## Pro Tips for Founders

### 🎯 Testing Strategy

1. **Week 1-2**: Use Diawi for rapid iteration
2. **Week 3+**: Move to TestFlight for iOS
3. **Android**: Stick with APK sharing (it's easier)

### 📊 Collect Feedback Fast

- Create a simple Google Form
- Ask 3 questions max:
  1. What confused you?
  2. What did you love?
  3. Would you use this daily?

### 🔄 Iteration Speed

- Diawi links expire in 72 hours (perfect for rapid updates)
- You can update daily without app store delays
- Testers just click the new link

### 💡 Founder Hacks

1. **Test Group**: Start with 5-10 close contacts
2. **Version Names**: Use dates (e.g., "Dec24-v2")
3. **Change Log**: Send a quick text with each update
4. **Video Demo**: Record a 30-sec Loom showing what's new

## Common Issues & Quick Fixes

### "Can't install on iPhone"

- They need to trust the developer certificate
- Send them: Settings → General → Device Management → Trust

### "Android says unsafe"

- Normal for test apps
- Tell them: Settings → Install anyway

### "It's not working"

- First question: "Did you allow permissions?"
- Second: "Can you screenshot the error?"

## Your Testing Checklist

- [ ] Build iOS and Android versions
- [ ] Upload to Diawi
- [ ] Send links to 5 testers
- [ ] Set up feedback form
- [ ] Schedule v2 for 3 days later

Remember: Perfect is the enemy of shipped. Get it in hands TODAY!
