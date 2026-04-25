document.addEventListener('DOMContentLoaded', () => {
    
    // --- CARTA (MÁQUINA DE ESCRIBIR) ---
    const typewriter = document.getElementById('typewriter');
    if (typewriter) {
        let i = 0;
        function type() {
            if (i < textoCarta.length) {
                // Respeta los saltos de línea con <br>
                if(textoCarta.charAt(i) === '\n'){
                    typewriter.innerHTML += '<br>';
                } else {
                    typewriter.innerHTML += textoCarta.charAt(i);
                }
                i++;
                setTimeout(type, 45); // Velocidad
            }
        }
        type();
    }

    // --- ROMPECABEZAS (ARRASTRAR Y SOLTAR - 9x9, 81 piezas) ---
    const banco = document.getElementById('banco-piezas');
    const tablero = document.getElementById('tablero-armar');
    
    if (banco && tablero) {
        // Asegura que la imagen de fondo esté en el tablero semi transparente
        tablero.style.backgroundImage = `linear-gradient(rgba(255,255,255,0.8), rgba(255,255,255,0.8)), url(${imageSrc})`;

        // Crear una lista de 81 IDs (0 a 80)
        let piezasIds = Array.from({length: 81}, (_, i) => i);
        // Desordenar aleatoriamente
        piezasIds.sort(() => Math.random() - 0.5); 

        // Crear las casillas (slots) en el tablero (9x9)
        for(let i=0; i<81; i++) {
            let slot = document.createElement('div');
            slot.className = 'slot';
            slot.setAttribute('data-target', i);
            let col = i % 9;
            let fila = Math.floor(i / 9);
            // Cada slot es de 50px
            slot.style.left = `${col * 50}px`;
            slot.style.top = `${fila * 50}px`;
            
            slot.ondrop = soltar;
            slot.ondragover = permitirSoltar;
            tablero.appendChild(slot);
        }

        // Crear las piezas en el banco (9x9)
        piezasIds.forEach((p) => {
            const pieza = document.createElement('div');
            pieza.className = 'pieza-arrastrable';
            pieza.setAttribute('draggable', 'true');
            pieza.setAttribute('id', `pieza-${p}`);
            pieza.setAttribute('data-id', p);
            
            pieza.style.backgroundImage = `url(${imageSrc})`;
            
            // Posicionar el fondo para cada recorte (9x9)
            // Cada incremento es de 11.1111% (100 / 9)
            const posX = (p % 9) * (100 / 9);
            const posY = Math.floor(p / 9) * (100 / 9);
            pieza.style.backgroundPosition = `${posX}% ${posY}%`;
            
            pieza.ondragstart = arrastrar;
            banco.appendChild(pieza);
        });
    }
});

// Funciones para arrastrar y soltar
function permitirSoltar(ev) {
    ev.preventDefault();
}

function arrastrar(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function soltar(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var pieza = document.getElementById(data);
    
    // Si lo suelta en un slot del tablero
    if (ev.target.className === 'slot') {
        ev.target.appendChild(pieza);
        pieza.style.position = 'absolute';
        pieza.style.left = '1px'; // Pequeño ajuste para centrar
        pieza.style.top = '1px';
    } 
    // Si lo devuelve al banco
    else if (ev.target.id === 'banco-piezas') {
        ev.target.appendChild(pieza);
        pieza.style.position = 'relative';
        pieza.style.left = '0px';
        pieza.style.top = '0px';
    }

    verificarVictoria();
}

function verificarVictoria() {
    let slots = document.querySelectorAll('.slot');
    let win = true;
    let piezasColocadas = 0;

    slots.forEach(slot => {
        let targetId = slot.getAttribute('data-target');
        let piezaAhi = slot.firstElementChild;
        
        if (piezaAhi) {
            piezasColocadas++;
            // Verifica si el ID de la pieza coincide con el target del slot
            if (piezaAhi.getAttribute('data-id') !== targetId) {
                win = false;
            }
        } else {
            win = false;
        }
    });

    // Victoria para 81 piezas
    if (win && piezasColocadas === 81) {
        document.getElementById('mensaje-puzzle').style.display = 'block';
    }
}