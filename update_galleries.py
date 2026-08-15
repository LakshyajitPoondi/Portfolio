import os
import re

html_files = {
    'gallery.html': 'assets/gallery',
    'animals.html': 'assets/animals',
    'cars.html': 'assets/cars'
}
valid_exts = ('.jpg', '.jpeg', '.png', '.webp', '.JPG', '.JPEG')

for file, img_dir in html_files.items():
    if not os.path.exists(file):
        continue
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    images = []
    if os.path.exists(img_dir):
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
    
    if file == 'gallery.html':
        heading = 'Gallery'
    elif file == 'animals.html':
        heading = 'Animals'
    else:
        heading = 'Cars'
        
    items = []
    for i, (img, priority) in enumerate(images):
        url_dir = img_dir.replace('\\', '/')
        items.append(f'    <div class="gallery-item">\n      <img data-src="{url_dir}/{img}" data-priority="{priority}" alt="{heading} Image {i+1}">\n    </div>')
    
    replacement = '<section class="gallery-grid">\n' + '\n'.join(items) + '\n  </section>'
    content = re.sub(r'<section class="gallery-grid">.*?</section>', replacement, content, flags=re.DOTALL)
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
print("Updated HTML files with data-src and data-priority.")
