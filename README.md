# 🎮 IGSO Engine

### Intelligent Gaming Server Optimization

**IGSO Engine** is a SaaS-based server monitoring and optimization platform built specifically for **Minecraft Forge servers**.

IGSO uses a custom Forge telemetry mod to collect and stream real-time server performance metrics to a centralized **Python backend**. The collected data is then processed and displayed through a modern, gaming-inspired web dashboard, allowing server owners to monitor performance, manage licenses, configure their servers, and eventually apply intelligent optimization recommendations from one place.

---

## ✨ Features

* 📊 Real-time Minecraft server telemetry
* ⚡ Live TPS and performance monitoring
* 🧠 Intelligent server optimization architecture
* 🔗 Simple license-based server linking
* 🔑 User authentication and license management
* 🔄 Configuration synchronization
* 🌐 Centralized Python API backend
* 🎮 Minecraft Forge 1.20.1 integration
* 🖥️ Modern Single Page Application dashboard
* 🧪 Minecraft connection simulator for development/testing
* 🌑 Premium Minecraft-inspired dark interface

---

# 📁 Repository Structure

```text
IGSO-Engine/
│
├── backend/
│   └── Python backend API responsible for authentication,
│       licenses, telemetry processing, server linking,
│       and configuration synchronization.
│
├── dashboard/
│   └── ES6 Vanilla JavaScript Single Page Application.
│       Users can create accounts, manage subscriptions,
│       link Minecraft servers, and monitor live telemetry.
│
├── forge-workspace/
│   └── Source code for the Minecraft Forge 1.20.1
│       telemetry mod installed on connected servers.
│
├── landing-site/
│   └── Promotional website for the IGSO Engine platform.
│
├── simulate_minecraft_link.py
│   └── Development utility used to simulate the Minecraft
│       server linking process without launching Minecraft.
│
└── IOGS-Telemetry-Mod-1.20.1.jar
    └── Compiled Forge telemetry mod ready to be installed
        inside a Minecraft server's mods folder.
```

---

# 🚀 Getting Started

## 1. Start the Python Backend

The backend powers the IGSO API and is responsible for:

* User authentication
* License management
* Minecraft server linking
* Telemetry ingestion
* Server configuration
* Dashboard synchronization

Open a terminal inside the project directory and run:

```bash
cd backend
python server.py
```

Once started, the IGSO backend will begin accepting requests from the dashboard and connected Minecraft servers.

---

## 2. Start the Web Dashboard

The dashboard uses **ES6 JavaScript modules**, which means it must be served through an HTTP server.

Opening `index.html` directly through the filesystem may prevent JavaScript modules from loading correctly.

Run:

```bash
cd dashboard
python -m http.server 8888
```

Then open:

```text
http://127.0.0.1:8888
```

The IGSO Dashboard should now be available in your browser.

---

# 🔗 Connect a Minecraft Server

Connecting a Minecraft Forge server to IGSO only takes a few steps.

### Step 1 — Create an Account

Open the IGSO Dashboard and register a new account.

### Step 2 — Activate a Subscription

Select or "purchase" a subscription from the dashboard.

Once activated, IGSO will generate a unique server license code.

Example:

```text
IGSO-1A2B3C
```

### Step 3 — Install the Telemetry Mod

Copy:

```text
IOGS-Telemetry-Mod-1.20.1.jar
```

into your Minecraft Forge 1.20.1 server:

```text
mods/
```

Then start the Minecraft server normally.

### Step 4 — Link the Server

Join the Minecraft server using an account with **Operator permissions** and run:

```text
/igso link <YOUR_CODE>
```

Example:

```text
/igso link IGSO-1A2B3C
```

Once the license is validated, the server will be linked to your IGSO account.

Your dashboard will automatically unlock the server monitoring interface and begin receiving telemetry data in real time.

---

# 🧪 Test Without Starting Minecraft

During development, you do not need to launch an entire Minecraft server just to test the linking process.

Run:

```bash
python simulate_minecraft_link.py
```

The simulator reproduces the server-linking process and allows you to quickly test communication between the Minecraft integration, backend API, and dashboard.

---

# 📡 How IGSO Works

```text
Minecraft Forge Server
        │
        │ Telemetry
        ▼
IGSO Telemetry Mod
        │
        │ HTTP / API
        ▼
IGSO Python Backend
        │
        ├── Authentication
        ├── License Validation
        ├── Telemetry Processing
        ├── Configuration Management
        └── Server Management
        │
        ▼
IGSO Web Dashboard
        │
        ├── Live Monitoring
        ├── Server Statistics
        ├── Subscription Management
        └── Optimization Controls
```

The Forge mod acts as the connection between the Minecraft server and the IGSO cloud infrastructure.

Server metrics are collected by the telemetry mod and transmitted to the backend, where they can be stored, analyzed, and displayed on the user's dashboard.

---

# 🎨 Interface Design

IGSO Engine uses a premium gaming-focused visual identity inspired by **Minecraft's darker materials and magical elements**.

The interface combines:

* ⚫ Obsidian-inspired backgrounds
* 💚 Emerald accents
* 🟢 Neon status indicators
* ✨ Subtle glow effects
* 🧱 Minecraft-inspired UI components
* 🖥️ Modern SaaS dashboard layouts
* 🎮 Pixel-style typography

The dashboard uses the **VT323 pixel font** to maintain a recognizable gaming aesthetic while keeping the interface clean and readable.

The goal is to make IGSO feel like a professional server-management platform without losing its Minecraft identity.

---

# 🛠️ Technology Stack

### Backend

```text
Python
REST API
Telemetry Processing
Authentication
License Management
Configuration Synchronization
```

### Dashboard

```text
HTML5
CSS3
Vanilla JavaScript
ES6 Modules
Single Page Application Architecture
```

### Minecraft Integration

```text
Minecraft 1.20.1
Minecraft Forge
Java
Custom Telemetry Mod
```

---

# 🎯 Project Goal

IGSO Engine aims to make Minecraft Forge server management easier by providing server owners with a centralized platform for monitoring, diagnostics, configuration, and intelligent optimization.

Instead of manually inspecting logs, JVM statistics, TPS drops, memory usage, and mod-related performance issues, IGSO is designed to bring those systems together into a single gaming-focused dashboard.

The long-term vision is simple:

> **Monitor. Analyze. Optimize. Play.**

**IGSO Engine — Intelligent optimization for serious Minecraft servers.**
