# Process Checklist: Next.js + TypeScript + TailwindCSS Contact Form

## Overview
Build a complete contact form application with Next.js, TypeScript, and TailwindCSS that saves submitted messages to a file in the backend.

---

## Phase 1: Project Setup & Configuration

- [ ] **Check existing project structure**
  - Verify package.json has required dependencies (next, react, typescript, tailwindcss)
  - Confirm tsconfig.json is properly configured for Next.js
  - Check if node_modules are installed

- [ ] **Install any missing dependencies**
  - Install `formidable` or similar library for file handling (optional)
  - Ensure TailwindCSS v4 is properly configured with PostCSS

- [ ] **Set up directory structure**
  ```
  src/
  ├── app/                    # Next.js App Router
  │   ├── layout.tsx          # Root layout component
  │   ├── page.tsx            # Main page (contact form)
  │   ├── globals.css         # Global styles with Tailwind
  │   └── api/contact/        # API route handler
  │       └── route.ts        # POST endpoint for contact form
  ├── components/             # React components
  │   └─ ContactForm.tsx      # Contact form component
  └── data/                   # Data storage directory
      └── contacts.json       # JSON file to store messages
  ```

---

## Phase 2: Backend - API Route Creation

- [ ] **Create the API endpoint** (`src/app/api/contact/route.ts`)
  - [ ] Implement POST method handler for receiving form submissions
  - [ ] Parse incoming JSON data from request body
  - [ ] Validate required fields (name, email, message)
  - [ ] Read existing contacts.json file or initialize if not exists
  - [ ] Append new contact entry with timestamp
  - [ ] Write updated data back to contacts.json
  - [ ] Return appropriate success/error responses

- [ ] **Add error handling**
  - [ ] Handle file read/write errors gracefully
  - [ ] Validate email format
  - [ ] Check for empty or invalid fields
  - [ ] Return HTTP status codes (400, 500) as needed

---

## Phase 3: Frontend - Contact Form Component

- [ ] **Create the main contact form component** (`src/components/ContactForm.tsx`)
  - [ ] Build controlled form inputs for: name, email, subject, message
  - [ ] Implement TypeScript interfaces for form data and validation errors
  - [ ] Add client-side form validation (required fields, email format)
  - [ ] Create loading state during submission
  - [ ] Display success/error messages to user
  - [ ] Handle form submission with fetch API

- [ ] **Style the form with TailwindCSS**
  - [ ] Responsive design for mobile/desktop
  - [ ] Modern, clean UI with proper spacing and typography
  - [ ] Form input focus states and hover effects
  - [ ] Error message styling (red text)
  - [ ] Success notification styling (green/teal)
  - [ ] Button with loading spinner animation

---

## Phase 4: App Page & Layout Integration

- [ ] **Create main page** (`src/app/page.tsx`)
  - [ ] Import and render ContactForm component
  - [ ] Add page title and description
  - [ ] Include header/hero section for the contact page

- [ ] **Set up root layout** (`src/app/layout.tsx`)
  - [ ] Define HTML structure with proper metadata
  - [ ] Import globals.css
  - [ ] Set viewport meta tag for responsiveness

---

## Phase 5: Testing & Verification

- [ ] **Start development server**
  ```bash
  npm run dev
  # or
  yarn dev
  # or
  npx next dev
  ```

- [ ] **Test the contact form**
  - [ ] Submit a test message with all fields filled
  - [ ] Verify success message appears
  - [ ] Check that contacts.json is updated in src/data/
  - [ ] Test validation (submit empty fields, invalid email)
  - [ ] Test error handling scenarios

- [ ] **Verify file storage**
  - [ ] Open `src/data/contacts.json` to confirm entries are saved
  - [ ] Check JSON structure is valid
  - [ ] Verify timestamps are included

---

## Phase 6: Documentation & Polish

- [ ] **Add README.md with instructions**
  - How to install dependencies (`npm install`)
  - How to run development server (`npm run dev`)
  - How to access the application (http://localhost:3000)
  - File storage location and structure

- [ ] **Code quality checks**
  - Ensure TypeScript types are complete
  - Verify all imports are correct
  - Check for any console warnings or errors

---

## Quick Run Commands Reference

```bash
# Install dependencies (if needed)
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Access the application at: **http://localhost:3000**

---

## File Storage Structure

Contact form submissions are saved to `src/data/contacts.json` with this structure:

```json
{
  "contacts": [
    {
      "id": "unique-timestamp",
      "name": "John Doe",
      "email": "john@example.com",
      "subject": "Inquiry about services",
      "message": "Hello, I would like to know more...",
      "createdAt": "2025-01-15T10:30:00Z"
    }
  ]
}
```

---

*Created for: Next.js + TypeScript + TailwindCSS Contact Form Project*  
*Status: Pending Implementation*