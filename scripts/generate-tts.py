import asyncio
import edge_tts
import os

OUTPUT_DIR = r"C:\Projects\thejord\thejord-web\demo-output"

# Voiceover segments
SEGMENTS = [
    "Meet THE JORD. 14 free developer tools that respect your privacy.",
    "Unlike other tools, your data never leaves your browser.",
    "Watch. I'll format this JSON. Instantly. No upload required.",
    "Need to merge PDFs? Drag, drop, done. All processed locally.",
    "Base64 encoding? One click. Fast and private.",
    "No sign up. No tracking. Just tools that work.",
    "Try it free at the jord dot i t"
]

# Good quality voices to try
VOICE = "en-US-ChristopherNeural"  # Clear male voice

async def generate_audio(text: str, output_file: str):
    """Generate TTS audio for a single segment"""
    communicate = edge_tts.Communicate(text, VOICE)
    await communicate.save(output_file)
    print(f"Generated: {output_file}")

async def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # Generate each segment
    for i, segment in enumerate(SEGMENTS):
        output_file = os.path.join(OUTPUT_DIR, f"voice_{i}.mp3")
        try:
            await generate_audio(segment, output_file)
        except Exception as e:
            print(f"Error generating segment {i}: {e}")

    # Generate combined audio
    full_text = " ... ".join(SEGMENTS)  # Pauses between segments
    combined_file = os.path.join(OUTPUT_DIR, "voice_combined.mp3")
    try:
        await generate_audio(full_text, combined_file)
        print(f"\nCombined audio saved to: {combined_file}")
    except Exception as e:
        print(f"Error generating combined: {e}")

if __name__ == "__main__":
    asyncio.run(main())
