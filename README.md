# 🚀 INFNOVA — Internship Applicant Management Portal

## 📌 Project Overview
This project was developed as part of the selection process for the **Frontend Internship at INFNOVA Technologies**. 

In response to the practical frontend development challenge, this **Internship Applicant Management Dashboard** allows administrators to:
* **Review & Filter:** Filter applicants by status (`Pending`, `Shortlisted`, `Accepted`, `Rejected`) or search by name and applicant number.
* **Inspect Profiles:** View detailed candidate info, including  experience (if listed), and contact details via an interactive drawer.
* **Update Hiring Statuses:** Modify applicant statuses dynamically in real-time.
* **Export & Settings:** Manage portal configurations and export applicant data to csv.

---

## 🔗 Live Links

* **Repository:** [https://github.com/mensurmm/infnova-dashboard]
* **Live Demo:** [https://infnova-dashboard.vercel.app/]
## 🔑 Demo Credentials for the live Demo

To access the live portal, use the official test administrator credentials provided by the INFNOVA API:

* **Email:** `admin@infnova.tech`
* **Password:** `InternChallenge2026!`

---

## 🛠️ Tech Stack

* **Framework:** Next.js 14+ (App Router, Client Components)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Icons:** Lucide React
* **State & Logic:** Custom React Hooks (`useAuth`, `useApplicants`)
* **Storage:** `localStorage` (Session simulation)

---

## ⚙️ Quick Setup Instructions

### Prerequisites

* **Node.js** (v18.0.0 or higher)
* **npm** or **yarn**

### Steps to Run Locally

1. **Clone the repository:**
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm run dev
```

4. **Open in browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🏗️ Architecture Overview

The application follows a modular, client-side architecture using Next.js App Router:

* **Authentication Layer (`useAuth`):** Handles login validation, secure input toggling, session timeout checks, and route protection via `localStorage`.
* **Data Management (`useApplicants`):** Encapsulates candidate data, filtering, search, status updates, and statistics calculation.
* **UI Components:**
  * `LoginPage`: Split layout with brand showcase, secure form inputs, and floating alert notifications.
  * `ApplicantTable`: Dynamic data view with real-time status updates and pagination.
  * `ProfileDrawer`: Slide-over panel for quick candidate profile inspection.
  * `Sidebar`: Responsive navigation adapting between mobile and desktop views.

---

## 💡 Key Assumptions & Architecture Decisions

1. **Live REST API Integration:** The application consumes the official INFNOVA backend API (`https://infnova-intern.vercel.app/api`) for fetching candidate records and authenticating admin sessions, rather than relying on static or mocked data.
2. **JWT-Based Authentication:** User session tokens are safely persisted in `localStorage` and attached via Axios request interceptors. A `401 Unauthorized` interceptor automatically clears expired sessions and redirects users to the login screen.
3. **Target Audience & Workflow:** Built specifically for internal HR administrators. Candidate pipelines adhere strictly to four standard hiring stages: `Pending`, `Shortlisted`, `Accepted`, and `Rejected`.

---

## 🔮 Future Improvements

1. **Automated Candidate Email Notifications:** Trigger automated transactional email alerts (via SendGrid or Resend) when an administrator updates a candidate's status to *Accepted*, *Shortlisted*, or *Rejected*.
2. **Bulk File & Resume Uploads:** Introduce batch processing capability allowing administrators to upload candidate resumes (PDFs) and perform bulk updates via CSV imports.