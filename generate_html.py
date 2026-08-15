import os
import re

html_file = 'portraits.html'
with open(html_file, 'r', encoding='utf-8') as f:
    content = f.read()

portrait_dir = 'assets/Portraits' if os.path.exists('assets/Portraits') else 'assets/portraits'
valid_exts = ('.jpg', '.jpeg', '.png', '.webp')
images = sorted([img for img in os.listdir(portrait_dir) if any(img.lower().endswith(ext) for ext in valid_exts)])

items = []
for i, img in enumerate(images):
    items.append(f'    <div class="gallery-item">\n      <img src="assets/Portraits/{img}" alt="Portrait {i+1}" loading="lazy">\n    </div>')

replacement = '<section class="portraits-grid" id="portraits-container">\n' + '\n'.join(items) + '\n  </section>'

content = re.sub(r'<section class="portraits-grid" id="portraits-container">.*?</section>', replacement, content, flags=re.DOTALL)

with open(html_file, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Successfully generated {html_file} with {len(items)} portraits.")
