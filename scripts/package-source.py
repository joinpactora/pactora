"""Package this static project for handoff, without Site identity or Git metadata."""
from pathlib import Path
import zipfile
root = Path(__file__).resolve().parent.parent
out = root / 'dist' / 'relayworks-source.zip'
with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as archive:
    for path in sorted(root.rglob('*')):
        relative = path.relative_to(root)
        if not path.is_file() or path == out:
            continue
        if any(part in {'.git', '.openai', 'node_modules', '__pycache__'} for part in relative.parts):
            continue
        if relative.parts[:2] in {('model', 'poses'), ('model', 'journey')}:
            continue
        if path.name.startswith('__qa') or path.suffix in {'.tar', '.gz'}:
            continue
        archive.write(path, 'relayworks/' + str(relative))
print(f'Packaged {out.stat().st_size:,} bytes')
