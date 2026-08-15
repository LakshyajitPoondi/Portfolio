import os
import re

file = 'portraits.html'
if os.path.exists(file):
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    def replacer(match):
        src = match.group(1)
        full_path = src
        priority = 'medium'
        if os.path.exists(full_path):
            size = os.path.getsize(full_path)
            priority = 'high'
            if size > 2 * 1024 * 1024: priority = 'low'
            elif size > 1 * 1024 * 1024: priority = 'medium'
        
        rest = match.group(2)
        rest = re.sub(r'\s*loading="lazy"', '', rest)
        return f'<img data-src="{src}" data-priority="{priority}"{rest}>'
    
    content = re.sub(r'<img src="(assets/portraits/[^"]+)"([^>]*)>', replacer, content)
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
print('Updated portraits.html images')
