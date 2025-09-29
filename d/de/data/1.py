import json
import os
import torch
from transformers import pipeline

DEVICE = 0 if torch.cuda.is_available() else -1 
print(f"Using device: {'GPU' if DEVICE == 0 else 'CPU'}")


MODELS = {
    'hi': 'Helsinki-NLP/opus-mt-en-hi',
    'gu': 'Helsinki-NLP/opus-mt-en-gu',
    'ta': 'Helsinki-NLP/opus-mt-en-ta',
    'bn': 'Helsinki-NLP/opus-mt-en-bn'
}

SCRIPT_DIRECTORY = os.path.dirname(os.path.abspath(__file__))
INPUT_FILE = os.path.join(SCRIPT_DIRECTORY, 'english_dataset.jsonl')
KEYS_TO_TRANSLATE = ['user', 'assistant'] 

LANGUAGES_AND_FILENAMES = {
    'gu': os.path.join(SCRIPT_DIRECTORY, 'gujarati_dataset.jsonl'),
    'hi': os.path.join(SCRIPT_DIRECTORY, 'hindi_dataset.jsonl'),
    'ta': os.path.join(SCRIPT_DIRECTORY, 'tamil_dataset.jsonl'),
    'bn': os.path.join(SCRIPT_DIRECTORY, 'bengali_dataset.jsonl')
}


def local_translation():
    """
    Translates a dataset using local, offline models from Hugging Face.
    """
    print("Loading translation models... This may take a while on the first run as models are downloaded.")
    try:

        translators = {
            lang: pipeline("translation", model=model_name, device=DEVICE)
            for lang, model_name in MODELS.items()
        }
        print("All models loaded successfully!")
    except Exception as e:
        print(f"Error loading models: {e}")
        print("Please ensure you have a stable internet connection for the first run to download models.")
        return
    print(f"Starting translation process for '{INPUT_FILE}'...")
    output_files = {} 
    lines_read = 0
    lines_written = 0
    
    try:
        if not os.path.exists(INPUT_FILE) or os.path.getsize(INPUT_FILE) == 0:
            print(f"Error: Input file is missing or empty: '{INPUT_FILE}'")
            return

        output_files = {lang: open(fname, 'w', encoding='utf-8') for lang, fname in LANGUAGES_AND_FILENAMES.items()}

        with open(INPUT_FILE, 'r', encoding='utf-8') as infile:
            for i, line in enumerate(infile, 1):
                lines_read += 1
                try:
                    data = json.loads(line)
                    
                    for lang_code, file_handler in output_files.items():
                        translated_data = data.copy()
                        translator = translators[lang_code]
                        
                        for key in KEYS_TO_TRANSLATE:
                            if key in data and data[key]:
                                original_text = data[key]
                                translated_output = translator(original_text)
                                translated_data[key] = translated_output[0]['translation_text']
                        
                        file_handler.write(json.dumps(translated_data, ensure_ascii=False) + '\n')
                    
                    lines_written += 1
                    if lines_written % 10 == 0:
                        print(f"Processed {lines_written} lines...")

                except json.JSONDecodeError:
                    print(f"Warning: Skipping malformed JSON on line {i}")

    except Exception as e:
        print(f"An unexpected error occurred during file processing: {e}")
    finally:
        for handler in output_files.values():
            handler.close()

    print("\n--- SCRIPT FINISHED ---")
    print(f"Total lines read: {lines_read}")
    print(f"Total lines written: {lines_written}")
    if lines_written > 0:
        print("\n✅ Translation complete!")

if __name__ == "__main__":
    local_translation()