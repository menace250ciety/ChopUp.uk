import os
import re

folder_path = r"C:\Users\tobi\onedrive\Desktop\my work\Chopup.uk"  # UPDATE THIS
css_file = os.path.join(folder_path, "styles.css")
output_file = os.path.join(folder_path, "styles.cleaned.css")

# Collect used classes and IDs from HTML
used_classes = set()
used_ids = set()

for file_name in os.listdir(folder_path):
    if file_name.endswith(".html"):
        with open(os.path.join(folder_path, file_name), "r", encoding="utf-8") as f:
            content = f.read()
            classes = re.findall(r'class="([^"]+)"', content)
            ids = re.findall(r'id="([^"]+)"', content)
            for cls in classes:
                used_classes.update(cls.split())
            used_ids.update(ids)

# Clean CSS
with open(css_file, "r", encoding="utf-8") as f:
    css_lines = f.readlines()

cleaned_css = []
keep = False

for line in css_lines:
    stripped = line.strip()
    if "{" in stripped:
        selector = stripped.split("{")[0].strip()
        selectors = [s.strip() for s in selector.split(",")]
        keep = False
        for sel in selectors:
            if sel.startswith(".") and sel[1:] in used_classes:
                keep = True
            elif sel.startswith("#") and sel[1:] in used_ids:
                keep = True
            elif not sel.startswith(".") and not sel.startswith("#"):
                keep = True  # e.g., body, h1
    if keep:
        cleaned_css.append(line)
    if "}" in stripped:
        keep = False

with open(output_file, "w", encoding="utf-8") as f:
    f.writelines(cleaned_css)

print(f"Cleaned CSS saved to {output_file}")