import os
import glob

html_files = glob.glob('*.html')

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace occurrences of ">Animals<"
    new_content = content.replace('>Animals<', '>Wildlife<')
    # Replace the title in animals.html
    new_content = new_content.replace('<title>Animals Gallery', '<title>Wildlife Gallery')
    # Replace h1 just in case it had spaces
    new_content = new_content.replace('<h1 class="title-xl">Animals</h1>', '<h1 class="title-xl">Wildlife</h1>')

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")
