import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove the mobile-sub-nav block
    content = re.sub(r'\s*<div class="mobile-sub-nav">.*?</div>', '', content, flags=re.DOTALL)
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
        
print('Removed mobile sub menus from all HTML files.')
