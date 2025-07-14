# CalLite Roadmap
Just trying to implement similar features like calendly cal.com 
This project is built with Next.js, TypeScript, Tailwind, PostgreSQL, and Prisma. Below is a day-by-day breakdown of the development plan.

---
The unrealistic timeline for procastinator like me :)
## Day 1: Project Setup & Authentication

**Goal:** Set up the Next.js app, database, and user authentication.

### Tasks

- Initialize Next.js app with TypeScript & Tailwind CSS
- Set up PostgreSQL and Prisma
- Create User model in Prisma
- Set up authentication (Clerk or custom JWT)
- Protect routes using middleware
- Create `/dashboard` route to verify authentication

**Outcome:** Logged-in users can access the dashboard.

---

## Day 2: Availability Management

**Goal:** Allow users to define their availability.

### Tasks

- Design Availability table in Prisma
- Create `/dashboard/availability` page
- Build form to add/edit weekly slots (e.g., Mon–Fri, 2–5pm)
- Implement API routes: `POST /api/availability`, `GET /api/availability/me`

**Outcome:** Users can define when they're bookable.

---

## Day 3: Booking System

**Goal:** Create a public page and booking system.

### Tasks

- Create public profile page: `/[username]`
- Fetch and display available slots
- Build form to enter name, email, and message
- Implement API route: `POST /api/bookings`
- Save booking to database with pending status

**Outcome:** Anyone can book from a user's public link.

---

## Day 4: Google Calendar & Email Integration

**Goal:** Add calendar event and optional Google Meet link.

### Tasks

- Set up Google Calendar API credentials
- On booking, create calendar invite via Google API
- Generate Google Meet link (if enabled)
- Send confirmation email using Resend or Nodemailer

**Outcome:** Booking creates a calendar event and sends a confirmation email.

---

## Day 5: Embed Widget & Dashboard View

**Goal:** Provide an embed-friendly public link and manage bookings.

### Tasks

- Add `<iframe>` embed support (`/embed/[username]`)
- User dashboard to list all bookings
- Add cancel/reschedule functionality (optional)
- Copy embed code feature

**Outcome:** Users can embed ConnectLite into their websites and manage bookings from the dashboard.
