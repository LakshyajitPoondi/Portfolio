import os

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

old_text = "Ah you finally made it to the bottom! Did you check out the photos in the gallery? If so, I hope you enjoyed my photography."
new_text = "Ahh, You made it to the bottom! Did you check out my photos? If so, I hope you enjoyed what I had to offer!"

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if old_text in content:
        content = content.replace(old_text, new_text)
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {file}")
