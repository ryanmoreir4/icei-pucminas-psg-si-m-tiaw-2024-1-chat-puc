document.getElementById("profile-image").addEventListener("click", function() {
    var dropdownMenu = document.getElementById("dropdown-menu");
    if (dropdownMenu.style.display === "none" || dropdownMenu.style.display === "") {
        dropdownMenu.style.display = "flex";
    } else {
        dropdownMenu.style.display = "none";
    }
});

window.onclick = function(event) {
    var modal = document.getElementById("myModal");
    var dropdownMenu = document.getElementById("dropdown-menu");
    var settingsMenu = document.getElementById("settings-menu");
    if (event.target == modal) {
        modal.style.display = "none";
    } else if (!event.target.matches('.profile-image') && !event.target.matches('.dropdown-item')) {
        dropdownMenu.style.display = "none";
    } else if (event.target == settingsMenu) {
        settingsMenu.style.display = "none";
    }
}

document.querySelector(".close").addEventListener("click", function() {
    document.getElementById("myModal").style.display = "none";
});

document.querySelector(".btn-confirmar").addEventListener("click", function() {
    window.location.href = "cadastro.html";
    document.getElementById("myModal").style.display = "none";
});

document.getElementById("open-modal-btn-support").addEventListener("click", function() {
    document.getElementById("myModal").style.display = "block";
    document.getElementById("settings-menu").style.display = "none";
});

document.getElementById("settings-btn").addEventListener("click", function() {
    document.getElementById("settings-menu").style.display = "block";
    document.getElementById("dropdown-menu").style.display = "none";
});

document.querySelector(".close-settings").addEventListener("click", function() {
    document.getElementById("settings-menu").style.display = "none";
});

document.getElementById("logout-devices-btn").addEventListener("click", function() {
    window.location.href = "cadastro.html"; 
});