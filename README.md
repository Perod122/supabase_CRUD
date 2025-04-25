# 🔐 Supabase Auth + Profile CRUD App

A full-stack authentication app built using **Supabase**, **Express.js**, and **React**, allowing users to **sign up**, **sign in**, **sign out**, and store additional **profile information** (first name, last name, phone, gender) in a custom `profiles` table.

---

## 🚀 Features

- ✅ User registration with email & password (via Supabase Auth)
- 📇 Adds user info (first name, last name, phone, gender) to `profiles` table
- 🔒 Authentication session management via **HTTP-only cookies**
- 🚪 Secure sign in and sign out logic
- 👤 Check session and auto-fetch user info on page load
- ⚙️ Backend using **Express.js**
- 🖥️ Frontend using **React + Vite + TailwindCSS**

---

## 🛠️ Tech Stack

**Frontend:**
- React
- Vite
- Axios
- Tailwind CSS

**Backend:**
- Express.js
- Supabase JS Client
- Cookie-parser
- CORS

**Database:**
- Supabase (PostgreSQL with Auth & Row Level Security)

---

## 📦 Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/perod122/supabase_CRUD.git
cd your-project-name
```
## Supabase Configuration
- Create a project at www.supabase.com
- Enable email/password auth
- Create a `profiles` table:
```sql
create table profiles (
  id uuid primary key references auth.users(id),
  firstname text,
  lastname text,
  phone text,
  gender text
);
```
- Enable Row Level Security (RLS) and create a policy for reading/updating your own profile.
  
## 👨‍💻 Author
Made with 💙 by Perod122

## 📃 License
This project is licensed under the MIT License https://opensource.org/license/mit.
