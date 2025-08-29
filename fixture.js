// fixture.js - Generador de fixture de liga todos contra todos (ida y vuelta)

// Clase para generar el fixture
class FixtureGenerator {
    constructor() {
        this.equipos = [];
        this.fixture = [];
        this.tieneNumeroImpar = false;
    }

    // Cargar equipos desde clubes.js
    cargarEquipos() {
        if (typeof Clubes === 'undefined') {
            throw new Error('El archivo clubes.js debe estar cargado antes que fixture.js');
        }

        const participantes = Clubes.getTodos();
        this.equipos = participantes.map(p => ({
            id: p.id,
            nombre: p.nombre,
            equipo: p.equipo,
            codigoId: p.codigoId
        }));

        // Si hay número impar de equipos, agregar "Descansa"
        if (this.equipos.length % 2 !== 0) {
            this.tieneNumeroImpar = true;
            this.equipos.push({
                id: 999,
                nombre: "Descansa",
                equipo: "Descansa",
                codigoId: "DESC-000-000-000"
            });
        }

        return this.equipos.length;
    }

    // Algoritmo Round Robin para generar emparejamientos
    generarRoundRobin() {
        const numEquipos = this.equipos.length;
        const numFechas = numEquipos - 1;
        const partidosPorFecha = numEquipos / 2;
        const primeraRueda = [];

        // Crear matriz de equipos para rotación
        const equiposRotacion = [...this.equipos];
        const equipoFijo = equiposRotacion.shift(); // El primer equipo se mantiene fijo

        for (let fecha = 0; fecha < numFechas; fecha++) {
            const partidosFecha = [];
            
            // El equipo fijo siempre juega contra el primero de la lista rotativa
            const rival = equiposRotacion[0];
            
            // Alternar local/visitante para el equipo fijo
            if (fecha % 2 === 0) {
                partidosFecha.push({
                    local: equipoFijo,
                    visitante: rival
                });
            } else {
                partidosFecha.push({
                    local: rival,
                    visitante: equipoFijo
                });
            }

            // Emparejar el resto de equipos
            for (let i = 1; i < partidosPorFecha; i++) {
                const equipo1 = equiposRotacion[i];
                const equipo2 = equiposRotacion[equiposRotacion.length - i];
                
                // Alternar local/visitante basado en la fecha y posición
                if ((fecha + i) % 2 === 0) {
                    partidosFecha.push({
                        local: equipo1,
                        visitante: equipo2
                    });
                } else {
                    partidosFecha.push({
                        local: equipo2,
                        visitante: equipo1
                    });
                }
            }

            primeraRueda.push({
                numero: fecha + 1,
                tipo: 'Primera Rueda',
                partidos: partidosFecha.filter(p => 
                    p.local.nombre !== "Descansa" && p.visitante.nombre !== "Descansa"
                ),
                descansa: partidosFecha.find(p => 
                    p.local.nombre === "Descansa" || p.visitante.nombre === "Descansa"
                )?.local.nombre === "Descansa" ? 
                    partidosFecha.find(p => p.local.nombre === "Descansa" || p.visitante.nombre === "Descansa")?.visitante :
                    partidosFecha.find(p => p.local.nombre === "Descansa" || p.visitante.nombre === "Descansa")?.local
            });

            // Rotar equipos (excepto el fijo)
            const ultimo = equiposRotacion.pop();
            equiposRotacion.unshift(ultimo);
        }

        return primeraRueda;
    }

    // Generar segunda rueda (ida y vuelta)
    generarSegundaRueda(primeraRueda) {
        const segundaRueda = [];
        
        primeraRueda.forEach((fecha, index) => {
            const partidosInvertidos = fecha.partidos.map(partido => ({
                local: partido.visitante,
                visitante: partido.local
            }));

            segundaRueda.push({
                numero: fecha.numero + primeraRueda.length,
                tipo: 'Segunda Rueda',
                partidos: partidosInvertidos,
                descansa: fecha.descansa
            });
        });

        return segundaRueda;
    }

    // Generar fixture completo
    generarFixture() {
        try {
            const numEquipos = this.cargarEquipos();
            console.log(`Generando fixture para ${numEquipos} equipos...`);

            const primeraRueda = this.generarRoundRobin();
            const segundaRueda = this.generarSegundaRueda(primeraRueda);

            this.fixture = [...primeraRueda, ...segundaRueda];
            
            return {
                success: true,
                fixture: this.fixture,
                estadisticas: this.getEstadisticas()
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                fixture: [],
                estadisticas: null
            };
        }
    }

