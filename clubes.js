// clubes.js - Sistema de gestión de participantes de liga

const participantes = [
    {
        id: 1,
        nombre: "Royyer10",
        fecha: "26/8/25, 10:03 a.m.",
        codigoId: "ASPY-657-186-795",
        equipo: "INTER"
    },
    {
        id: 2,
        nombre: "Benny Caballero",
        fecha: "26/8/25, 10:06 a.m.",
        codigoId: "ASEZ-914-896-743",
        equipo: "FC BARCELONA"
    },
    {
        id: 3,
        nombre: "LW🐉",
        fecha: "26/8/25, 10:07 a.m.",
        codigoId: "ASEU-139-602-218",
        equipo: "AC Milan"
    },
    {
        id: 4,
        nombre: "the Andres",
        fecha: "26/8/25, 10:10 a.m.",
        codigoId: "ASHQ-333-407-942",
        equipo: "Real Madrid"
    },
    {
        id: 5,
        nombre: "alexander",
        fecha: "26/8/25, 10:11 a.m.",
        codigoId: "ASDN-155-364-071",
        equipo: "Santos"
    },
    {
        id: 6,
        nombre: "399633",
        fecha: "26/8/25, 10:35 a.m.",
        codigoId: "ASGF-043-824-550",
        equipo: "Newcastle"
    },
    {
        id: 7,
        nombre: "ElianVz17",
        fecha: "26/8/25, 1:12 p.m.",
        codigoId: "ASEM-094-104-042",
        equipo: "VENEZUELA"
    },
    {
        id: 8,
        nombre: "JLesme",
        fecha: "26/8/25, 4:41 p.m.",
        codigoId: "ASAA-788-835-082",
        equipo: "el que este disponible"
    },
    {
        id: 9,
        nombre: "Ever Gutierrez",
        fecha: "26/8/25, 10:25 p.m.",
        codigoId: "ASSA-735-372-006",
        equipo: "SC Corinthians"
    },
    {
        id: 10,
        nombre: "Santislowly",
        fecha: "26/8/25, 10:30 p.m.",
        codigoId: "ASGK-071-828-622",
        equipo: "Club américa"
    },
    {
        id: 11,
        nombre: "Máx",
        fecha: "26/8/25, 11:37 p.m.",
        codigoId: "ASKP-253-341-959",
        equipo: "Botafogo"
    },
    {
        id: 12,
        nombre: "brnc_14",
        fecha: "ayer a las 7:53 p.m.",
        codigoId: "ASEZ-609-571-075",
        nombreCompleto: "Brn_14",
        equipo: "Arsenal"
    },
    {
        id: 13,
        nombre: "Alexander",
        fecha: "ayer a las 11:34 p.m.",
        codigoId: "ASQL-020-982-058",
        nombreCompleto: "Bangbrousnetwork",
        equipo: "Ajax"
    },
    {
        id: 14,
        nombre: "Angel3.1416",
        fecha: "ayer a las 11:58 p.m.",
        codigoId: "ASAA-031-059-500",
        equipo: "Club America"
    },
    {
        id: 15,
        nombre: "Bennett_DD",
        fecha: "ayer a las 11:58 p.m.",
        codigoId: "ASAA-064-323-667",
        nombreCompleto: "DorianBU",
        equipo: "FC Barcelona"
    }
];

// Funciones para gestionar los participantes
const Clubes = {
    // Obtener todos los participantes
    getTodos: function() {
        return participantes;
    },

    // Obtener participante por ID
    getPorId: function(id) {
        return participantes.find(p => p.id === id);
    },

    // Obtener participante por código ID
    getPorCodigoId: function(codigoId) {
        return participantes.find(p => p.codigoId === codigoId);
    },

    // Obtener participantes por equipo
    getPorEquipo: function(equipo) {
        return participantes.filter(p => 
            p.equipo.toLowerCase().includes(equipo.toLowerCase())
        );
    },

    // Buscar participante por nombre
    buscarPorNombre: function(nombre) {
        return participantes.filter(p => 
            p.nombre.toLowerCase().includes(nombre.toLowerCase()) ||
            (p.nombreCompleto && p.nombreCompleto.toLowerCase().includes(nombre.toLowerCase()))
        );
    },

    // Obtener lista de equipos únicos
    getEquipos: function() {
        const equipos = participantes.map(p => p.equipo);
        return [...new Set(equipos)].sort();
    },

    // Contar participantes por equipo
    contarPorEquipo: function() {
        const conteo = {};
        participantes.forEach(p => {
            conteo[p.equipo] = (conteo[p.equipo] || 0) + 1;
        });
        return conteo;
    },

    // Obtener participantes ordenados por fecha
    getPorFecha: function(orden = 'asc') {
        return [...participantes].sort((a, b) => {
            // Convertir fechas a formato comparable (solo para ordenamiento básico)
            const fechaA = a.fecha.includes('ayer') ? new Date() : new Date(a.fecha);
            const fechaB = b.fecha.includes('ayer') ? new Date() : new Date(b.fecha);
            
            if (orden === 'desc') {
                return fechaB - fechaA;
            }
            return fechaA - fechaB;
        });
    },

    // Validar si existe un participante
    existe: function(codigoId) {
        return participantes.some(p => p.codigoId === codigoId);
    },

    // Obtener estadísticas generales
    getEstadisticas: function() {
        return {
            totalParticipantes: participantes.length,
            equiposUnicos: this.getEquipos().length,
            conteoPorEquipo: this.contarPorEquipo(),
            ultimoRegistro: participantes[participantes.length - 1]
        };
    }
};

// Exportar para uso en navegador (global) o módulos
if (typeof window !== 'undefined') {
    window.Clubes = Clubes;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Clubes;
}
