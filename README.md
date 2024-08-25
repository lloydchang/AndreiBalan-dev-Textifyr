# Textifyr
**[Live Deployment](https://textifyr.com/)**

![Hackathon Badge](https://img.shields.io/badge/Hackathon-Headstarter_Hiring_Hackathon_2-blue)

### 🏆 Hackathon Project - "Headstarter Hiring Hackathon 2" (Aug 25, 2024)

**This project was done in 32 hours**

### Theme
Subtitle Generation and Video Processing

### Author
- Created and maintained by **[Andrei Balan](https://www.linkedin.com/in/andrei-balan-dev/)**.

## 🚀 Project Overview

**Textifyr** is a cutting-edge web application that allows users to generate subtitles for videos using advanced AI-driven transcription. This project was developed during the Headstarter Hiring Hackathon 2 event held on August 24-26, 2024.

This tool provides users with an easy way to transcribe audio from videos, generate subtitles, and then embed these subtitles back into the video. It is a fully-functional proof-of-concept showcasing potential premium features like higher video quality, additional fonts, and more customization options in a production environment.

## 🌟 Inspiration

Inspired by the need for accessible video editing tools, Textifyr was created to make subtitle generation effortless and efficient. Despite the limited time, the project demonstrates the potential of combining AI, video processing, and web technologies.

## 🔧 Built With

- **React (TypeScript)**: For building the dynamic and interactive user interface.
- **Flask**: To handle API requests and serve the React app.
- **Whisper (by OpenAI)**: For AI-driven transcription of video audio.
- **MoviePy**: To generate and embed subtitles in the video.
- **Gunicorn**: For serving the Flask application in a production environment.
- **Nginx**: As a reverse proxy to handle requests and serve static files.
- **FFmpeg**: For video compression and processing.
- **ImageMagick**: For handling image operations required in video processing.

## 🧩 Features

**AI-Driven Transcription**: Generate accurate subtitles using Whisper by OpenAI.
**Video Processing**: Embed subtitles directly into videos.
**Customizable Subtitles**: Choose from different fonts, sizes, colors, and spacing options.
**Securization & Authorization**: Ensure API requests are secure with secret tokens.

## 🎮 How to Run Locally

### Clone the repository:

```bash
git clone https://github.com/AndreiBalan-dev/textifyr.git
```

### Set up the Python environment:

```bash
python3 -m venv env
source env/bin/activate
```

### Navigate to the project directory:

```bash
cd textifyr/server
```

**Copy all contents to your new env file**
**Delete textifyr/server and rename your new env file "server"**

### Install the required libraries

```bash
pip install -r requirements.txt
```

### Navigate to the client directory and build the React app:

```bash
cd ../client
npm install
npm run build
```


### Update your global settings:

Modify **path.json** and **settings.json** in the root directory.
Modify your secret API token in secret.json if you require so.

### Ensure FFmpeg and ImageMagick are installed and accessible:

**For Linux - Ubuntu:**

```bash
sudo apt-get install ffmpeg imagemagick
```

### Run the development server:

```bash
python3 main.py
```

Open the project in your browser:

Visit http://localhost:5000 (or whatever is your default) to access the application.

## ✏ License
This project is licensed under the MIT License - see the LICENSE file for details.
