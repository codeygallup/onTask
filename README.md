<a name="readme-top"></a>

# onTask [<img align="right" src="https://img.shields.io/badge/license-MIT-00beef"></img>](LICENSE) [<img align="right" src="https://img.shields.io/badge/version-2.1.0-14b8a6"></img>](#)

### Description

A modern, mobile-first project management tool built with the MERN stack. OnTask helps users track project progress with an intuitive interface, task completion tracking, and real-time updates.

✨ New in v2.1:
- **Vite + TypeScript migration** – faster builds, better developer experience, and type-safe backend  
- **Sliding sessions with session manager** – automatic token refresh and session expiration warnings  
- **Improved authentication flows** – password strength feedback and validation  
- **Reusable custom hooks** – cleaner state management across the app  
- **GraphQL error handling and Zod schema validation** – more robust backend with clear errors  


  <p align="right"><a href="#readme-top">(Return to top)</a></p>

## Table of Contents

[Description](#description) • [Demo](#demo) • [Features](#features) • [Installation](#installation) • [Usage](#usage) • [Technologies](#technologies) • [Contribution](#contribution)

### Demo

**🔗 Live Site:** [https://ontask-cf7r.onrender.com/](https://ontask-cf7r.onrender.com/) 
*(Server may take a few seconds to spin up — hang tight!)*  

![OnTask Dashboard](/assets/v2-home.png)


  <p align="right"><a href="#readme-top">(Return to top)</a></p>

### Features

- ✅ **Project & Task Management** - Create, update, and track multiple projects
- 📊 **Progress Visualization** — Real-time stats and completion percentages
- 🔐 **Secure Authentication** - JWT-based auth with password recovery via PIN
- 📱 **Mobile-First Design** - Optimized responsive interface with FAB navigation
- 🎨 **Modern UI** - Clean Tailwind CSS design with teal accent colors

  <p align="right"><a href="#readme-top">(Return to top)</a></p>
  
### Installation

**Prerequisites:** Node.js 18+ and MongoDB

1. Clone the repo using HTTPS:
```bash
git clone https://github.com/codeygallup/onTask.git
cd onTask
```

2. Install dependencies:
```bash
npm run install
```

3. Create `.env` file in `server/` directory:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

4. Start the development server:
```bash
npm run dev
```

App runs on `http://localhost:3000`

  <p align="right"><a href="#readme-top">(Return to top)</a></p>

### Usage

1. **Sign up** for a new account or **log in**
2. **Create projects** using the FAB button (mobile) or sidebar (desktop)
3. **Add tasks** to your projects and track completion
4. **View dashboard** to see recent projects and progress stats

  <p align="right"><a href="#readme-top">(Return to top)</a></p>

### Technologies

**Frontend:**
- ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
- ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
- ![Apollo-GraphQL](https://img.shields.io/badge/-ApolloGraphQL-311C87?style=for-the-badge&logo=apollo-graphql)
- ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)

**Backend:**
- ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
- ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
- ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
- ![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

**Deployment:**
- ![Render](https://img.shields.io/badge/Render-%46E3B7.svg?style=for-the-badge&logo=render&logoColor=white)

  <p align="right"><a href="#readme-top">(Return to top)</a></p>

### Contribution

Contributions are welcome! To contribute:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request to `dev` branch

  <p align="right"><a href="#readme-top">(Return to top)</a></p>

### Roadmap

**v2.1.0** ✅ *Released January 2025*
- [x] Migration to Vite
- [x] Sliding sessions
- [x] Create additional useContext hooks to simplify state management

**v2.2.0** (Planned)
- [ ] Accent color selector
- [ ] Auto-focus "Try Again" button in error modals
- [ ] Create @apply utilities for repeated Tailwind classes
- [ ] Add "sandbox mode" for recruiters to test without signup

  <p align="right"><a href="#readme-top">(Return to top)</a></p>

### License

Distributed under the MIT License. See `LICENSE` for more information.

  <p align="right"><a href="#readme-top">(Return to top)</a></p>

#### Links

**Author:** Codey Gallup  
**GitHub:** [@codeygallup](https://github.com/codeygallup)  
**Email:** codey.gallup@gmail.com

  <p align="right"><a href="#readme-top">(Return to top)</a></p>
  