"""
Rebuild gallery HTML files to use:
- <picture> with WebP srcset for responsive images
- Native loading="lazy" for below-fold images
- fetchpriority="high" for first 6 above-fold images
- No data-src, no data-priority, no JS dependency
"""
import os
import re
import urllib.parse
from PIL import Image

# Configuration
ABOVE_FOLD_COUNT = 6  # First N images get high priority, no lazy loading
SIZES = [800, 1200, 1600]

# Map of gallery HTML file -> image folder
GALLERIES = {
    'gallery.html': 'assets/gallery',
    'animals.html': 'assets/animals',
    'cars.html': 'assets/cars',
}

VALID_EXTS = ('.jpg', '.jpeg', '.png')

def get_picture_element(folder, filename, index, alt_text):
    """Generate a <picture> element with WebP srcset and JPEG fallback."""
    base_name = os.path.splitext(filename)[0]
    opt_dir = f"{folder}/optimized"
    
    # Build srcset for WebP
    webp_srcset_parts = []
    for w in SIZES:
        webp_file = f"{opt_dir}/{base_name}_{w}w.webp"
        if os.path.exists(webp_file):
            encoded_url = urllib.parse.quote(f"{opt_dir}/{base_name}_{w}w.webp")
            webp_srcset_parts.append(f"{encoded_url} {w}w")
    
    webp_srcset = ', '.join(webp_srcset_parts)
    
    # Sizes attribute: desktop 3-col (~33vw), tablet 2-col (~50vw), mobile 1-col (100vw)
    sizes = "(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw"
    
    # First N images: eager loading, high priority
    if index < ABOVE_FOLD_COUNT:
        loading_attr = ''
        priority_attr = ' fetchpriority="high"'
        decoding_attr = ' decoding="async"'
    else:
        loading_attr = ' loading="lazy"'
        priority_attr = ''
        decoding_attr = ' decoding="async"'
    
    # Extract original image dimensions using PIL
    img_path = os.path.join(folder, filename)
    try:
        with Image.open(img_path) as im:
            width, height = im.size
        dimensions_attr = f' width="{width}" height="{height}"'
    except Exception as e:
        print(f"Warning: Could not read dimensions for {img_path}: {e}")
        dimensions_attr = ''

    # Build the picture element
    lines = []
    lines.append('      <picture>')
    if webp_srcset:
        lines.append(f'        <source type="image/webp" srcset="{webp_srcset}" sizes="{sizes}">')
    encoded_src = urllib.parse.quote(f"{folder}/{filename}")
    lines.append(f'        <img src="{encoded_src}" alt="{alt_text}"{dimensions_attr}{loading_attr}{decoding_attr}{priority_attr}>')
    lines.append('      </picture>')
    
    return '\n'.join(lines)


def rebuild_gallery(html_file, img_folder):
    if not os.path.exists(html_file):
        print(f"  SKIP: {html_file} does not exist")
        return
    
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Get sorted list of images in the folder
    images = sorted([f for f in os.listdir(img_folder) 
                      if os.path.isfile(os.path.join(img_folder, f))
                      and f.lower().endswith(VALID_EXTS)])
    
    # Determine the gallery section class
    if 'gallery-grid' in content:
        grid_class = 'gallery-grid'
    elif 'portraits-grid' in content:
        grid_class = 'portraits-grid'
    else:
        print(f"  SKIP: No gallery grid found in {html_file}")
        return
    
    # Determine alt text prefix
    folder_name = os.path.basename(img_folder).capitalize()
    alt_prefix = f"{folder_name} Image"
    
    # Build new gallery items
    items = []
    for i, img in enumerate(images):
        alt = f"{alt_prefix} {i+1}"
        picture = get_picture_element(img_folder, img, i, alt)
        items.append(f'    <div class="gallery-item">\n{picture}\n    </div>')
    
    gallery_html = '\n'.join(items)
    
    # Find and replace the gallery grid contents
    # Match the section with the grid class and its id
    pattern = rf'(<section class="{grid_class}"[^>]*>)\s*(.*?)\s*(</section>)'
    replacement = rf'\1\n{gallery_html}\n  \3'
    
    new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"  Updated {html_file}: {len(images)} images ({ABOVE_FOLD_COUNT} eager, {len(images) - ABOVE_FOLD_COUNT} lazy)")


def rebuild_portraits():
    """Rebuild portraits.html using the same approach."""
    html_file = 'portraits.html'
    img_folder = 'assets/portraits'
    
    if not os.path.exists(html_file):
        print(f"  SKIP: {html_file} does not exist")
        return
    
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    images = sorted([f for f in os.listdir(img_folder) 
                      if os.path.isfile(os.path.join(img_folder, f))
                      and f.lower().endswith(VALID_EXTS)])
    
    items = []
    for i, img in enumerate(images):
        alt = f"Portrait {i+1}"
        picture = get_picture_element(img_folder, img, i, alt)
        items.append(f'    <div class="gallery-item">\n{picture}\n    </div>')
    
    gallery_html = '\n'.join(items)
    
    pattern = r'(<section class="portraits-grid"[^>]*>)\s*(.*?)\s*(</section>)'
    replacement = rf'\1\n{gallery_html}\n  \3'
    
    new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"  Updated {html_file}: {len(images)} images ({ABOVE_FOLD_COUNT} eager, {len(images) - ABOVE_FOLD_COUNT} lazy)")


if __name__ == '__main__':
    print("Rebuilding gallery HTML files with responsive images...\n")
    
    for html_file, img_folder in GALLERIES.items():
        print(f"Processing {html_file}...")
        rebuild_gallery(html_file, img_folder)
    
    print(f"\nProcessing portraits.html...")
    rebuild_portraits()
    
    print("\nDone!")
