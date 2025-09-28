import json
from deep_translator import GoogleTranslator
import time
import os

SCRIPT_DIRECTORY = os.path.dirname(os.path.abspath(__file__))


INPUT_FILE = os.path.join(SCRIPT_DIRECTORY, 'english_dataset.jsonl')

KEYS_TO_TRANSLATE = ['user', 'assistant'] 

LANGUAGES_AND_FILENAMES = {
    'gu': os.path.join(SCRIPT_DIRECTORY, 'gujarati_dataset.jsonl'),
    'hi': os.path.join(SCRIPT_DIRECTORY, 'hindi_dataset.jsonl'),
    'ta': os.path.join(SCRIPT_DIRECTORY, 'tamil_dataset.jsonl'),
    'bn': os.path.join(SCRIPT_DIRECTORY, 'bengali_dataset.jsonl')
}
# --------------------

def run_translation():
    """
    Reads a JSONL file with 'user' and 'assistant' keys, translates their content,
    and creates separate translated files for each language.
    """
    print(f"Starting translation process for '{INPUT_FILE}'...")
    
    output_files = {} 
    success = True
    lines_read = 0
    lines_written = 0
    
    try:
        if not os.path.exists(INPUT_FILE) or os.path.getsize(INPUT_FILE) == 0:
            print(f"Error: Input file is missing or empty: '{INPUT_FILE}'")
            return

        output_files = {lang: open(fname, 'w', encoding='utf-8') for lang, fname in LANGUAGES_AND_FILENAMES.items()}

        with open(INPUT_FILE, 'r', encoding='utf-8') as infile:
            for i, line in enumerate(infile):
                lines_read += 1
                try:
                    data = json.loads(line)
                    
                    # Process each target language
                    for lang_code, file_handler in output_files.items():
                        translated_data = data.copy() 
                        
                        for key in KEYS_TO_TRANSLATE:
                            if key in data and data[key]: # Check if key exists and is not empty
                                original_text = data[key]
                                translated_text = GoogleTranslator(source='auto', target=lang_code).translate(original_text)
                                translated_data[key] = translated_text
                        
                        # Write the fully translated object to the correct language file
                        file_handler.write(json.dumps(translated_data, ensure_ascii=False) + '\n')
                    
                    lines_written += 1
                    print(f"Processed line {i+1}...")
                    time.sleep(1) # Polite delay

                except json.JSONDecodeError:
                    print(f"Warning: Skipping malformed JSON on line {i+1}")
                except Exception as e:
                    print(f"An error occurred on line {i+1}: {e}")

    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        success = False
    finally:
        for handler in output_files.values():
            handler.close()

    print("\n--- SCRIPT FINISHED ---")
    print(f"Total lines read from input file: {lines_read}")
    print(f"Total lines successfully translated and written: {lines_written}")
    if success and lines_written > 0:
        print("\n✅ All translation files created successfully and contain data!")

if __name__ == "__main__":
    run_translation()