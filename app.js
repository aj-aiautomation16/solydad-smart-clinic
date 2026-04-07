// Global States
let currentView = 'home';
let chatState = 'greeting';
const patientData = {
    name: '',
    email: '',
    service: '',
    time: ''
};

// UI Toggles
function toggleChat() {
    const chatWindow = document.getElementById('chatWindow');
    const isVisible = chatWindow.style.display === 'flex';
    chatWindow.style.display = isVisible ? 'none' : 'flex';
    
    if (!isVisible && chatState === 'greeting') {
        scrollToBottom();
    }
}

function toggleDashboard() {
    const homeView = document.getElementById('home-view');
    const dashView = document.getElementById('dashboard-view');
    const navLinks = document.querySelector('.nav-links');
    
    if (currentView === 'home') {
        homeView.style.display = 'none';
        dashView.style.display = 'block';
        currentView = 'dash';
    } else {
        homeView.style.display = 'block';
        dashView.style.display = 'none';
        currentView = 'home';
    }
}

// Chat Logic
function handleChatEnter(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function scrollToBottom() {
    const chatBody = document.getElementById('chatBody');
    chatBody.scrollTop = chatBody.scrollHeight;
}

function addMessage(text, isAi = false) {
    const chatBody = document.getElementById('chatBody');
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${isAi ? 'msg-ai' : 'msg-user'}`;
    msgDiv.innerText = text;
    chatBody.appendChild(msgDiv);
    scrollToBottom();
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    
    if (!text) return;
    
    addMessage(text, false);
    input.value = '';
    
    // Simulate AI Thinking
    setTimeout(() => {
        processAiResponse(text);
    }, 800);
}

function processAiResponse(userInput) {
    let response = "";
    
    switch (chatState) {
        case 'greeting':
            response = "Ano po ang pangalan nila? Para po mailista ko sa ating record.";
            chatState = 'waitingForName';
            break;
            
        case 'waitingForName':
            patientData.name = userInput;
            response = `Salamat, ${patientData.name}! Ano po ang email address ninyo? Ito po ay para sa inyong appointment receipt.`;
            chatState = 'waitingForEmail';
            break;
            
        case 'waitingForEmail':
            patientData.email = userInput;
            response = `Got it! Anong serbisyo po ang kailangan niyo? (General Medicine, Pediatrics, OB-GYN, or Laboratory)`;
            chatState = 'waitingForService';
            break;
            
        case 'waitingForService':
            patientData.service = userInput;
            response = "Sige po. Kailan po ninyo balak pumunta? Pwede po kaming mag-set ng slot para sa inyo bukas ng 9:00 AM. Okay po ba sa inyo?";
            chatState = 'waitingForTime';
            break;
            
        case 'waitingForTime':
            if (userInput.toLowerCase().includes('oo') || userInput.toLowerCase().includes('ok') || userInput.toLowerCase().includes('yes')) {
                patientData.time = "Tomorrow, 09:00 AM";
                response = "Noted po! Naka-schedule na po kayo. Makakatanggap po kayo ng confirmation email maya-maya. May iba pa po ba akong maitutulong?";
                chatState = 'confirmed';
                addAppointmentToDashboard(patientData);
            } else {
                response = "Ah, sige po. Ano po ang preferred time ninyo?";
            }
            break;
            
        case 'confirmed':
            response = "Maraming salamat po! Ingat po sa biyahe papunta dito sa Sol. Y. Dad Medical Clinic.";
            chatState = 'end';
            break;
            
        default:
            response = "Mag-message lang po uli kayo kung may kailangan pa po kayo.";
    }
    
    addMessage(response, true);
}

function addAppointmentToDashboard(data) {
    const tableBody = document.getElementById('appointment-table');
    const newRow = document.createElement('tr');
    
    newRow.innerHTML = `
        <td>${data.name}</td>
        <td style="font-size: 0.8rem; color: var(--text-muted);">${data.email}</td>
        <td>${data.service}</td>
        <td>${data.time}</td>
        <td><span class="status status-pending">New Request</span></td>
    `;
    
    // Add animation to new row
    newRow.style.background = "#fffbeb";
    tableBody.prepend(newRow);
}

// Initial Animations
window.addEventListener('DOMContentLoaded', () => {
    const animates = document.querySelectorAll('.animate');
    animates.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
    });
});