    // Obtener estadísticas del fixture
    getEstadisticas() {
        const numEquiposReales = this.tieneNumeroImpar ? this.equipos.length - 1 : this.equipos.length;
        const partidosPorRueda = (numEquiposReales * (numEquiposReales - 1)) / 2;
        
        return {
            equipos: numEquiposReales,
            tieneDescansa: this.tieneNumeroImpar,
            fechasPorRueda: numEquiposReales % 2 === 0 ? numEquiposReales - 1 : numEquiposReales,
            totalFechas: this.fixture.length,
            partidosPorRueda: partidosPorRueda,
            totalPartidos: partidosPorRueda * 2,
            ruedas: 2
        };
    }

    // Obtener fixture formateado para mostrar
    getFixtureFormateado() {
        if (this.fixture.length === 0) {
            return "No hay fixture generado. Ejecuta generarFixture() primero.";
        }

        let output = "🏆 FIXTURE DE LIGA - TODOS CONTRA TODOS (IDA Y VUELTA)\n";
        output += "=".repeat(60) + "\n\n";

        this.fixture.forEach(fecha => {
            output += `📅 FECHA ${fecha.numero} - ${fecha.tipo}\n`;
            output += "-".repeat(40) + "\n";

            if (fecha.partidos.length === 0) {
                output += "No hay partidos programados\n";
            } else {
                fecha.partidos.forEach(partido => {
                    output += `🏠 ${partido.local.equipo} vs ${partido.visitante.equipo} 🛫\n`;
                    output += `   (${partido.local.nombre} vs ${partido.visitante.nombre})\n`;
                });
            }

            if (fecha.descansa && this.tieneNumeroImpar) {
                output += `😴 DESCANSA: ${fecha.descansa.equipo} (${fecha.descansa.nombre})\n`;
            }

            output += "\n";
        });

        // Agregar estadísticas
        const stats = this.getEstadisticas();
        output += "📊 ESTADÍSTICAS DEL TORNEO\n";
        output += "=".repeat(30) + "\n";
        output += `• Equipos participantes: ${stats.equipos}\n`;
        output += `• Total de fechas: ${stats.totalFechas}\n`;
        output += `• Fechas por rueda: ${stats.fechasPorRueda}\n`;
        output += `• Total de partidos: ${stats.totalPartidos}\n`;
        output += `• ¿Hay equipo que descansa?: ${stats.tieneDescansa ? 'Sí' : 'No'}\n`;

        return output;
    }

    // Obtener partidos de una fecha específica
    getPartidosPorFecha(numeroFecha) {
        return this.fixture.find(fecha => fecha.numero === numeroFecha);
    }

    // Obtener partidos de un equipo específico
    getPartidosPorEquipo(equipoId) {
        const partidos = [];
        
        this.fixture.forEach(fecha => {
            fecha.partidos.forEach(partido => {
                if (partido.local.id === equipoId || partido.visitante.id === equipoId) {
                    partidos.push({
                        fecha: fecha.numero,
                        rueda: fecha.tipo,
                        esLocal: partido.local.id === equipoId,
                        rival: partido.local.id === equipoId ? partido.visitante : partido.local,
                        partido: partido
                    });
                }
            });
        });

        return partidos;
    }
}

// Crear instancia global del generador
const FixtureGen = new FixtureGenerator();

// Funciones de utilidad globales
const Fixture = {
    // Generar fixture completo
    generar: function() {
        return FixtureGen.generarFixture();
    },

    // Obtener fixture formateado
    mostrar: function() {
        return FixtureGen.getFixtureFormateado();
    },

    // Imprimir fixture en consola
    imprimir: function() {
        console.log(FixtureGen.getFixtureFormateado());
    },

    // Obtener fixture como array de objetos
    getFixture: function() {
        return FixtureGen.fixture;
    },

    // Obtener estadísticas
    getEstadisticas: function() {
        return FixtureGen.getEstadisticas();
    },

    // Obtener partidos por fecha
    getPorFecha: function(numeroFecha) {
        return FixtureGen.getPartidosPorFecha(numeroFecha);
    },

    // Obtener partidos por equipo
    getPorEquipo: function(equipoId) {
        return FixtureGen.getPartidosPorEquipo(equipoId);
    }
};

// Exportar para uso en navegador (global) o módulos
if (typeof window !== 'undefined') {
    window.Fixture = Fixture;
    window.FixtureGenerator = FixtureGenerator;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Fixture, FixtureGenerator };
}
