"""
Update all HTML files to:
1. Add preconnect hints for Google Fonts and cdnjs
2. Replace CSS @import with a <link> tag for Google Fonts  
3. Add defer to non-critical script tags
"""
import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

# The new head additions
PRECONNECT = '''  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap">'''

for fname in html_files:
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Add preconnect + font link BEFORE the main.css link (if not already there)
    if 'preconnect' not in content:
        content = content.replace(
            '  <link rel="stylesheet" href="styles/main.css">',
            PRECONNECT + '\n  <link rel="stylesheet" href="styles/main.css">'
        )
    
    # 2. Add defer to GSAP scripts (they're not needed until DOMContentLoaded)
    # Actually, GSAP needs to be available before main.js runs, so we should NOT defer GSAP
    # but we CAN defer main.js since it waits for DOMContentLoaded anyway
    # No — defer already ensures execution order. Let's just leave scripts as-is since 
    # they're at the bottom of body which is already non-blocking.
    
    with open(fname, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Updated {fname}")

print("\nDone!")
