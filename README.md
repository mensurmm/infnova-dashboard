---

# 🚀 INFNOVA — Internship Applicant Management Portal

## 📌 Project Overview
This project was developed as part of the selection process for the **Frontend Internship at INFNOVA Technologies**. 

In response to the practical frontend development challenge, this **Internship Applicant Management Dashboard** allows administrators to:
* **Review & Filter:** Filter applicants by status (`Pending`, `Shortlisted`, `Accepted`, `Rejected`) or search by name and key skills.
* **Inspect Profiles:** View detailed candidate info, including resumes, experience, and contact details via an interactive drawer.
* **Update Hiring Statuses:** Modify applicant statuses dynamically in real-time.
* **Export & Settings:** Manage portal configurations and export applicant data.

---

## 🔗 Live Links

* **Repository:** `[https://github.com/your-username/your-repo-name](https://github.com/your-username/your-repo-name)`
* **Live Demo:** `[https://your-app-name.vercel.app](https://your-app-name.vercel.app)`

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

## 💡 Key Assumptions Made

1. **Target Audience:** Built specifically for internal admins evaluating internship candidates.
2. **Mock Backend:** Client-side state (`localStorage`) is used to mock real database mutations and authentication tokens.
3. **Workflow Rules:** Candidate pipeline follows four strict states: `Pending`, `Shortlisted`, `Accepted`, and `Rejected`.

---

## 🔮 Future Improvements

With more development time, the following features would be added:

1. **Real Backend API:** Connect to PostgreSQL/MongoDB via Prisma or Server Actions.
2. **Automated Candidate Emailing:** Trigger automatic email updates when candidate status changes to *Accepted* or *Rejected*.
3. **Bulk File Upload:** Allow batch uploading candidate resumes and CSV profile imports.
4. **Role-Based Access (RBAC):** Separate permissions between HR Managers and Reviewers.
5. **Testing Suite:** Add E2E testing with Playwright and component testing with Jest.