import os
import random
from flask import Flask, render_template

app = Flask(__name__)

# --- CONFIGURACIÓN DE RUTAS SEGURAS ---
# Esto evita que el servidor explote si no encuentra las carpetas
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
FOTOS_PATH = os.path.join(BASE_DIR, 'static', 'fotos')
PUZZLE_PATH = os.path.join(BASE_DIR, 'static', 'puzzle')
CIELO_PATH = os.path.join(BASE_DIR, 'static', 'cielo')

# Crear carpetas si no existen para que Render no de error
for path in [FOTOS_PATH, PUZZLE_PATH, CIELO_PATH]:
    if not os.path.exists(path):
        os.makedirs(path)

frases_museo = [
    "Cada foto tuya me recuerda lo increíble que es tener a alguien así en mi vida.",
    "No sé qué brilla más, si la imagen o la persona que está en ella.",
    "Esa mirada tuya tiene un poder que no logro explicar.",
    "Desde que llegaste, mis días dejaron de ser normales y se volvieron especiales.",
    "Hay algo en ti que hace que todo lo demás pase a segundo plano.",
    "A veces me pregunto cómo tuve tanta suerte de coincidir contigo.",
    "Tu sonrisa tiene el talento de arreglarme el día sin decir una palabra.",
    "Mirarte es recordar por qué mi corazón eligió quedarse contigo.",
    "Eres ese pensamiento bonito que aparece sin avisar.",
    "Contigo entendí que la felicidad sí tiene nombre y apellido.",
    "Me encanta cómo tus ojos hablan incluso cuando guardas silencio.",
    "Hay paz en tu presencia, incluso a través de una foto.",
    "Desde que estás en mi vida, todo se siente más ligero y más bonito.",
    "No sé qué me gusta más, si tu forma de ser o la manera en que me haces sentir.",
    "Cada imagen tuya confirma que tomé la mejor decisión de mi vida.",
    "Tienes ese “algo” que me hace querer quedarme para siempre.",
    "Pensar en un futuro a tu lado ya no suena a sueño, suena a plan.",
    "Eres esa razón constante por la que sonrío sin darme cuenta.",
    "Hay personas que iluminan lugares; tú iluminas mi vida.",
    "Mirarte me recuerda que todo lo que siento por ti es real y cada día más fuerte."
]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/museo')
def museo():
    # Buscamos las fotos de forma segura
    try:
        fotos = [f for f in os.listdir(FOTOS_PATH) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif'))]
        fotos.sort()
    except:
        fotos = []

    galeria = []
    if not fotos:
        # Si no hay fotos, enviamos una lista vacía para que no de error
        return render_template('museo.html', galeria=[])
        
    for i in range(len(fotos)):
        frase = frases_museo[i % len(frases_museo)]
        galeria.append({'foto': fotos[i], 'frase': frase})

    return render_template('museo.html', galeria=galeria)

@app.route('/rompecabezas')
def rompecabezas():
    return render_template('rompecabezas.html')

@app.route('/carta')
def carta():
    return render_template('carta.html')

@app.route('/cielo')
def cielo():
    return render_template('cielo.html')

if __name__ == '__main__':
    app.run(debug=True)
