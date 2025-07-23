# ResourceAllocation: Product Overview & User Journey

This document provides a comprehensive overview of the ResourceAllocation platform and a step-by-step analysis of the user journey, detailing the functionalities available in the current version of the application.

---

## 1. Product Introduction

### What is ResourceAllocation?

ResourceAllocation is a sophisticated, GenAI-powered Software-as-a-Service (SaaS) platform meticulously designed for technical consultancy firms, software development agencies, and IT service organizations. It addresses the critical challenge of managing and deploying technical talent with intelligence and precision. By leveraging Genkit and the Gemini API, our platform moves beyond traditional spreadsheets and manual tracking, offering a centralized, data-driven solution for talent and project management.

### The Problem We Solve

Technical consultancies operate in a high-stakes environment where deploying the right person to the right project is paramount to success. Key challenges include:

- **Inefficient Talent Matching:** Manual processes for matching skills to project requirements are slow, error-prone, and often fail to consider the nuances of a candidate's full capabilities.
- **Poor Skill Visibility:** Companies struggle to maintain an accurate, real-time understanding of their collective skill inventory, leading to underutilized talent and missed opportunities.
- **Fragmented Management:** Juggling internal projects, client-facing roles, and team availability across multiple tools leads to operational chaos and suboptimal resource allocation.

### Our Solution

ResourceAllocation provides a unified platform that transforms talent management from a reactive chore into a strategic advantage. Our core features include:

- **Centralized Employee Profiles:** A single source of truth for every employee's skills, experience, availability, certifications, and professional history.
- **Intelligent Skill Management:** AI-powered tools to extract skills from resumes, analyze skill gaps across the organization, and suggest training opportunities.
- **AI-Powered Candidate Suggestions:** Genkit flows that analyze project requirements and recommend the most suitable team members based on a holistic view of their profiles.
- **Streamlined Project & Client Management:** Tools to create, manage, and staff projects, linking them to specific clients and tracking their status.
- **Data-Driven Insights:** Dashboards and comparison tools that provide a clear view of the talent landscape, helping leadership make informed strategic decisions.

---

## 2. User Journey (Click Analysis)

This section outlines the step-by-step flow a user can take through the currently implemented features of the application.

### Step 1: Company & Super Admin Registration

1.  **Navigate to the Landing Page:** A new user arrives at the public-facing landing page.
2.  **Click "Get Started":** The user clicks the sign-up button to begin the registration process.
3.  **Complete the Multi-Step Form:**
    - **Step 1 (Your Details):** The user (e.g., a CEO or Hiring Manager) enters their full name, designation, email, and a secure password.
    - **Step 2 (Company Information):** The user provides their company's name, website, and size.
4.  **Click "Sign Up":** Upon submission, a new company is created in the database, and the user's account is created with the `Super Admin` role.
5.  **Email Verification:** The user is automatically redirected to a "Verify Your Email" page. They must check their inbox for a verification link and click it to activate their account.

### Step 2: First Login & Onboarding

1.  **Log In:** After verification, the user logs in with their credentials.
2.  **Profile Creation (Onboarding):** The user is immediately redirected to the "Create Your Profile" page.
    - **Step 1 (Basic Information):** The user fills in their job title, availability, and preferred work mode.
    - **Step 2 (Skills):** The user can either upload their resume for AI skill extraction or add skills manually. The AI will suggest skills based on the resume content.
3.  **Save Profile:** Upon saving, their employee profile is created and linked to their user account.
4.  **Welcome Modal:** The user is redirected to the Dashboard, where a "Welcome to ResourceAlloc!" modal appears, suggesting next steps.

### Step 3: Core Application Usage

#### Managing Employees

1.  **Navigate to Employees:** The user clicks on "Employees" in the sidebar.
2.  **View Roster:** A table displays all employees in the company.
3.  **Add a New Employee:** An Admin clicks "Add Employee" and follows the same profile creation flow from onboarding.
4.  **View Employee Details:** Clicking on an employee's name navigates to their detailed profile page, showing their summary, skills, documents, compensation, etc.
5.  **Edit an Employee:** An Admin (or the employee themselves) can click "Edit Profile" to update any information, including adding/removing skills, certifications, and uploading documents.
6.  **Compare Employees:** From the employee list, the user can select two or more employees and click "Compare" to see a side-by-side view of their skills and details.

#### Managing Clients

1.  **Navigate to Clients:** The user clicks on "Clients" in the sidebar.
2.  **Add a Client:** An Admin clicks "Add Client", fills out a simple form with the client's name and contact info, and saves it. The new client appears in the list.

#### Managing Projects

1.  **Navigate to Projects:** The user clicks on "Projects" in the sidebar.
2.  **Create a New Project:** An Admin clicks "Create Project".
3.  **Define Project & Skills:** The user enters a project name, optionally assigns it to a client, and lists the required technical skills.
4.  **Find Candidates (AI):** The user clicks "Find Candidates". The Genkit AI analyzes the required skills and the entire employee roster to suggest a list of suitable candidates, providing a justification for each.
5.  **Select Team & Create:** The user selects their desired team from the AI suggestions and clicks "Create Project & Assign Team". The project is created with the selected members.
6.  **View Project Details:** Clicking a project from the list shows its detail page, including the description, required skills, and assigned team.

#### Using AI Tools

1.  **Navigate to Skill Gap Analysis:** The user clicks on "Skill Analysis".
2.  **View Skill Landscape:** The page automatically gathers all skills required by projects and all skills available from employees.
3.  **Run AI Analysis:** The user clicks "Perform AI Gap Analysis". The Genkit AI analyzes both skill sets and provides:
    - A high-level summary of the company's skill strengths and weaknesses.
    - A list of specific skills that are required but missing from the talent pool.
    - Actionable training suggestions to close the identified gaps.
