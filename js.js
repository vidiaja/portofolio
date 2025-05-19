document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();
    alert('Pesan Anda telah terkirim!');
    // Anda bisa menambahkan kode untuk mengirim form ke server di sini
});

document.getElementById('toggle-mode').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    document.querySelector('header').classList.toggle('dark-mode');
    document.querySelectorAll('.profile-img').forEach(img => img.classList.toggle('dark-mode'));
    document.querySelectorAll('.social-links a').forEach(link => link.classList.toggle('dark-mode'));
    document.querySelectorAll('.project').forEach(project => project.classList.toggle('dark-mode'));
    document.querySelectorAll('form input, form textarea').forEach(input => input.classList.toggle('dark-mode'));
    document.querySelector('footer').classList.toggle('dark-mode');
});