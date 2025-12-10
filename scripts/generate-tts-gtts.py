from gtts import gTTS
import os

OUTPUT_DIR = r"C:\Projects\thejord\thejord-web\demo-output"

# Full voiceover script
FULL_SCRIPT = """
Meet THE JORD. 14 free developer tools that respect your privacy.

Unlike other tools, your data never leaves your browser.

Watch. I'll format this JSON. Instantly. No upload required.

Need to merge PDFs? Drag, drop, done. All processed locally.

Base64 encoding? One click. Fast and private.

No sign up. No tracking. Just tools that work.

Try it free at thejord.it
"""

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    output_file = os.path.join(OUTPUT_DIR, "voice_gtts.mp3")

    print("Generating TTS with Google TTS...")
    tts = gTTS(text=FULL_SCRIPT, lang='en', slow=False)
    tts.save(output_file)

    print(f"Done! Audio saved to: {output_file}")

if __name__ == "__main__":
    main()
