"""Rebuild index.html: replace its <script> block with sprites_data.js + bundle.js."""
import os

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')


def main():
    path = os.path.join(ROOT, 'index.html')
    with open(path, encoding='utf-8') as f:
        lines = f.readlines()
    si = next(i for i, l in enumerate(lines) if l.strip() == '<script>')
    ei = next(i for i, l in enumerate(lines) if l.strip() == '</script>' and i > si)
    sprites = open(os.path.join(ROOT, 'js', 'sprites_data.js'), encoding='utf-8').read()
    bundle = open(os.path.join(ROOT, 'js', 'bundle.js'), encoding='utf-8').read()
    html = ''.join(lines[:si + 1]) + '\n' + sprites + '\n' + bundle + '\n' + ''.join(lines[ei:])
    with open(path, 'w', encoding='utf-8', newline='\n') as f:
        f.write(html)
    print(f'Wrote {path} ({os.path.getsize(path) // 1024} KB)')


if __name__ == '__main__':
    main()
