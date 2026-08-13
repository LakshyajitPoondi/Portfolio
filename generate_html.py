import os
import re

html_file = 'portraits.html'
with open(html_file, 'r', encoding='utf-8') as f:
    content = f.read()

images = sorted(os.listdir('assets/portraits'))
items = []
for i, img in enumerate(images):
    items.append(f'    <div class="gallery-item">\n      <img src="assets/portraits/{img}" alt="Portrait {i+1}" loading="lazy">\n    </div>')

replacement = '<section class="portraits-grid" id="portraits-container">\n' + '\n'.join(items) + '\n  </section>'

content = re.sub(r'<section class="portraits-grid" id="portraits-container">.*?</section>', replacement, content, flags=re.DOTALL)

with open(html_file, 'w', encoding='utf-8') as f:
    f.write(content)
