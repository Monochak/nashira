/* FORMA — biblioteca de iconos de amenidades.

   UNA sola fuente: la lee el sitio y, ya publicada, tambien el panel. Antes
   estaba duplicada en ownership.html y en contenido.html, identicas por
   disciplina: agregar una amenidad en un solo lado la dejaba configurable
   pero sin dibujo, encendida y muda, sin que nada avisara.

   Que es cada cosa:
     key   — identificador estable. NO se renombra: la ficha lo referencia.
     label — nombre sugerido. Cada proyecto puede llamarla como quiera.
     ic    — trazo del icono, 24x24, sin relleno (el sitio le pone el resto).

   Esto es BIBLIOTECA, no lista: un proyecto usa las que le sirven y puede
   inventar amenidades propias eligiendo cualquiera de estos iconos. Crece
   cuando ningun dibujo existente sirve, no cuando un proyecto trae un
   nombre nuevo. */
window.FORMA_AMENIDADES = [
  { key: "niveles", label: "10 Niveles Residenciales",
    ic: "<path d=\"M6 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17\"/><path d=\"M4 21h16\"/><path d=\"M6 8h12M6 12h12M6 16h12\"/>" },
  { key: "accesoInteligente", label: "Acceso Inteligente",
    ic: "<rect x=\"4\" y=\"4\" width=\"10\" height=\"16\" rx=\"2\"/><circle cx=\"7.5\" cy=\"9\" r=\".5\"/><circle cx=\"10.5\" cy=\"9\" r=\".5\"/><circle cx=\"7.5\" cy=\"12\" r=\".5\"/><circle cx=\"10.5\" cy=\"12\" r=\".5\"/><path d=\"M16.5 8a4 4 0 0 1 0 6\"/><path d=\"M18.5 6a7 7 0 0 1 0 10\"/>" },
  { key: "elevadores", label: "2 Elevadores de alta velocidad",
    ic: "<rect x=\"5\" y=\"3\" width=\"14\" height=\"18\" rx=\"1.5\"/><path d=\"M12 3v18\"/><path d=\"M7 9.5 8.5 8l1.5 1.5\"/><path d=\"M14 14.5 15.5 16l1.5-1.5\"/>" },
  { key: "lockers", label: "Delivery Lockers",
    ic: "<rect x=\"5\" y=\"3\" width=\"14\" height=\"18\" rx=\"1\"/><path d=\"M12 3v18\"/><path d=\"M5 9h14M5 15h14\"/><path d=\"M9 6.2h.8M15 6.2h.8M9 12.2h.8M15 12.2h.8M9 18.2h.8M15 18.2h.8\"/>" },
  { key: "vigilancia", label: "Vigilancia 24 horas",
    ic: "<path d=\"M4 12a8 6 0 0 1 16 0z\"/><circle cx=\"12\" cy=\"9.5\" r=\"1.6\"/><path d=\"M12 6V3\"/>" },
  { key: "cargadores", label: "Cargadores para Vehículos Eléctricos",
    ic: "<path d=\"M3 14l1-3a2 2 0 0 1 1.9-1.3h5.2A2 2 0 0 1 13 11l1 3\"/><path d=\"M2 14h13v3a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H5v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-3z\"/><path d=\"M19 8l-2.5 3.5H19L16.5 15\"/>" },
  { key: "reciclaje", label: "Punto de Reciclaje",
    ic: "<path d=\"M6 9a6.5 6.5 0 0 1 10.5-1.8\"/><path d=\"M18 12.5a6.5 6.5 0 0 1-10.5 1.8\"/><path d=\"M16.5 4v3.5H13\"/><path d=\"M7.5 17.5V14H11\"/>" },
  { key: "petShower", label: "Pet Shower",
    ic: "<path d=\"M6 3v2\"/><path d=\"M3.5 8a2.5 2.5 0 0 1 5 0z\"/><path d=\"M4.5 11l-.5 1.5M6 11l-.5 1.5M7.5 11l-.5 1.5\"/><circle cx=\"14\" cy=\"14\" r=\"1\"/><circle cx=\"17.5\" cy=\"13.5\" r=\"1\"/><circle cx=\"20\" cy=\"15.5\" r=\"1\"/><path d=\"M17 16.5a2 2 0 0 0-1.7 3.1c.4.6 3 .6 3.4 0A2 2 0 0 0 17 16.5z\"/>" },
  { key: "toolRoom", label: "Tool Room",
    ic: "<path d=\"M14.7 6.3a3 3 0 0 0-3.9 3.9L5 16l3 3 5.8-5.8a3 3 0 0 0 3.9-3.9l-1.9 1.9-1.7-.2-.2-1.7 1.8-2z\"/><path d=\"M5.5 5 8.5 8\"/><path d=\"M4 6.5 5.5 5 7 6.5 5.5 8z\"/>" },
  { key: "jardin", label: "Jardín & Patio Interior",
    ic: "<path d=\"M12 4a4 4 0 0 0-2 7.5V14h4v-2.5A4 4 0 0 0 12 4z\"/><path d=\"M10 14h4\"/><path d=\"M4 19c1.3-1 2.7-1 4 0s2.7 1 4 0 2.7-1 4 0\"/><path d=\"M4 21.5c1.3-1 2.7-1 4 0s2.7 1 4 0 2.7-1 4 0\"/>" },
  { key: "gym", label: "Open Gym al Aire Libre",
    ic: "<path d=\"M6.5 8v8M4 10v4M17.5 8v8M20 10v4M6.5 12h11\"/>" },
  { key: "coworking", label: "Área de Coworking",
    ic: "<path d=\"M6 6h12v8H6z\"/><path d=\"M4 17.5l1.3-3.5h13.4l1.3 3.5a1 1 0 0 1-1 1.3H5a1 1 0 0 1-1-1.3z\"/>" },
  { key: "firepit", label: "Firepit & Área de Asadores",
    ic: "<path d=\"M12 4c.4 2.3 2.8 3.2 2.8 6a2.8 2.8 0 0 1-5.6 0c0-1.2.6-1.9 1.2-2.8.5.9.8 1.1.8 2.1\"/><path d=\"M5 18h14M7 20.5h10\"/>" },
  { key: "rooftop", label: "Terraza Rooftop",
    ic: "<path d=\"M12 3v2\"/><path d=\"M4 9a8 4.5 0 0 1 16 0z\"/><path d=\"M12 9v8\"/><path d=\"M8 20l1-3M16 20l-1-3\"/><path d=\"M8.5 17h7\"/>" },
  { key: "edge", label: "Certificación Edge",
    ic: "<circle cx=\"12\" cy=\"9\" r=\"5.5\"/><path d=\"M9.5 13.5 8 21l4-2 4 2-1.5-7.5\"/><path d=\"M12 6.5c-1.6 0-2.6 1.1-2.6 2.6 1.6 0 2.6-1.1 2.6-2.6z\"/><path d=\"M12 6.5c1.6 0 2.6 1.1 2.6 2.6-1.6 0-2.6-1.1-2.6-2.6z\"/>" },
];
