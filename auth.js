const supabaseClient = supabase.createClient(
    "https://TUSUPABASEURL.supabase.co",  // Reemplaza con tu URL de Supabase
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpaHZxeHVqY3FsYWRxeHVjdWdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyMDYwNTUsImV4cCI6MjA1ODc4MjA1NX0.p9lMEnhHfA10JSiGv9jJZHj0Zf5SCnZFtER5GYvqI5g"  // Reemplaza con tu API Key
);

// Función para iniciar sesión
async function iniciarSesion(event) {
    event.preventDefault(); // Evita que el formulario recargue la página

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        alert("Error en el inicio de sesión: " + error.message);
    } else {
        window.location.href = "dashboard.html"; // Redirige al dashboard
    }
}

// Función para verificar sesión en cada página
async function verificarSesion() {
    const { data: session } = await supabaseClient.auth.getSession();

    if (!session.session) {
        window.location.href = "index.html"; // Si no hay sesión, redirige al login
    }
}

// Función para obtener todos los datos del usuario autenticado
async function obtenerDatosUsuario() {
    const { data: user } = await supabaseClient.auth.getUser();

    if (user) {
        let { data, error } = await supabaseClient
            .from("usuarios")
            .select("*")
            .eq("correo electrónico", user.email)
            .single();

        if (data) {
            document.getElementById("userEmail").textContent = data["correo electrónico"];
            document.getElementById("userDNI").textContent = data.dni;
            document.getElementById("userBalance").textContent = data.balance;
            document.getElementById("userAnuncios").textContent = data.anuncios_clickeados;
            document.getElementById("userPeliculas").textContent = data.peliculas_vistas;
            document.getElementById("userMetodoPago").textContent = data.payment_method;
        }
    } else {
        window.location.href = "index.html";
    }
}

// Función para cerrar sesión
async function cerrarSesion() {
    await supabaseClient.auth.signOut();
    window.location.href = "index.html";
}

// Llamar a verificar sesión en cada página protegida
document.addEventListener("DOMContentLoaded", () => {
    if (document.body.classList.contains("protegido")) {
        verificarSesion();
        obtenerDatosUsuario();
    }
});
