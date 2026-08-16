"""
Generate responsive WebP derivatives for all gallery images.
Creates 3 sizes: 800w, 1200w, 1600w in WebP format.
Original JPEGs are NEVER modified.
Output goes to assets/<folder>/optimized/
"""
import os
import sys
from PIL import Image
import time

SIZES = [800, 1200, 1600]
WEBP_QUALITY = 82  # High quality — visually indistinguishable at rendered sizes
FOLDERS = ['assets/gallery', 'assets/animals', 'assets/cars', 'assets/portraits']
VALID_EXTS = ('.jpg', '.jpeg', '.png')

def process_folder(folder):
    if not os.path.exists(folder):
        print(f"  SKIP: {folder} does not exist")
        return 0, 0
    
    opt_dir = os.path.join(folder, 'optimized')
    os.makedirs(opt_dir, exist_ok=True)
    
    files = sorted([f for f in os.listdir(folder) 
                     if os.path.isfile(os.path.join(folder, f)) 
                     and f.lower().endswith(VALID_EXTS)])
    
    total_original = 0
    total_optimized = 0
    
    for fname in files:
        src_path = os.path.join(folder, fname)
        base_name = os.path.splitext(fname)[0]
        original_size = os.path.getsize(src_path)
        total_original += original_size
        
        try:
            img = Image.open(src_path)
            img = img.convert('RGB')  # Ensure RGB
            orig_w, orig_h = img.size
            
            for target_w in SIZES:
                out_name = f"{base_name}_{target_w}w.webp"
                out_path = os.path.join(opt_dir, out_name)
                
                # Skip if already exists and is newer than source
                if os.path.exists(out_path) and os.path.getmtime(out_path) > os.path.getmtime(src_path):
                    total_optimized += os.path.getsize(out_path)
                    continue
                
                # Only downscale, never upscale
                if orig_w <= target_w:
                    # Use original dimensions for this size tier
                    resized = img.copy()
                else:
                    ratio = target_w / orig_w
                    target_h = int(orig_h * ratio)
                    resized = img.resize((target_w, target_h), Image.LANCZOS)
                
                resized.save(out_path, 'WEBP', quality=WEBP_QUALITY, method=4)
                opt_size = os.path.getsize(out_path)
                total_optimized += opt_size
                
            img.close()
        except Exception as e:
            print(f"  ERROR processing {fname}: {e}")
    
    return total_original, total_optimized

if __name__ == '__main__':
    start = time.time()
    grand_original = 0
    grand_optimized = 0
    
    for folder in FOLDERS:
        print(f"\nProcessing {folder}...")
        orig, opt = process_folder(folder)
        grand_original += orig
        grand_optimized += opt
        print(f"  Original: {orig/1024/1024:.1f} MB")
        print(f"  Optimized (all sizes): {opt/1024/1024:.1f} MB")
    
    elapsed = time.time() - start
    print(f"\n{'='*50}")
    print(f"Total original: {grand_original/1024/1024:.1f} MB")
    print(f"Total optimized: {grand_optimized/1024/1024:.1f} MB")
    print(f"Reduction: {(1 - grand_optimized/grand_original)*100:.1f}%")
    print(f"Time: {elapsed:.1f}s")
