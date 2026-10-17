let audioIniciado = false;

function activarInvitacion() {
    const contenedor = document.getElementById("contenedor-principal");
    const video = document.getElementById("videoSobre");
    const btnAbrir = document.getElementById("btn-toca-abrir");
    const musica = document.getElementById("musicaInvitacion");
    const seccionFinal = document.getElementById("seccion-final");
    const musicBtn = document.getElementById("music-toggle");

    if (!audioIniciado) {
        audioIniciado = true;
        
        // Reproduce el video del sobre justo al tocar la pantalla
        video.play().catch(e => console.log("Video play error:", e));
        
        // Reproduce la música de fondo
        musica.play().then(() => {
            musicBtn.style.display = "flex";
        }).catch(err => {
            console.log("Audio bloqueado por navegador:", err);
        });

        if (btnAbrir) btnAbrir.style.opacity = "0";

        // Da tiempo a que se vea el sobre abriéndose y luego muestra la invitación
        setTimeout(() => {
            contenedor.style.opacity = "0";
            setTimeout(() => {
                contenedor.style.display = "none";
                seccionFinal.classList.remove("oculto");
                iniciarEfectos();
            }, 400);
        }, 1200); // 1.2 segundos para el show del sobre
    }
}

function toggleMusic() {
    const musica = document.getElementById("musicaInvitacion");
    const musicBtn = document.getElementById("music-toggle");
    if (musica.paused) {
        musica.play();
        musicBtn.innerHTML = '<i class="fa-solid fa-music"></i>';
    } else {
        musica.pause();
        musicBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
    }
}

function copiarDatosBanco() {
    const datos = "Entidad: TU FINANCIERA\nNro. de cuenta: 2039725301\nBeneficiario: Yildiz Ahylen Ramirez Rotela\nCédula: 6094129";
    navigator.clipboard.writeText(datos).then(() => {
        const toast = document.getElementById("toast");
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 3000);
    });
}

let circulosRevelados = 0;
function revelarCirculo(card) {
    if (card.classList.contains("revelado")) return;
    card.classList.add("revelado");
    
    const tapText = card.querySelector(".tap-text");
    const hiddenContent = card.querySelector(".circle-hidden-content");
    
    if (tapText) tapText.style.display = "none";
    if (hiddenContent) {
        hiddenContent.style.display = "flex";
        hiddenContent.style.animation = "fadeInScale 0.4s ease forwards";
    }

    card.style.background = "#5c5b3b";
    card.style.transform = "scale(1.08)";
    setTimeout(() => { card.style.transform = "scale(1)"; }, 300);

    circulosRevelados++;
    if (circulosRevelados === 3) {
        const countdownCard = document.getElementById("countdownCard");
        if (countdownCard) {
            countdownCard.classList.add("revealed-done");
        }
    }
}

function enviarDeseoGoogleSheets(e) {
    e.preventDefault();
    const nombre = document.getElementById("nombreInvitado").value;
    const mensaje = document.getElementById("mensajeInvitado").value;
    const btn = document.getElementById("btnEnviarDeseo");

    btn.innerText = "ENVIANDO...";
    btn.disabled = true;

    const urlScript = "https://script.google.com/macros/s/AKfycby6TGtWr0lvIFNUwSeWIMVFovjXSWqHJcdu6le8UJVMWAq89hO5d2KMvzekcyPqdSes/exec";

    const datos = {
        nombre: nombre,
        mensaje: mensaje
    };

    fetch(urlScript, {
        method: "POST",
        mode: "no-cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    })
    .then(() => {
        const toast = document.getElementById("toast");
        toast.innerText = "¡Deseo enviado con éxito! 💖";
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 3000);

        document.getElementById("wishesForm").reset();
        btn.innerText = "ENVIAR DESEO";
        btn.disabled = false;
    })
    .catch((error) => {
        console.error("Error:", error);
        alert("Hubo un error al enviar el deseo. Inténtalo de nuevo.");
        btn.innerText = "ENVIAR DESEO";
        btn.disabled = false;
    });
}

function iniciarEfectos() {
    // Scroll reveal observer
    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            }
        });
    }, { threshold: 0.1 });

    reveals.forEach(rev => observer.observe(rev));

    // Contador regresivo hacia el 13 de diciembre de 2026 (13/12/2026)
    const weddingDate = new Date("2026-12-13T19:00:00").getTime();
    setInterval(() => {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const secs = Math.floor((distance % (1000 * 60)) / 1000);

            const dEl = document.getElementById("cd-days");
            const hEl = document.getElementById("cd-hours");
            const mEl = document.getElementById("cd-mins");
            const sEl = document.getElementById("cd-secs");

            if (dEl) dEl.innerText = String(days).padStart(2, '0');
            if (hEl) hEl.innerText = String(hours).padStart(2, '0');
            if (mEl) mEl.innerText = String(mins).padStart(2, '0');
            if (sEl) sEl.innerText = String(secs).padStart(2, '0');
        }
    }, 1000);
}