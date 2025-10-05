# CivitAI Model Manager - Installation Guide

A comprehensive guide to install and set up the CivitAI Model Manager on your local machine.

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Quick Start](#quick-start)
3. [Detailed Installation](#detailed-installation)
4. [Configuration](#configuration)
5. [Running the Application](#running-the-application)
6. [Troubleshooting](#troubleshooting)
7. [Upgrading](#upgrading)

---

## System Requirements

### Minimum Requirements
- **Operating System**: Windows 10/11, macOS 10.15+, or Linux (Ubuntu 20.04+, Fedora 33+, etc.)
- **Node.js**: Version 20.x or higher ([Download here](https://nodejs.org/))
- **RAM**: 4 GB minimum (8 GB recommended for large models)
- **Disk Space**: 
  - 500 MB for the application itself
  - Additional space for downloaded models (varies based on usage)
  - Large models can be 2-8 GB each

### Optional Requirements
- **ComfyUI**: If you want to automatically organize downloaded models into your ComfyUI installation
- **CivitAI API Key**: Required for downloading models from CivitAI ([Get your API key](https://civitai.com/user/account))

---

## Quick Start

### Windows

1. **Download** or clone this repository
2. **Double-click** `setup.bat`
3. **Follow** the on-screen instructions
4. **Start** the app by running `start.bat` or typing `Y` when prompted

### Linux / macOS

1. **Download** or clone this repository
2. **Open terminal** in the project directory
3. **Make scripts executable** (first time only):
   ```bash
   chmod +x setup.sh start.sh
   ```
4. **Run** the setup script:
   ```bash
   ./setup.sh
   ```
5. **Start** the app by running `./start.sh` or typing `y` when prompted

---

## Detailed Installation

### Step 1: Install Node.js

If you don't have Node.js installed:

#### Windows
1. Download the LTS version from [nodejs.org](https://nodejs.org/)
2. Run the installer (.msi file)
3. Follow the installation wizard (keep default settings)
4. Verify installation by opening Command Prompt and running:
   ```cmd
   node --version
   npm --version
   ```

#### macOS
**Using Homebrew** (recommended):
```bash
brew install node@20
```

**Or download** the installer from [nodejs.org](https://nodejs.org/)

#### Linux (Ubuntu/Debian)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### Linux (Fedora)
```bash
sudo dnf install nodejs
```

### Step 2: Download the Application

#### Option A: Using Git (Recommended)
```bash
git clone <repository-url>
cd civitai-model-manager
```

#### Option B: Manual Download
1. Download the ZIP file from the repository
2. Extract it to your desired location
3. Open terminal/command prompt in that directory

### Step 3: Run Setup Script

#### Windows
Double-click `setup.bat` or run in Command Prompt:
```cmd
setup.bat
```

#### Linux / macOS
```bash
chmod +x setup.sh
./setup.sh
```

The setup script will:
- ✅ Check if Node.js is installed
- ✅ Install all required dependencies
- ✅ Create a `.env` configuration file
- ✅ Optionally start the application

### Step 4: Configure the Application

After installation, you need to configure your CivitAI API key and optionally your ComfyUI path.

#### Get Your CivitAI API Key
1. Go to [CivitAI Account Settings](https://civitai.com/user/account)
2. Navigate to the API Keys section
3. Create a new API key or copy an existing one

#### Configuration Methods

**Method 1: Via Web Interface (Recommended)**
1. Start the application
2. Open your browser to `http://localhost:5000`
3. Click on the **Settings** page (gear icon in sidebar)
4. Enter your **CivitAI API Key**
5. Optionally enter your **ComfyUI Path**
   - Windows example: `C:/ComfyUI` or `C:\Users\YourName\ComfyUI`
   - Linux/Mac example: `/home/username/ComfyUI` or `~/ComfyUI`
6. Click **Save Settings**

**Method 2: Via .env File**
1. Open `.env` file in a text editor
2. Add your configuration:
   ```
   PORT=5000
   NODE_ENV=development
   CIVITAI_API_KEY=your_api_key_here
   COMFYUI_PATH=C:/ComfyUI
   ```
3. Save the file
4. Restart the application

---

## Running the Application

### Development Mode (Recommended for Testing)

#### Windows
```cmd
npm run dev
```
Or double-click `start.bat`

#### Linux / macOS
```bash
npm run dev
```
Or run `./start.sh`

### Production Mode

First, build the application:
```bash
npm run build
```

Then start it:
```bash
npm start
```

### Access the Application

Open your web browser and navigate to:
```
http://localhost:5000
```

To stop the server, press `Ctrl + C` in the terminal.

---

## Configuration

### Port Configuration

By default, the application runs on port 5000. To change this:

1. Edit the `.env` file
2. Change the `PORT` value:
   ```
   PORT=3000
   ```
3. Restart the application

### ComfyUI Integration

The application can automatically organize downloaded models into your ComfyUI folder structure:

**Default Folder Mappings:**
- LORAs: `models/loras/{BaseModel}/`
- Checkpoints: `models/checkpoints/{BaseModel}/`
- TextualInversions: `models/embeddings/`
- Hypernetworks: `models/hypernetworks/`
- Controlnets: `models/controlnet/`
- And more...

**Custom Mappings:**
You can customize these mappings in the Settings page under "Category Mappings".

### Running Without ComfyUI

If you don't have ComfyUI installed:
- Leave the ComfyUI Path field empty
- The application will simulate downloads and track metadata
- You can still browse models, see details, and manage your collection
- Files won't be written to disk, but you'll see how the app works

---

## Troubleshooting

### Common Issues

#### "Node.js is not installed"
**Solution**: Install Node.js from [nodejs.org](https://nodejs.org/) and restart your terminal/command prompt.

#### "Failed to install dependencies"
**Solution**: 
1. Check your internet connection
2. Try running the setup script again
3. If it persists, manually run: `npm install --force`

#### "Port 5000 is already in use"
**Solution**:
1. Stop any other application using port 5000
2. Or change the port in `.env` file
3. On macOS, AirPlay Receiver uses port 5000 by default. Disable it in System Preferences > Sharing

#### "Cannot connect to WebSocket"
**Solution**: 
- The application automatically falls back to polling
- Check if firewall is blocking connections
- Try restarting the application

#### "ComfyUI path does not exist"
**Solution**:
1. Verify the path is correct
2. Use forward slashes `/` or double backslashes `\\` in Windows paths
3. Make sure the directory exists and is accessible
4. Leave empty to run without ComfyUI integration

#### "Failed to download model"
**Solution**:
1. Verify your CivitAI API key is correct
2. Check your internet connection
3. Ensure the model URL is valid
4. Some models require authentication or have download restrictions

#### Permission Denied Errors
**Linux/Mac Solution**:
```bash
chmod +x setup.sh start.sh
```

**Windows Solution**: Run Command Prompt as Administrator

### Getting Help

If you encounter issues not covered here:
1. Check the browser console for error messages (F12 → Console tab)
2. Check the terminal/command prompt for server errors
3. Review the application logs
4. Open an issue on the project repository with:
   - Your operating system and version
   - Node.js version (`node --version`)
   - Error messages or screenshots
   - Steps to reproduce the issue

---

## Upgrading

### Upgrading Node.js
1. Download the latest LTS version from [nodejs.org](https://nodejs.org/)
2. Run the installer
3. Reinstall dependencies: `npm install`

### Upgrading the Application
1. Pull the latest changes (if using Git):
   ```bash
   git pull
   ```
2. Reinstall dependencies:
   ```bash
   npm install
   ```
3. Restart the application

### Migrating Data
Currently, the application uses in-memory storage. This means:
- Data is lost when the server restarts
- Downloaded files remain on disk (in ComfyUI directory)
- Settings are stored in `.env` file

**Future versions** may include persistent database storage.

---

## Advanced Configuration

### Environment Variables

All environment variables can be set in the `.env` file:

```bash
# Server
PORT=5000                          # Port for the web server
NODE_ENV=development              # Environment mode

# CivitAI (optional, can be set via UI)
CIVITAI_API_KEY=your_key_here     # Your CivitAI API key

# ComfyUI (optional, can be set via UI)
COMFYUI_PATH=/path/to/comfyui    # ComfyUI installation directory
```

### Running on a Different Network

To access the application from other devices on your network:

1. Find your local IP address:
   - **Windows**: `ipconfig` (look for IPv4 Address)
   - **Linux/Mac**: `ifconfig` or `ip addr`

2. Access from other devices: `http://YOUR_IP:5000`

Note: Ensure your firewall allows connections on the configured port.

### Docker Support (Advanced)

Coming in future releases. For now, use the native installation method.

---

## Uninstalling

To remove the application:

1. Stop the server (Ctrl + C)
2. Delete the project folder
3. Optionally remove Node.js if not needed for other projects

Downloaded models in your ComfyUI directory will remain unless manually deleted.

---

## Next Steps

Now that you have the application installed:

1. **Configure Your Settings**: Set up your CivitAI API key and ComfyUI path
2. **Download Your First Model**: Paste a CivitAI model URL in the Dashboard
3. **Explore Features**: Check out the Gallery, Queue, and Statistics pages
4. **Customize**: Adjust category mappings and organization preferences

Enjoy managing your AI models! 🎨
