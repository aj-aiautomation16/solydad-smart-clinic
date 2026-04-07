// Config
const N8N_WEBHOOK_URL = 'https://n8n-aiautoscheduling.onrender.com/webhook/7748ae0d-6bc1-4330-97a5-a6d13e64291f';

// Generate a stable session ID for this browser session
const SESSION_ID = 'web_' + Math.random().toString(36).slice(2) + '_' + Date.now();

// Global States
let currentView = 'home';

// UI Toggles
function toggleChat() {
    const chatWindow = document.getElementById('chatWindow');
    const isVisible = chatWindow.style.display === 'flex';
    chatWindow.style.display = isVisible ? 'none' : 'flex';

    if (!isVisible) {
        scrollToBottom();
    }
}

function toggleDashboard() {
    const homeView = document.getElementById('home-view');
    const dashView = document.getElementById('dashboard-view');

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
    return msgDiv;
}

function showTypingIndicator() {
    const chatBody = document.getElementById('chatBody');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message msg-ai';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerText = '...';
    typingDiv.style.opacity = '0.5';
    chatBody.appendChild(typingDiv);
    scrollToBottom();
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
}

function setInputDisabled(disabled) {
    const input = document.getElementById('chatInput');
    const sendBtn = document.querySelector('.chat-send');
    if (input) input.disabled = disabled;
    if (sendBtn) sendBtn.disabled = disabled;
}

async function sendMessage() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, false);
    input.value = '';
    setInputDisabled(true);
    showTypingIndicator();

    try {
        const response = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                source: 'website',
                message: text,
                session_id: SESSION_ID
            })
        });

        removeTypingIndicator();

        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.status);
        }

        const data = await response.json();
        const aiReply = data.output || data.text || 'Pasensya na po, may naganap na error. Subukan ulit.';
        addMessage(aiReply, true);

    } catch (err) {
        removeTypingIndicator();
        addMessage('Pasensya na po, hindi ko ma-reach ang server ngayon. Subukan ulit pagkatapos ng ilang sandali.', true);
        console.error('Chat error:', err);
    } finally {
        setInputDisabled(false);
        document.getElementById('chatInput').focus();
    }
}

// Initial Animations
window.addEventListener('DOMContentLoaded', () => {
    const animates = document.querySelectorAll('.animate');
    animates.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
    });
});
