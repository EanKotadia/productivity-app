# Brain Dump – Minimalist Productivity App

**Brain Dump** is a minimalist, black-and-white productivity application built with React, TypeScript, and Tailwind CSS. Designed for clarity and deep focus, it features a powerful brain dump module that automatically structures raw thoughts into actionable tasks using AI.

---

## Overview

Brain Dump is an end-to-end productivity platform that transforms unstructured thoughts into organized action. It combines:

- Brain dump space with AI-powered task extraction (via GPT-4)
- Structured to-do list and task board
- Timers for Pomodoro-style focused work
- Habit tracking for behavior reinforcement
- A clean, distraction-free dashboard experience

This application is structured for scalability and performance, with custom routing and modular component architecture.

---

## Tech Stack

| Technology       | Purpose                                    |
|------------------|--------------------------------------------|
| **React (TSX)**  | Core UI framework                          |
| **TypeScript**   | Static typing for scalability and safety   |
| **React Router** | Client-side routing between views/pages    |
| **Tailwind CSS** | Utility-first styling                      |
| **PNPM**         | Fast package management                    |
| **PostCSS**      | Modern CSS tooling                         |
| **Vite**         | Lightning-fast bundler and dev server      |
| **OpenAI API** (optional) | AI-powered task generation             |

---

## Features

- **Task Management** – Add, edit, prioritize, and delete tasks
- **Daily Focus View** – Minimal UI for structured task execution
- **Pomodoro Timers** – Built-in focus sessions with auto-reset
- **Habit Tracker** – Track recurring habits and consistency
- **Auto-saving** – Persist data using browser storage
- **Extendable Backend Hooks** – Add GPT-4, file vaults, or sync
- **Future Integrations** – Cloud backup, calendar sync, AI planning

---

## Getting Started

Clone the repository:
Install dependencies:

pnpm install
Start the development server:

pnpm dev
Open your browser and visit:

http://localhost:3000
Available Scripts

Script	Command	Description
Development	pnpm dev	Launches local dev server on port 3000
Production	pnpm build	Generates production build
Linting	pnpm lint	Runs ESLint on the project
Formatting	pnpm format	Formats code with Prettier configuration
Contribution and Extensibility

Fork the repository and submit a pull request for new features or bug fixes.
Suggest enhancements or improvements via GitHub Issues.
Easily customize themes and layout using Tailwind’s configuration.
Extend features through custom React hooks and modular architecture.


