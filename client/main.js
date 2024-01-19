
document.addEventListener('DOMContentLoaded', () => {
    const loginLink = document.getElementById('login-link');
    const registerLink = document.getElementById('register-link');
    const loginDropdown = document.getElementById('loginDropdown');
    const registerDropdown = document.getElementById('registerDropdown');
    const closeButtons = document.querySelectorAll('.close-btn');
    const body = document.body;
    const registerForm = document.getElementById('registerForm');

    loginLink.addEventListener('click', toggleDropdown.bind(null, loginDropdown));
    registerLink.addEventListener('click', toggleDropdown.bind(null, registerDropdown));

    closeButtons.forEach(button => {
        button.addEventListener('click', closeDropdown);
    });

    registerForm.addEventListener('submit', submitRegistrationForm);

    function submitRegistrationForm(event) {
        event.preventDefault();
        console.log('Botón de registro funciona');
    
        const email = document.querySelector('#email').value; // Reemplaza 'email' con el ID de tu campo de correo electrónico
        const password = document.querySelector('#password').value; // Reemplaza 'password' con el ID de tu campo de contraseña
    
        console.log('Email:', email);
        console.log('Contraseña:', password);
    
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
    
        fetch('http://127.0.0.1:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, password: password })
        })
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
    }
    function toggleDropdown(dropdown, event) {
        event.preventDefault();
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
        document.body.classList.toggle('background-blur');
    }

    function closeDropdown() {
        this.parentElement.style.display = 'none';
        document.body.classList.remove('background-blur');
    }
});

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = this.querySelector('[name="email"]').value;
    const password = this.querySelector('[name="password"]').value;

    fetch('http://127.0.0.1:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, password: password })
    })
    .then(response => {
        if (response.ok) {
            return response.text();
        } else {
            throw new Error('Error en el inicio de sesión');
        }
    })
    .then(data => {
        console.log(data); // Inicio de sesión exitoso
        window.location.href = 'productos.html';
        cerrarDesplegableLogin(); // Cierra el desplegable
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

function cerrarDesplegableLogin() {
    const loginDropdown = document.getElementById('loginDropdown');
    if (loginDropdown) {
        loginDropdown.style.display = 'none';
        document.body.classList.remove('background-blur');
    }
}
