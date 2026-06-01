🚀 FULL DETAILED AI PROMPT — TOASTMASTERS CLUB WEBSITE

🎯 PROJECT GOAL

Build a fully functional, production-ready Toastmasters Club Website with:

- Modern, award-winning UI/UX
- Fully dynamic backend (NO HARDCODING)
- Role-based system (Admin & Member)
- Secure authentication
- Deployment-ready (Render)

---

🖥️ 1. LANDING PAGE (PUBLIC WEBSITE)

🔝 HEADER (Sticky + Responsive)

Include:

- Logo / "TM"
- Navigation Links:
  - Home
  - About
  - Activities
  - Team
  - Gallery
- CTA Button: Join Club

Behavior:

- Smooth scroll to sections
- Mobile responsive hamburger menu

---

🏠 HERO SECTION

Include:

- Strong one-line quote (editable via admin)
- Short description (editable)
- Buttons:
  - Join Club → redirects to signup/login
  - Explore Activities → scroll to activities section

Stats Cards (Dynamic from DB):

- Total Activities
- Faculty Advisors Count
- Active Members Count

---

📖 OUR STORY SECTION

Layout:

- Left: Club Logo
- Right: Description (dynamic)

Below:

- Vision Card
- Mission Card

(All content should be editable from admin panel)

---

💡 WHY TOASTMASTERS SECTION

- Display reasons as animated cards
- Horizontal scroll or grid layout
- Content dynamically managed

---

🏫 MESSAGE FROM PRINCIPAL

- Principal Image
- Name
- Message

(All dynamic, editable from admin)

---

🏆 ACHIEVERS SECTION (IMPORTANT)

- Display achievers as cards:
  - Profile Image (auto-fetch from user profile)
  - Name
  - Title (given by admin)
  - Optional Description

---

🖼️ GALLERY SECTION

- Display event images uploaded by admin
- Grid layout with hover effects

---

🔻 FOOTER

- Modern, minimal, premium design
- Social Links:
  - Instagram
  - LinkedIn
- Copyright

---

🔐 2. AUTHENTICATION SYSTEM

🔹 SIGNUP

Fields:

- Name
- Email
- Password (strong validation)
- Branch (CSE, AIDS, ECE, MECH, Civil)
- Semester
- USN
- (Optional: Mobile Number for uniqueness)

Validation Rules:

- Email must be unique
- USN/Mobile must be unique
- Strong password (min 8 chars, mix)

---

🔹 LOGIN

- Email
- Password

---

🔹 FORGOT PASSWORD

- OTP via Brevo Email API
- Verify OTP → allow password reset

---

🔹 AFTER SIGNUP

Send Welcome Email:

- Professional
- Clean Toastmasters tone

---

👥 3. ROLE-BASED SYSTEM

---

🛠️ ADMIN PANEL

🔹 DASHBOARD

- Overview:
  - Total Members
  - Total Activities
  - Active Members

---

📅 ACTIVITY MANAGEMENT

Create Activity:

Fields:

- Title
- Description
- Rules
- Venue
- Date
- Time
- Banner Image

---

Activity Categories:

- Upcoming Activities
- Past Activities

---

Activity Flow:

1. Admin creates activity → goes to Upcoming
2. Members can view it
3. After event:
   - Admin moves to Past
   - Adds:
     - Winners
     - Gallery Images

---

🏅 WINNERS SYSTEM

For each activity:

- Select users (from DB)
- Assign:
  - Title (1st Prize, Best Speaker, etc.)
- Auto-fetch:
  - Name
  - Profile Image

---

📸 GALLERY MANAGEMENT

- Upload multiple images per event
- Store in DB/cloud

---

📊 ATTENDANCE SYSTEM (IMPORTANT)

Flow:

- Admin clicks activity
- See all members list

Sorting:

- First by Year (Seniors → Juniors)
- Then Alphabetically (A–Z)

Each Member Card:

- ✔ Mark Attended
- ✖ Not Attended

Result:

- Attended activity appears in:
  → Member Panel → My Activities

---

👤 MEMBER MANAGEMENT

- View all members
- Delete member
- Suspend / Unsuspend member

Suspend Behavior:

- Force logout
- Block login until unsuspended

---

📧 ANNOUNCEMENT SYSTEM

- Send email to ALL members
- Use Brevo API
- Admin can type subject + message

---

⚙️ DYNAMIC CONTENT CONTROL (VERY IMPORTANT)

Admin should be able to update:

- Hero text
- Stats numbers
- Achievers
- Activities
- Gallery
- Principal message
- Why Toastmasters content

👉 NO CODE CHANGE REQUIRED

---

👤 MEMBER PANEL

🔹 DASHBOARD

- Upcoming Activities
- Past Activities

---

🔹 ACTIVITY DETAILS PAGE

- Banner Image
- Title
- Description
- Rules
- Venue
- Date & Time

---

🔹 MY ACTIVITIES

- Show attended events (based on admin marking)

---

🔹 PROFILE MANAGEMENT

User can:

- Edit Name
- Edit Email
- Upload Profile Image

---

🔹 SETTINGS

- Change Password
- Forgot Password

---

🧱 4. TECH STACK

FRONTEND

- React.js
- Modern UI (animations, transitions)
- Fully responsive

---

BACKEND

- Node.js + Express

---

DATABASE

- MongoDB Atlas

---

AUTH

- JWT Authentication
- bcrypt.js for password hashing

---

EMAIL

- Brevo API (OTP + announcements)

---

⚙️ 5. SYSTEM DESIGN RULES

- NO localStorage for critical data
- Everything must be stored in backend
- Use REST APIs
- Use environment variables (.env):
  - DB URI
  - JWT Secret
  - Brevo API Key

---

🚀 6. DEPLOYMENT REQUIREMENTS

- Must be Render-ready
- No hardcoded URLs
- Use API base URLs
- Clean folder structure

---

🎨 7. UI/UX EXPECTATIONS

- Award-winning modern UI
- Clean typography
- Smooth animations
- Card-based design
- Professional look (not basic)

---

🔥 FINAL EXPECTATION

The system should behave like a real club management platform:

- Admin has full control
- Members have personalized experience
- Fully dynamic website
- Secure and scalable
- Production-ready

---

⚠️ IMPORTANT INSTRUCTIONS FOR AI TOOL

- Do NOT skip any feature
- Do NOT hardcode data
- Do NOT simplify logic
- Implement FULL backend + frontend
- Ensure all flows are working

---