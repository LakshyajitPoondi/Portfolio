import os

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

old_text = "Hello yes glad you made it to the bottom. This website is just meant for me to show off my photography."
new_text = "Ah you finally made it to the bottom! Did you check out the photos in the gallery? If so, I hope you enjoyed my photography."

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if old_text in content:
        content = content.replace(old_text, new_text)
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {file}")
