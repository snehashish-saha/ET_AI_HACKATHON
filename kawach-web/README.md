# Kawach - AI Industrial Safety Intelligence Platform

Kawach is an AI-powered industrial safety intelligence platform designed for zero-harm operations. It integrates real-time sensor data, vision AI, and operational context to predict and prevent industrial accidents before they happen.

This project was built for the **ET AI Hackathon 2026** (Problem Statement 1: AI-Powered Industrial Safety Intelligence for Zero-Harm Operations) by team **iTERNITY**.

## Core Features

- **Real-Time Sensor Fusion**: Aggregates gas, temperature, and pressure data across 9 distinct plant zones.
- **AI Risk Engine**: Continuously evaluates a composite risk score based on sensor drift, worker presence, and active permits.
- **Incident Prediction**: Anticipates cascading failures (e.g., Gas Leak + Hot Work permit).
- **Executive Summaries**: Uses AI to automatically generate human-readable incident explanations and root cause analysis.
- **Live Control Console**: Specifically built for demo purposes, allowing users to safely simulate industrial accidents and observe the AI's response.

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation & Running

1. Clone or navigate to the project directory:
   ```bash
   cd kawach-web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the local URL provided by Vite (usually `http://localhost:5173`).

## Judging & Demonstration Guide

To fully experience the capabilities of Kawach during the hackathon judging:

1. **Dashboard Overview**: Start at the `/dashboard` to see the live risk map. All zones should initially be operating normally.
2. **Triggering Scenarios**: Navigate to the **Control Console** (⚡ button in the top bar or via the sidebar).
3. **The "Wow" Moment**: Trigger the **HOT WORK + GAS LEAK** scenario (highlighted in red). 
   - Return to the Dashboard and watch the `Boiler Room` zone. 
   - You will see the sensor values smoothly ramp up, creating a realistic drift.
   - As the risk escalates from LOW → MEDIUM → HIGH → CRITICAL, observe the visual alerts and the overall Plant Risk Score updating dynamically.
4. **Deep Dive**: Click on the critically affected zone (e.g., Boiler Room) to open the **Zone Detail Drawer**. 
   - Read the AI-generated executive summary explaining *why* the situation is critical (combining the physical gas leak with the operational context of a hot work permit).
5. **Incident Reporting**: Generate and download a PDF incident report directly from the drawer or the Incident Report page.

## Tech Stack
- **Frontend**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS v4, Framer Motion
- **Data Simulation**: Custom TypeScript Mock Engine (1000ms tick rate)
- **Icons**: Lucide React

## Team iTERNITY
- Shivam Rai (Sensor & Risk Engine)
- Yash (Vision & AI Layer)
- Rohan (Frontend & Dashboard)
- Aryan (Backend & Integration)
