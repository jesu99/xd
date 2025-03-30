const supabaseClient = supabase.createClient(
    "https://tihvqxujcqladqxucugf.supabase.co",  // Reemplaza con tu URL de Supabase
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpaHZxeHVqY3FsYWRxeHVjdWdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyMDYwNTUsImV4cCI6MjA1ODc4MjA1NX0.p9lMEnhHfA10JSiGv9jJZHj0Zf5SCnZFtER5GYvqI5g"  // Reemplaza con tu API Key
);

// Función para iniciar sesión
async function iniciarSesion(event) {
    event.preventDefault(); // Evita que el formulario recargue la página
    
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    
    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password
        });
        
        if (error) {
            console.error("Error de autenticación:", error);
            alert("Error en el inicio de sesión: " + error.message);
        } else {
            console.log("Inicio de sesión exitoso");
            window.location.href = "dashboard.html"; // Redirige al dashboard
        }
    } catch (e) {
        console.error("Excepción durante el inicio de sesión:", e);
        alert("Error inesperado: " + e.message);
    }
}

// Función para verificar sesión en cada página
async function verificarSesion() {
    try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        
        if (!session) {
            console.log("No hay sesión activa, redirigiendo al login");
            window.location.href = "index.html"; // Si no hay sesión, redirige al login
        } else {
            console.log("Sesión verificada correctamente");
        }
    } catch (e) {
        console.error("Error al verificar sesión:", e);
        window.location.href = "index.html";
    }
}

// Función para obtener todos los datos del usuario autenticado
async function obtenerDatosUsuario() {
    try {
        const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
        
        if (userError) {
            console.error("Error al obtener usuario:", userError);
            window.location.href = "index.html";
            return;
        }
        
        if (user) {
            console.log("Usuario autenticado:", user.email);
            
            // Obtener datos del usuario desde la tabla usuarios
            const { data, error } = await supabaseClient
                .from("usuarios")
                .select("*")
                .eq("email", user.email)
                .single();
            
            if (error) {
                console.error("Error al obtener datos del usuario:", error);
                alert("Error al cargar los datos del usuario");
                return;
            }
            
            if (data) {
                // Actualizar la interfaz con los datos del usuario
                document.getElementById("userEmail").textContent = data["correo electrónico"];
                document.getElementById("userDNI").textContent = data.dni;
                document.getElementById("userBalance").textContent = data.balance;
                document.getElementById("userAnuncios").textContent = data.anuncios_clickeados;
                document.getElementById("userPeliculas").textContent = data.peliculas_vistas;
                document.getElementById("userMetodoPago").textContent = data.payment_method;
                
                console.log("Datos de usuario cargados correctamente");
            } else {
                console.error("No se encontraron datos para el usuario en la base de datos");
                alert("No se encontraron tus datos de usuario");
            }
        } else {
            console.log("No hay usuario autenticado");
            window.location.href = "index.html";
        }
    } catch (e) {
        console.error("Error inesperado:", e);
        alert("Error al cargar los datos: " + e.message);
    }
}

// Función para cerrar sesión
async function cerrarSesion() {
    try {
        const { error } = await supabaseClient.auth.signOut();
        
        if (error) {
            console.error("Error al cerrar sesión:", error);
            alert("Error al cerrar sesión: " + error.message);
        } else {
            console.log("Sesión cerrada correctamente");
            window.location.href = "index.html";
        }
    } catch (e) {
        console.error("Excepción al cerrar sesión:", e);
        alert("Error inesperado: " + e.message);
    }
}

// Llamar a verificar sesión en cada página protegida
document.addEventListener("DOMContentLoaded", () => {
    if (document.body.classList.contains("protegido")) {
        console.log("Página protegida detectada");
        verificarSesion();
        obtenerDatosUsuario();
    } else {
        console.log("Página pública");
    }
    
    // Agregar event listener al formulario de login si existe
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", iniciarSesion);
    }
    
    // Agregar event listener al botón de logout si existe
    const logoutButton = document.getElementById("logoutBtn");
    if (logoutButton) {
        logoutButton.addEventListener("click", cerrarSesion);
    }
});
