"""
Simple Capture Styles - Python Script
Captura estilos usando Selenium WebDriver
"""

import json
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

URL = "http://localhost:8080"
OUTPUT_FILE = "scripts/captured-styles.json"

print("=" * 50)
print("AUTO CAPTURA DE ESTILOS (Python + Selenium)")
print("=" * 50)
print()

# Configurar Chrome headless
chrome_options = Options()
chrome_options.add_argument("--headless")
chrome_options.add_argument("--disable-gpu")
chrome_options.add_argument("--no-sandbox")

print(f"Acessando {URL}...")
driver = webdriver.Chrome(options=chrome_options)

try:
    driver.get(URL)
    
    # Aguardar carregamento
    print("Aguardando carregamento...")
    time.sleep(3)
    
    # Propriedades CSS relevantes
    css_properties = [
        'font-size', 'font-weight', 'font-family', 'font-style',
        'line-height', 'letter-spacing', 'text-align', 'text-transform',
        'text-decoration', 'text-indent',
        'color', 'background-color',
        'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
        'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
        'border', 'border-radius', 'border-width', 'border-color',
        'display', 'width', 'height', 'max-width', 'max-height',
        'flex-direction', 'align-items', 'justify-content',
        'gap', 'row-gap', 'column-gap',
        'grid-template-columns'
    ]
    
    captured_styles = []
    
    def capture_elements(selector, attr_name, identifier_type):
        elements = driver.find_elements(By.CSS_SELECTOR, selector)
        print(f"  {len(elements)} elementos [{identifier_type}]")
        
        for el in elements:
            identifier = el.get_attribute(attr_name)
            if not identifier:
                continue
            
            tag_name = el.tag_name.lower()
            styles = {}
            
            for prop in css_properties:
                value = el.value_of_css_property(prop)
                
                # Filtrar valores padrão
                if value and value not in ['normal', 'none', 'auto', '0px', 'rgba(0, 0, 0, 0)', 'transparent']:
                    # Converter kebab-case para camelCase
                    camel_prop = prop.replace('-', ' ').title().replace(' ', '')
                    camel_prop = camel_prop[0].lower() + camel_prop[1:]
                    styles[camel_prop] = value
            
            if styles:
                captured_styles.append({
                    'identifier': identifier,
                    'identifierType': identifier_type,
                    'tagName': tag_name,
                    'styles': styles
                })
    
    print("\nCapturando estilos:")
    capture_elements('[data-json-key]', 'data-json-key', 'json-key')
    capture_elements('[data-section-id]', 'data-section-id', 'section-id')
    capture_elements('[data-block-id]', 'data-block-id', 'block-id')
    
    # Salvar JSON
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(captured_styles, f, indent=2, ensure_ascii=False)
    
    print("\n" + "=" * 50)
    print(f"CAPTURA CONCLUIDA!")
    print("=" * 50)
    print(f"Total de elementos: {len(captured_styles)}")
    print(f"Arquivo salvo: {OUTPUT_FILE}")
    print("\nProximo passo:")
    print("  node scripts/populate-all-styles.js")
    print("=" * 50)
    
except Exception as e:
    print(f"\nERRO: {e}")
    
finally:
    driver.quit()
