import os
import uuid
import whisper
import shutil
import numpy as np
from moviepy.editor import VideoFileClip, AudioFileClip, CompositeVideoClip, TextClip
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS


app = Flask(__name__)
CORS(app)
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024


import base64

@app.route('/api/process-video', methods=['POST'])
def process_video():
    unique_id = request.form.get('uniqueId')
    font_size = request.form.get('fontSize')
    stroke_color = request.form.get('strokeColor')
    stroke_width = request.form.get('strokeWidth')
    transparent = request.form.get('transparent') == 'true'
    letter_spacing = request.form.get('letterSpacing')
    line_spacing = request.form.get('lineSpacing')
    selected_font = request.form.get('selectedFont')
    
    unique_dir = os.path.join("videos", unique_id)
    video_file_path = os.path.join(unique_dir, "input_video.mp4")
    
    generate_video_with_subtitles(
        video_file_path, 
        os.path.join(unique_dir, "subtitles.srt"),
        font_size, 
        stroke_color, 
        stroke_width, 
        transparent, 
        letter_spacing, 
        line_spacing, 
        selected_font
    )
    
    video_file_output = os.path.join(unique_dir, "output_video.mp4")


    with open(video_file_output, 'rb') as video_file:
        output_video = base64.b64encode(video_file.read()).decode('utf-8')


    return jsonify({
        "output_video": output_video,
        "unique_id": unique_id
    })



@app.route('/api/receive-video', methods=['POST'])
def receive_video():
    file = request.files['video']
    
    unique_id = str(uuid.uuid4())
    unique_dir = os.path.join("videos", unique_id)
    os.makedirs(unique_dir, exist_ok=True)
    
    video_file_path = os.path.join(unique_dir, "input_video.mp4")
    file.save(video_file_path)
    
    audio_file_path = os.path.join(unique_dir, "extracted_audio.mp3")  

    extracted_audio_file = extract_audio_from_video(video_file_path, audio_file_path)
    
    transcribe_audio(extracted_audio_file, unique_dir)

    
    with open(video_file_path, 'rb') as video_file:
        input_video = base64.b64encode(video_file.read()).decode('utf-8')

    srt_file_path = os.path.join(unique_dir, "subtitles.srt")
    with open(srt_file_path, 'r', encoding='utf-8') as srt_file:
        subtitles = srt_file.read()

    return jsonify({
        "input_video": input_video,
        "subtitles": subtitles,
        "unique_id": unique_id
    })



def extract_audio_from_video(video_file_path, output_audio_path):
    video = VideoFileClip(video_file_path)
    audio = video.audio
    audio.write_audiofile(output_audio_path)
    print(f"Audio extracted and saved to {output_audio_path}")
    return output_audio_path

def transcribe_audio(file_path, unique_dir):
    
    model = whisper.load_model("base")

    result = model.transcribe(file_path, verbose=True, word_timestamps=True)

    print("\nTranscription:")
    print(result["text"])

    with open(os.path.join(unique_dir, "transcription.txt"), "w", encoding="utf-8") as f:
        f.write(result["text"])

    create_srt_file(result["segments"], unique_dir)


def create_srt_file(segments, unique_dir, max_segment_duration=2):
    srt_file_path = os.path.join(unique_dir, "subtitles.srt")
    with open(srt_file_path, "w", encoding="utf-8") as f:
        segment_counter = 1
        
        for segment in segments:
            words = segment["words"]
            current_segment_start = segment["start"]
            current_segment_text = ""
            last_word_end = current_segment_start

            for word_info in words:
                word_start = word_info["start"]
                word_end = word_info["end"]
                word_text = word_info["word"]

                current_segment_text += word_text
                last_word_end = word_end

                if (word_end - current_segment_start) >= max_segment_duration:
                    f.write(f"{segment_counter}\n")
                    f.write(f"{format_timestamp(current_segment_start)} --> {format_timestamp(word_end)}\n")
                    f.write(f"{current_segment_text.strip()}\n\n")
                    segment_counter += 1

                    current_segment_start = word_end
                    current_segment_text = ""

            if current_segment_text.strip():
                f.write(f"{segment_counter}\n")
                f.write(f"{format_timestamp(current_segment_start)} --> {format_timestamp(last_word_end)}\n")
                f.write(f"{current_segment_text.strip()}\n\n")



def format_timestamp(seconds):
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    milliseconds = int((seconds % 1) * 1000)
    
    return f"{hours:02}:{minutes:02}:{secs:02},{milliseconds:03}"

def generate_video_with_subtitles(
    original_video_file, 
    srt_file, 
    font_size, 
    stroke_color, 
    stroke_width, 
    transparent, 
    letter_spacing, 
    line_spacing, 
    selected_font
):
    try:
        video = VideoFileClip(original_video_file)
        audio = video.audio
        print(f"Video file loaded successfully. Duration: {video.duration} seconds")

        video_width, video_height = video.size

        font_size_map = {
            "small": int(video_height * 0.04),
            "medium": int(video_height * 0.06),
            "large": int(video_height * 0.08)
        }
        font_size = font_size_map.get(font_size, int(video_height * 0.06))  # Default to medium if not specified

        color = 'white' if not transparent else 'rgba(255, 255, 255, 0.5)'

        letter_spacing_map = {
            "normal": 0,
            "wide": 2,
            "wider": 4,
            "widest": 6
        }
        line_spacing_map = {
            "normal": 0,
            "wide": 1.5,
            "wider": 2,
            "widest": 2.5
        }

        letter_spacing_value = letter_spacing_map.get(letter_spacing, 0)
        line_spacing_value = line_spacing_map.get(line_spacing, 0)
                
        font_path = f"./fonts/{selected_font}" if selected_font else "./fonts/ProximaNova_Bold.ttf"

        subtitle_clips = []
        with open(srt_file, 'r', encoding="utf-8") as f:
            lines = f.readlines()
            for i in range(0, len(lines), 4):
                timing = lines[i+1].strip().split(' --> ')
                start_time = timestamp_to_seconds(timing[0])
                end_time = timestamp_to_seconds(timing[1])
                
                text = lines[i+2].strip().upper()

                subtitle = TextClip(
                    text,
                    fontsize=font_size,
                    color=color,
                    font=font_path,  
                    stroke_color=stroke_color,
                    stroke_width=int(stroke_width),
                    method='caption',
                    size=(int(video_width * 0.8), None),  
                    kerning=letter_spacing_value,  
                    interline=line_spacing_value 
                )

                subtitle = subtitle.set_position(('center', video_height * 0.72))
                subtitle = subtitle.set_start(start_time).set_end(end_time)
                
                subtitle_clips.append(subtitle)
                
            final_video = CompositeVideoClip([video] + subtitle_clips)
            final_video = final_video.set_audio(audio)
            
            final_video.write_videofile(os.path.join(os.path.dirname(srt_file), "output_video.mp4"), fps=30)
            print("Video created!")
    except Exception as e:
        print(f"An error occurred while generating the video: {e}")




def timestamp_to_seconds(timestamp):
    h, m, s = timestamp.split(":")
    s, ms = s.split(",")
    return int(h) * 3600 + int(m) * 60 + int(s) + int(ms) / 1000

if __name__ == "__main__":
    app.run(debug=True)
