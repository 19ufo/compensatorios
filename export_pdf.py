import os
import subprocess
import markdown

WORKSPACE_DIR = r"e:\Desarrollos\Antigravity\Compensatorios"
MD_PATH = os.path.join(WORKSPACE_DIR, "PASO_A_PASO_CREACION.md")
HTML_PATH = os.path.join(WORKSPACE_DIR, "PASO_A_PASO_CREACION.html")
PDF_PATH = os.path.join(WORKSPACE_DIR, "PASO_A_PASO_CREACION.pdf")

with open(MD_PATH, "r", encoding="utf-8") as f:
    md_text = f.read()

# Convert markdown to HTML
html_body = markdown.markdown(md_text, extensions=["tables", "fenced_code"])

# High quality CSS designed for executive PDF printing
html_document = """<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>Bitácora Paso a Paso: Compensatorios</title>
<style>
  @page {
    size: A4;
    margin: 18mm 15mm 18mm 15mm;
  }
  * {
    box-sizing: border-box;
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: #1F2937;
    line-height: 1.55;
    font-size: 13px;
    background-color: #FFFFFF;
    margin: 0;
    padding: 0;
  }
  .hero-banner {
    background: linear-gradient(135deg, #1E382B 0%, #2D5A45 50%, #6E4C33 100%);
    color: #FFFFFF;
    padding: 24px 26px;
    border-radius: 10px;
    margin-bottom: 22px;
  }
  .hero-tag {
    display: inline-block;
    background: rgba(255, 255, 255, 0.2);
    color: #FFFFFF;
    font-size: 10.5px;
    font-weight: 700;
    padding: 3px 9px;
    border-radius: 20px;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    margin-bottom: 8px;
  }
  .hero-title {
    font-size: 22px;
    font-weight: 800;
    margin: 0 0 6px 0;
    color: #FFFFFF;
    letter-spacing: -0.3px;
  }
  .hero-sub {
    font-size: 12.5px;
    color: #E2E8F0;
    margin: 0;
    opacity: 0.95;
  }
  h1 {
    font-size: 19px;
    color: #1E382B;
    border-bottom: 2px solid #E5E7EB;
    padding-bottom: 6px;
    margin-top: 24px;
    margin-bottom: 12px;
    page-break-after: avoid;
  }
  h2 {
    font-size: 15.5px;
    color: #1E382B;
    border-bottom: 1px solid #E5E7EB;
    padding-bottom: 4px;
    margin-top: 20px;
    margin-bottom: 10px;
    page-break-after: avoid;
  }
  h3 {
    font-size: 13.5px;
    color: #6E4C33;
    margin-top: 14px;
    margin-bottom: 6px;
    font-weight: 700;
    page-break-after: avoid;
  }
  p {
    margin: 0 0 10px 0;
  }
  ul, ol {
    margin: 0 0 12px 0;
    padding-left: 22px;
  }
  li {
    margin-bottom: 4px;
  }
  pre {
    background-color: #181C20;
    color: #E2E8F0;
    padding: 12px 14px;
    border-radius: 7px;
    overflow-x: auto;
    font-family: Consolas, "Cascadia Code", "Courier New", monospace;
    font-size: 11px;
    line-height: 1.45;
    border: 1px solid #2D3748;
    margin: 10px 0 14px 0;
    page-break-inside: avoid;
  }
  code {
    background-color: #F3F4F6;
    color: #9A3412;
    padding: 2px 5px;
    border-radius: 4px;
    font-family: Consolas, "Cascadia Code", "Courier New", monospace;
    font-size: 11.5px;
    font-weight: 600;
  }
  pre code {
    background-color: transparent;
    color: #E2E8F0;
    padding: 0;
    font-weight: 400;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0 16px 0;
    font-size: 12px;
    page-break-inside: avoid;
  }
  th, td {
    border: 1px solid #E5E7EB;
    padding: 7px 10px;
    text-align: left;
  }
  th {
    background-color: #F8FAFC;
    color: #334155;
    font-weight: 700;
  }
  tr:nth-child(even) {
    background-color: #FBFBFA;
  }
  blockquote {
    border-left: 4px solid #6E4C33;
    background-color: #FAF8F5;
    margin: 12px 0;
    padding: 8px 14px;
    border-radius: 0 6px 6px 0;
    color: #4B5563;
    font-style: italic;
  }
  hr {
    border: none;
    border-top: 1px solid #E5E7EB;
    margin: 18px 0;
  }
  a {
    color: #1E382B;
    text-decoration: underline;
    font-weight: 600;
  }
  .doc-footer {
    margin-top: 24px;
    padding-top: 12px;
    border-top: 1px solid #E5E7EB;
    text-align: center;
    font-size: 11px;
    color: #64748B;
    page-break-before: auto;
  }
</style>
</head>
<body>
  <div class="hero-banner">
    <div class="hero-tag">Documentación Técnica Oficial</div>
    <div class="hero-title">Planificador de Compensatorios</div>
    <div class="hero-sub">Guía paso a paso: De Excel local a Aplicación Web Segura en Producción (Vercel + Supabase)</div>
  </div>
""" + html_body + """
  <div class="doc-footer">
    Documentación oficial del proyecto &bull; Anderson CT &bull; https://compensatorios.vercel.app
  </div>
</body>
</html>
"""

with open(HTML_PATH, "w", encoding="utf-8") as f:
    f.write(html_document)

print(f"HTML generated at {HTML_PATH}")

# Search for available browser binary
candidates = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"
]

browser_exe = None
for c in candidates:
    if os.path.exists(c):
        browser_exe = c
        break

if not browser_exe:
    raise RuntimeError("No headless browser found to print PDF.")

print(f"Using browser: {browser_exe}")

cmd = [
    browser_exe,
    "--headless",
    "--disable-gpu",
    f"--print-to-pdf={PDF_PATH}",
    "--no-pdf-header-footer",
    HTML_PATH
]

res = subprocess.run(cmd, capture_output=True, text=True)
print(f"Browser return code: {res.returncode}")
if os.path.exists(PDF_PATH):
    print(f"SUCCESS: PDF created at {PDF_PATH} ({os.path.getsize(PDF_PATH)} bytes)")
else:
    print(f"ERROR: PDF was not created. Stderr: {res.stderr}")
