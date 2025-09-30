import json
import os
import torch
from transformers import pipeline

TARGET_LANGUAGE_CODE = 'bn'

DEVICE = 0 if torch.cuda.is_available() else -1
print(f"Using device: {'GPU' if DEVICE == 0 else 'CPU'}")

MODELS = {
    'hi': 'Helsinki-NLP/opus-mt-en-hi',
    'gu': 'Helsinki-NLP/opus-mt-en-gu',
    'ta': 'Helsinki-NLP/opus-mt-en-ta',
    'bn': 'Helsinki-NLP/opus-mt-en-bn'
}

MODEL_NAME = MODELS[TARGET_LANGUAGE_CODE]

SCRIPT_DIRECTORY = os.path.dirname(os.path.abspath(__file__))
INPUT_FILE = os.path.join(SCRIPT_DIRECTORY, 'english_dataset.jsonl')
OUTPUT_FILE = os.path.join(SCRIPT_DIRECTORY, f'{TARGET_LANGUAGE_CODE}_dataset.jsonl')
KEYS_TO_TRANSLATE = ['user', 'assistant']

def translate_from_scratch():
    print(f"Loading model for '{TARGET_LANGUAGE_CODE}': {MODEL_NAME}...")
    try:
        translator = pipeline("translation", model=MODEL_NAME, device=DEVICE)
        print("Model loaded successfully!")
    except Exception as e:
        print(f"Error loading model: {e}")
        return

    print(f"\nStarting translation from scratch for '{INPUT_FILE}'...")
    print(f"Output will be written to '{OUTPUT_FILE}'")
    lines_processed = 0
    try:
        with open(INPUT_FILE, 'r', encoding='utf-8') as infile, \
             open(OUTPUT_FILE, 'w', encoding='utf-8') as outfile:

            for i, line in enumerate(infile, 1):
                try:
                    data = json.loads(line)
                    translated_data = data.copy()

                    for key in KEYS_TO_TRANSLATE:
                        if key in data and data[key]:
                            original_text = data[key]
                            translated_output = translator(original_text)
                            translated_data[key] = translated_output[0]['translation_text']

                    outfile.write(json.dumps(translated_data, ensure_ascii=False) + '\n')
                    lines_processed += 1
                    if lines_processed % 20 == 0:
                        print(f"Processed {lines_processed} lines...")

                except json.JSONDecodeError:
                    print(f"Warning: Skipping malformed JSON on line {i}")

    except FileNotFoundError:
        print(f"ERROR: Input file not found at '{INPUT_FILE}'")
    except Exception as e:
        print(f"An unexpected error occurred during file processing: {e}")

    print("\n--- SCRIPT FINISHED ---")
    if lines_processed > 0:
        print(f"\n✅ Translation for '{TARGET_LANGUAGE_CODE}' complete! {lines_processed} lines were written to {OUTPUT_FILE}")

if __name__ == "__main__":
    translate_from_scratch()
