document.getElementById("btnPasar").disabled = true;

class Carta {
  constructor(tipo, puntos, imagen) {
    this.tipo = tipo;
    this.puntos = puntos;
    this.imagen = imagen;
  }
}

class Jugador {
  constructor(nombre, turno = false, eliminado = false, cartas = []) {
    this.nombre = nombre;
    this.turno = turno;
    this.eliminado = eliminado;
    this.cartas = cartas;
  }

  addCarta(mazo) {
    if (!this.eliminado && this.turno) {
      const carta = mazo.cartas.shift();
      this.cartas.push(carta);
      console.log(this.cartas);
      document.getElementById("imgCartaRobada").src = carta.imagen;
      actualizarEstadisticas(this);

      if (carta.tipo === "bomba") {
        this.eliminado = true;
      }

      if (this.numSaltarTurno() > 0) {
        document.getElementById("btnPasar").disabled = false;
      } else {
        document.getElementById("btnPasar").disabled = true;
      }
    } else {
      console.log("No es el turno del jugador o está eliminado");
    }
  }

  contarCartas() {
    return this.cartas.length;
  }

  calcularPuntos() {
    return this.cartas.reduce((total, carta) => total + carta.puntos, 0);
  }

  numSaltarTurno() {
    return this.cartas.filter(carta => carta.tipo === "saltarTurno").length;
  }

  numDesactivacion() {
    return this.cartas.filter(carta => carta.tipo === "desactivacion").length;
  }

  eliminarCarta(tipo) {
    const index = this.cartas.findIndex(carta => carta.tipo === tipo);
    if (index !== -1) {
      this.cartas.splice(index, 1);
    }
  }
}

class Mazo {
  constructor(cartas = []) {
    this.cartas = cartas;
  }

  init() {
    const imagenesCartas = {
      bomba: "img/bomba/bomba.png",
      desactivacion: "img/herramienta/herramienta.png",
      saltarTurno: "img/pasarTurno/pasarTurno.png",
      puntos: (valor) => `img/card/robot_${valor}.png`,
    };

    const tiposDeCartas = {
      bomba: 6,
      desactivacion: 6,
      saltarTurno: 10,
      puntos: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    };

    for (let tipo in tiposDeCartas) {
      if (Array.isArray(tiposDeCartas[tipo])) {
        tiposDeCartas[tipo].forEach(valor => {
          this.cartas.push(new Carta(tipo, valor, imagenesCartas[tipo](valor)));
        });
      } else {
        for (let i = 0; i < tiposDeCartas[tipo]; i++) {
          this.cartas.push(new Carta(tipo, 0, imagenesCartas[tipo]));
        }
      }
    }
    return this.cartas;
  }

  barajarMazo() {
    for (let i = this.cartas.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cartas[i], this.cartas[j]] = [this.cartas[j], this.cartas[i]];
    }
  }

  mostrarCartas() {
    this.cartas.forEach(carta => console.log(`Tipo: ${carta.tipo}, Puntos: ${carta.puntos}, Imagen: ${carta.imagen}`));
  }
}


let mazo = new Mazo();
mazo.init();
mazo.barajarMazo();
mazo.mostrarCartas();

let jugador1 = new Jugador("Jugador1", true);
let jugador2 = new Jugador("Jugador2");
let jugador3 = new Jugador("Jugador3");

const jugadores = [jugador1, jugador2, jugador3];

function actualizarEstadisticas(jugador) {
  const id = jugador.nombre.replace(" ", "");
  document.getElementById(`${id}NumCartas`).innerHTML = `⚪️ Número de cartas: ${jugador.contarCartas()}`;
  document.getElementById(`${id}Puntos`).innerHTML = `⚪️ Puntos totales: ${jugador.calcularPuntos()}`;
  document.getElementById(`${id}saltoTurno`).innerHTML = `⚪️ Cartas salto turno: ${jugador.numSaltarTurno()}`;
  document.getElementById(`${id}Desactivacion`).innerHTML = `⚪️ Cartas desactivación: ${jugador.numDesactivacion()}`;
}

function cambiarTurno() {
  let jugadorActualIndex = jugadores.findIndex(jugador => jugador.turno);
  jugadores[jugadorActualIndex].turno = false;
  jugadorActualIndex = (jugadorActualIndex + 1) % jugadores.length;
  while (jugadores[jugadorActualIndex].eliminado) {
    jugadorActualIndex = (jugadorActualIndex + 1) % jugadores.length;
  }
  jugadores[jugadorActualIndex].turno = true;
  console.log(`Turno de ${jugadores[jugadorActualIndex].nombre}`);
}

document.getElementById("btnRobar").addEventListener("click", function() {
  const jugadorActual = jugadores.find(jugador => jugador.turno);
  jugadorActual.addCarta(mazo);
  if (!jugadorActual.eliminado) {
    cambiarTurno();
  }
});

document.getElementById("btnPasar").addEventListener("click", function() {
  cambiarTurno();
  document.getElementById("btnPasar").disabled = true;
});





