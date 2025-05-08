# Incalpaca Shop

**Incalpaca Shop** is a modern, scalable, and high-performance e-commerce web application designed to showcase and sell Incalpaca products. Built with the latest web technologies, this project aims to deliver a seamless and engaging shopping experience for users, while providing a robust foundation for future growth and feature expansion.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview

Incalpaca Shop is developed as part of a college project, focusing on the digital transformation of Incalpaca's business model. The platform enables users to browse, discover, and purchase a wide range of high-quality products, leveraging a clean and intuitive user interface.

## Features

- ⚡ **Fast and Responsive UI**: Built with React and Vite for optimal performance.
- 🎨 **Modern Design**: Styled with Tailwind CSS for a clean and consistent look.
- 🔄 **Client-side Routing**: Seamless navigation using React Router.
- 🔗 **API Integration**: Data fetching and state management with React Query and Axios.
- 🖼️ **Dynamic Carousels**: Product showcases powered by Swiper.
- 🎬 **Smooth Animations**: Enhanced user experience with Framer Motion.
- 🧩 **Modular Architecture**: Organized codebase for easy maintenance and scalability.

## Tech Stack

- **Language:** JavaScript (ES Modules)
- **Framework:** [React](https://react.dev/) 19
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Routing:** [React Router DOM](https://reactrouter.com/)
- **State/Data Management:** [React Query](https://tanstack.com/query/latest), [Axios](https://axios-http.com/)
- **UI/UX Enhancements:** [Framer Motion](https://www.framer.com/motion/), [Swiper](https://swiperjs.com/)
- **Linting:** [ESLint](https://eslint.org/)

## Project Structure

```
incalp_front/
  public/
  src/
    assets/
      videos/
    components/
      business/
      context/
      sales/
      user/
    constants/
    pages/
  .gitignore
  package.json
  README.md
  vite.config.js
  ...
```

- **src/components/**: Reusable UI components organized by domain.
- **src/pages/**: Main application pages.
- **src/assets/**: Static assets such as images and videos.
- **src/constants/**: Application-wide constants.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/) (as package manager)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/incalpaca-shop.git
   cd incalpaca-shop
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

4. **Open your browser and visit:**
   ```
   http://localhost:5173
   ```

## Available Scripts

- `npm run dev` — Start the development server.
- `npm run build` — Build the app for production.
- `npm run preview` — Preview the production build.
- `npm run lint` — Run ESLint to check for code quality issues.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the [MIT License](LICENSE).

---

**Incalpaca Shop** — Empowering digital commerce for Incalpaca.