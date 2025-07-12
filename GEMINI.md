### **Current Task & Ongoing Issues:**

**Task:** Ensure consistency in database usage, specifically to use Firebase Realtime Database for all systems except chat, which uses Firestore. Also, check for issues/improvements in signup/signin with Capacitor.

**Critical Unresolved Issue:**

*   **Inability to Locate "Tutor Request Form" File:** Despite multiple attempts using `glob` and `search_file_content` with various keywords, I have been unable to locate the specific React component file that handles the "Submit a Tutor Request" functionality (the form with subject, subtopic, and tutor selection). My previous reads of `src/pages/Requests.jsx` consistently show the "Account & Data Deletion" form.

**Action Required from User:** Please provide the exact file path for the "Tutor Request Form" component to proceed.

---

### **Addressing "GoogleAuth" plugin not implemented error on Android:**

**Problem:** User reported "GoogleAuth" plugin not implemented error when clicking on sign in with Google on Android APK.

**Analysis:** This error typically indicates an issue with Capacitor plugin integration or syncing with the native Android project.

**Solution Steps Taken:**
1.  **Synced Capacitor Project with Android:** Executed `npx cap sync android` to ensure plugins are correctly linked and web assets are copied.
2.  **Opened Android Project:** Executed `npx cap open android` to open the project in Android Studio for rebuilding.

**Next Steps for User:**
1.  **In Android Studio:** Perform a **Clean Project** followed by a **Rebuild Project**.
2.  **Run on Device/Emulator:** Deploy the app to your Android device or emulator.
3.  **Test Google Sign-in:** Check if the "GoogleAuth" plugin error persists.

**If the error persists, further investigation into Firebase project configuration (e.g., SHA-1 fingerprint, `google-services.json`) may be required.**