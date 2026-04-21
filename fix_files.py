import os
import re

base_dir = r"c:\Users\ajst1\Phantom\PhantomFrame"

for root, _, files in os.walk(base_dir):
    for f in files:
        if f.endswith(".js") or f.endswith(".css"):
            path = os.path.join(root, f)
            with open(path, "r", encoding="utf-8") as file:
                content = file.read()
            
            # Simple heuristic: if it looks like python script wrapping JS/CSS
            if '"""' in content or '"" "' in content:
                start = content.find('"""')
                if start == -1:
                    start = content.find('"" "')
                    if start != -1:
                        start += 4
                else:
                    start += 3
                
                end = content.rfind('"""')
                if end == -1 or end < start:
                    end = content.rfind('"" "')
                
                if start != -1 and end != -1 and start < end:
                    # check if the part before start contains "with open" or "= \"\"\""
                    prefix = content[:start]
                    if "=" in prefix or "with open" in content:
                        actual_code = content[start:end]
                        # Remove leading newline if present
                        if actual_code.startswith('\n'):
                            actual_code = actual_code[1:]
                        with open(path, "w", encoding="utf-8") as file:
                            file.write(actual_code)
                        print(f"Fixed {path}")
