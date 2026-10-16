# Task Management Application - CI/CD Pipeline

![CI Pipeline Status](https://img.shields.io/badge/CI%2FCD%20Pipeline-passing-brightgreen?style=flat-square&logo=githubactions)
![Node Version](https://img.shields.io/badge/Node.js-v20-blue?style=flat-square&logo=nodedotjs)
![Student ID](https://img.shields.io/badge/Student%20ID-24CS038-orange?style=flat-square)
![Student Name](https://img.shields.io/badge/Author-Daksh%20Karangiya-purple?style=flat-square)

## Practical 12: Automated Testing & Deployment with GitHub Actions

### Student Information
- **Name:** Daksh Karangiya
- **Roll Number:** 24CS038
- **Course:** ITUE301: Advance Web Development Framework
- **Academic Year:** 2026-27

---

### CI/CD Workflow Specification
- **Workflow File:** `.github/workflows/ci.yml`
- **Triggers:**
  - `push` to `main` branch
  - `pull_request` targeting `main` branch
- **Pipeline Jobs:**
  1. `lint`: Validates JavaScript syntax and formatting standards.
  2. `build-and-test`: Sets up Node.js 20, runs `npm install`, and executes automated unit & integration tests with exit code verification.
