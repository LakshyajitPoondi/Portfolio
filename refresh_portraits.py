import os
import re

file = 'portraits.html'
img_dir = 'assets/portraits'
valid_exts = ('.jpg', '.jpeg', '.png', '.webp', '.JPG', '.JPEG')

if os.path.exists(file) and os.path.exists(img_dir):
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    images = []
    for entry in os.listdir(img_dir):
        full_path = os.path.join(img_dir, entry)
        if os.path.isfile(full_path) and any(entry.lower().endswith(ext.lower()) for ext in valid_exts):
            size = os.path.getsize(full_path)
            priority = 'high'
            if size > 2 * 1024 * 1024:
                priority = 'low'
            elif size > 1 * 1024 * 1024:
                priority = 'medium'
            images.append((entry, priority))

    images.sort(key=lambda x: x[0])
    
    items = []
    for i, (img, priority) in enumerate(images):
        url_dir = img_dir.replace('\\', '/')
        items.append(f'    <div class="gallery-item">\n      <img data-src="{url_dir}/{img}" data-priority="{priority}" alt="Portrait {i+1}">\n    </div>')
    
    # In portraits.html, it's <section class="portraits-grid" id="portraits-container">
    # Wait, earlier I found it uses <section class="portraits-grid" id="portraits-container">
    # Let's replace the contents of this section.
    replacement = '<section class="portraits-grid" id="portraits-container">\n' + '\n'.join(items) + '\n  </section>'
    content = re.sub(r'<section class="portraits-grid".*?</section>', replacement, content, flags=re.DOTALL)
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
print("Updated portraits.html")
