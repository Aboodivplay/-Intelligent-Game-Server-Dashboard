IGSO Engine (Intelligent Gaming Optimization Server)
IGSO Engine is a SaaS-based server optimization platform designed for Minecraft Forge. It uses a custom telemetry mod to stream real-time server metrics to a centralized Python backend, which then feeds into a beautiful, gaming-themed web dashboard.
📁 Repository Structure
/backend: Python backend server (API) that handles user licenses, telemetry data, and configuration syncing.
/dashboard: A pure ES6 Vanilla Javascript Single Page Application (SPA). The main interface where users can register, buy subscriptions, and monitor their servers.
/forge-workspace: The source code for the Minecraft Forge Mod (1.20.1) that runs on the actual game server.
/landing-site: A sleek promotional landing page for the SaaS product.
simulate_minecraft_link.py: A helpful Python script to quickly test the server linking process without needing to boot up Minecraft.
IOGS-Telemetry-Mod-1.20.1.jar: The compiled Mod ready to be dropped into a server's \mods\ folder.
🚀 Getting Started
1. Start the Python Backend
The backend manages the API keys, handles authentication, and routes telemetry data.
\\ash
cd backend
python server.py
\\
2. Start the Web Dashboard
Since the dashboard uses ES6 Javascript modules, it must be served over an HTTP server (you cannot just open the HTML file).
\\ash
cd dashboard
python -m http.server 8888
\  
Open your browser to: http://127.0.0.1:8888
3. Connect a Minecraft Server
Create an account on the Dashboard and 'purchase' a subscription.
The Dashboard will give you a 6-character License Code (e.g. \IGSO-1A2B3C).
Drop \IOGS-Telemetry-Mod-1.20.1.jar\ into your Minecraft 1.20.1 Forge server \mods\ folder and start it up.
Join the game as an Operator and type /igso link <YOUR_CODE>.
Your dashboard will instantly unlock and begin receiving real-time data!
(Don't want to boot Minecraft? Just run \python simulate_minecraft_link.py\ in the terminal to simulate the mod linking!)
🎨 Design
The UI features a premium dark theme inspired by Minecraft (obsidian, emerald, neon accents) and utilizes the VT323 pixel font for an authentic gaming feel.
