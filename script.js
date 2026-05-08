document.addEventListener('DOMContentLoaded', () => {
    // We are converting to a travel app.
    const searchInput = document.getElementById('destinationSearch');
    const searchBtn = document.getElementById('searchBtn');
    const emptyState = document.getElementById('noResults');
    const destinationsGrid = document.getElementById('destinationsGrid');

    // --- Tab Navigation Logic ---
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = {
        '#destinations': document.getElementById('destinations'),
        '#tours': document.getElementById('tours'),
        '#hotels': document.getElementById('hotels'),
        '#food': document.getElementById('food'),
        '#universities': document.getElementById('universities'),
        '#forests': document.getElementById('forests')
    };

    let activeTabId = '#destinations';

    // Initially hide all sections except destinations
    Object.keys(sections).forEach(key => {
        if (key !== '#destinations' && sections[key]) {
            sections[key].style.display = 'none';
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            if (!sections[targetId]) return;

            activeTabId = targetId;

            // Hide all sections
            Object.values(sections).forEach(sec => {
                if (sec) sec.style.display = 'none';
            });

            // Remove active classes
            navLinks.forEach(nav => nav.classList.remove('active'));

            // Show new active section
            sections[targetId].style.display = 'block';
            link.classList.add('active');

            // Handle hero banner morphing
            const heroBanner = document.querySelector('.hero-banner');
            if (heroBanner) {
                if (targetId === '#destinations') {
                    heroBanner.classList.remove('compact');
                } else {
                    heroBanner.classList.add('compact');
                }
            }

            // Re-apply filter to update visibility in the newly opened tab
            filterDestinations();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // --- Shortcut Buttons Logic ---
    const switchTabTo = (id) => {
        if (!sections[id]) return;
        
        // Reset search input so new tabs aren't pre-filtered into empty states
        searchInput.value = '';
        
        activeTabId = id;
        Object.values(sections).forEach(sec => {
            if (sec) sec.style.display = 'none';
        });
        sections[id].style.display = 'block';
        navLinks.forEach(l => l.classList.remove('active'));
        const targetNav = Array.from(navLinks).find(l => l.getAttribute('href') === id);
        if (targetNav) targetNav.classList.add('active');
        
        // Handle hero banner morphing
        const heroBanner = document.querySelector('.hero-banner');
        if (heroBanner) {
            heroBanner.classList.toggle('compact', id !== '#destinations');
        }
        
        filterDestinations();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const forestShortcutBtn = document.getElementById('forestShortcutBtn');
    if (forestShortcutBtn) forestShortcutBtn.addEventListener('click', () => switchTabTo('#forests'));

    const uniShortcutBtn = document.getElementById('uniShortcutBtn');
    if (uniShortcutBtn) uniShortcutBtn.addEventListener('click', () => switchTabTo('#universities'));

    // Function to filter destinations based on search input
    function filterDestinations() {
        const query = searchInput.value.toLowerCase().trim();
        let targetSection = sections[activeTabId];
        if (!targetSection) return;

        let visibleCount = 0;
        const sectionCards = targetSection.querySelectorAll('.destination-card');
        const grid = targetSection.querySelector('.destinations-grid');

        sectionCards.forEach(card => {
            const locationData = card.getAttribute('data-location');
            if (locationData && locationData.includes(query)) {
                card.style.display = 'block';
                card.style.animation = 'none';
                card.offsetHeight; /* trigger reflow */
                card.style.animation = 'fadeUp 0.4s ease-out forwards';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        if (visibleCount === 0) {
            emptyState.style.display = 'block';
            if (grid) grid.style.display = 'none';
            // Move empty state into the active section for proper viewing
            targetSection.appendChild(emptyState);
        } else {
            emptyState.style.display = 'none';
            if (grid) grid.style.display = 'grid';
        }
    }

    // Trigger search on typing (live filtering)
    searchInput.addEventListener('input', filterDestinations);

    // Trigger on button click as well
    searchBtn.addEventListener('click', filterDestinations);

    // Simple interaction on Book Buttons -> Payment Modal
    const bookButtons = document.querySelectorAll('.book-btn');
    const paymentModal = document.getElementById('paymentModal');
    const closePaymentBtn = document.getElementById('closePaymentBtn');
    const paymentItemName = document.getElementById('paymentItemName');
    const paymentForm = document.getElementById('paymentForm');

    bookButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent card click
            const destinationName = e.target.closest('.destination-card').querySelector('h3').innerText;
            const priceText = e.target.closest('.destination-card').querySelector('.price strong').innerText;
            paymentItemName.innerText = `${destinationName} (${priceText})`;

            paymentModal.classList.add('active');
            paymentModal.offsetHeight; // trigger reflow
        });
    });

    const paymentModalBody = document.getElementById('paymentModalBody');
    const paymentSuccessState = document.getElementById('paymentSuccessState');
    const displayUtr = document.getElementById('displayUtr');

    function resetPaymentModal() {
        paymentModal.classList.remove('active');
        setTimeout(() => {
            paymentModalBody.style.display = 'block';
            paymentSuccessState.style.display = 'none';
            paymentForm.reset();
        }, 300);
    }

    closePaymentBtn.addEventListener('click', resetPaymentModal);

    paymentModal.addEventListener('click', (e) => {
        if (e.target === paymentModal) resetPaymentModal();
    });

    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const utr = document.getElementById('utrInput').value;
        if (utr.length === 12) {
            paymentModalBody.style.display = 'none';
            displayUtr.innerText = utr;
            paymentSuccessState.style.display = 'block';

            // Auto close after 3.5 seconds
            setTimeout(() => {
                resetPaymentModal();
            }, 3500);
        } else {
            alert("Please enter a valid 12-digit UTR number.");
        }
    });

    // --- Profile Modal Logic ---
    const profileBtn = document.getElementById('profileBtn');
    const profileModal = document.getElementById('profileModal');
    const closeProfileBtn = document.getElementById('closeProfileBtn');
    const profileForm = document.getElementById('profileForm');

    const profileModalBody = document.getElementById('profileModalBody');
    const profileSuccessState = document.getElementById('profileSuccessState');

    function resetProfileModal() {
        profileModal.classList.remove('active');
        setTimeout(() => {
            profileModalBody.style.display = 'block';
            profileSuccessState.style.display = 'none';
        }, 300);
    }

    profileBtn.addEventListener('click', () => {
        profileModal.classList.add('active');
        profileModal.offsetHeight;
    });

    closeProfileBtn.addEventListener('click', resetProfileModal);

    profileModal.addEventListener('click', (e) => {
        if (e.target === profileModal) resetProfileModal();
    });

    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        profileModalBody.style.display = 'none';
        profileSuccessState.style.display = 'block';

        setTimeout(() => {
            resetProfileModal();
        }, 3000);
    });

    // --- Map Modal Logic ---
    const openMapBtn = document.getElementById('openMapBtn');
    const mapModal = document.getElementById('mapModal');
    const closeMapBtn = document.getElementById('closeMapBtn');
    const mapSearchForm = document.getElementById('mapSearchForm');
    const mapSearchInput = document.getElementById('mapSearchInput');
    const googleMapIframe = document.getElementById('googleMapIframe');

    if (openMapBtn) {
        openMapBtn.addEventListener('click', () => {
            mapModal.classList.add('active');
            mapModal.offsetHeight;
        });
    }

    if (closeMapBtn) {
        closeMapBtn.addEventListener('click', () => {
            mapModal.classList.remove('active');
        });
    }

    if (mapModal) {
        mapModal.addEventListener('click', (e) => {
            if (e.target === mapModal) mapModal.classList.remove('active');
        });
    }

    if (mapSearchForm) {
        mapSearchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = mapSearchInput.value.trim();
            if (query) {
                googleMapIframe.src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
            }
        });
    }

    // --- Premium AI Live Chat Widget Logic ---
    const chatLauncherBtn = document.getElementById('chatLauncherBtn');
    const chatPanel = document.getElementById('chatPanel');
    const chatBadge = document.getElementById('chatBadge');

    const iconDefault = chatLauncherBtn.querySelector('.default');
    const iconActive = chatLauncherBtn.querySelector('.active');

    const chatConversationView = document.getElementById('chatConversationView');
    const chatSettingsView = document.getElementById('chatSettingsView');

    const chatSettingsBtn = document.getElementById('chatSettingsBtn');
    const backToChatBtn = document.getElementById('backToChatBtn');

    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const chatBody = document.getElementById('chatBody');
    const apiKeyForm = document.getElementById('apiKeyForm');
    const apiInput = document.getElementById('apiInput');

    chatLauncherBtn.addEventListener('click', () => {
        chatPanel.classList.toggle('open');
        const isOpen = chatPanel.classList.contains('open');

        if (isOpen) {
            iconDefault.style.display = 'none';
            iconActive.style.display = 'block';
            chatBadge.style.display = 'none'; 
        } else {
            iconDefault.style.display = 'block';
            iconActive.style.display = 'none';
        }
    });

    chatSettingsBtn.addEventListener('click', () => {
        chatConversationView.classList.remove('active-view');
        chatConversationView.style.display = 'none';
        chatSettingsView.style.display = 'block';
        chatSettingsView.classList.add('active-view');
        apiInput.value = localStorage.getItem('gemini_api_key') || '';
    });

    backToChatBtn.addEventListener('click', () => {
        chatSettingsView.classList.remove('active-view');
        chatSettingsView.style.display = 'none';
        chatConversationView.style.display = 'flex';
        chatConversationView.classList.add('active-view');
    });

    apiKeyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newKey = apiInput.value.trim();
        localStorage.setItem('gemini_api_key', newKey);

        const btn = apiKeyForm.querySelector('button');
        const oldText = btn.innerText;
        btn.innerText = "Saved!";
        btn.style.backgroundColor = "var(--secondary)";

        setTimeout(() => {
            btn.innerText = oldText;
            btn.style.backgroundColor = "var(--primary)";
            backToChatBtn.click();
        }, 1500);
    });

    let conversationHistory = [
        { role: 'system', content: 'You are an ultra-realistic Nomad Travel Support Agent.' }
    ];

    function scrollToBottom() {
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function formatRawText(text) {
        return text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    }

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const text = chatInput.value.trim();
        if (!text) return;

        appendMessage(text, 'user');
        conversationHistory.push({ role: 'user', content: text });
        chatInput.value = '';

        const typingIndicator = addTypingIndicator();
        scrollToBottom();

        let apiKey = localStorage.getItem('gemini_api_key');

        if (apiKey && apiKey.trim() !== '') {
            await fetchRealisticAI(text, typingIndicator, apiKey);
        } else {
            setTimeout(() => {
                simulateRobustAI(text, typingIndicator);
            }, 1200 + Math.random() * 800);
        }
    });

    function appendMessage(text, sender) {
        const div = document.createElement('div');
        div.className = `message ${sender}`;
        div.innerHTML = `<div class="message-content">${formatRawText(text)}</div>`;
        chatBody.appendChild(div);
        scrollToBottom();
    }

    function addTypingIndicator() {
        const div = document.createElement('div');
        div.className = `message ai typing-message`;
        div.innerHTML = `
            <div class="message-content typing-indicator">
                <div class="dot"></div><div class="dot"></div><div class="dot"></div>
            </div>
        `;
        chatBody.appendChild(div);
        return div;
    }

    async function fetchRealisticAI(userText, typingIndicator, apiKey) {
        try {
            const systemPrompt = conversationHistory.find(m => m.role === 'system')?.content || '';
            const rawContents = conversationHistory.filter(msg => msg.role !== 'system');
            const geminiContents = [];
            rawContents.forEach(msg => {
                const r = msg.role === 'assistant' ? 'model' : 'user';
                if (geminiContents.length > 0 && geminiContents[geminiContents.length - 1].role === r) {
                    geminiContents[geminiContents.length - 1].parts[0].text += '\n' + msg.content;
                } else {
                    geminiContents.push({ role: r, parts: [{ text: msg.content }] });
                }
            });

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    systemInstruction: { parts: [{ text: systemPrompt }] },
                    contents: geminiContents
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("API Error Response:", errorText);
                if (response.status === 429) throw new Error("429");
                if (response.status === 401) throw new Error("401");
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            const aiReply = data.candidates[0].content.parts[0].text;
            typingIndicator.remove();

            conversationHistory.push({ role: 'assistant', content: aiReply });
            appendMessage(aiReply, 'ai');

        } catch (error) {
            console.warn(error);
            typingIndicator.remove();

            let errMsg = null;
            if (error.message.includes("429")) {
                errMsg = "Rate limits currently exceeded on Live API. Switching to local offline system...";
            } else if (error.message.includes("401")) {
                errMsg = "Live API connection failed (Invalid Key). Switching to local offline system...";
            }

            if (errMsg) appendMessage(errMsg, 'ai');

            setTimeout(() => {
                simulateRobustAI(userText, addTypingIndicator());
            }, 1000);
        }
    }

    function simulateRobustAI(userText, typingIndicator) {
        typingIndicator.remove();
        let lowerText = userText.toLowerCase();
        let reply = "Hello! I am the local integrated guide. I don't have internet right now, but I can still check our internal database for you.";

        if (lowerText.includes("hello") || lowerText.includes("hi")) {
            reply = "Welcome back! What are you looking to explore today?";
        } else if (lowerText.includes("japan") || lowerText.includes("tokyo")) {
            reply = "Japan is incredible! The local database shows packages for Kyoto and Tokyo starting at the rates shown on your dashboard.";
        } else if (lowerText.includes("price") || lowerText.includes("cost") || lowerText.includes("pay")) {
            reply = "You can click the 'Buy Now' button on any destination card to securely checkout directly on the platform using the UTR QR flow.";
        }

        conversationHistory.push({ role: 'assistant', content: reply });
        appendMessage(reply, 'ai');
    }

    // --- 30 Unique Real-World Hotels Programmatic Injection ---
    // (Removed images and other items entirely)
    const hotelsGrid = document.querySelector('#hotels .destinations-grid');

    const topHotels = [
        { name: "The Savoy", city: "London" }, { name: "Waldorf Astoria", city: "New York" },
        { name: "Marina Bay Sands", city: "Singapore" }, { name: "Atlantis The Palm", city: "Dubai" },
        { name: "The Venetian", city: "Macau" }, { name: "Four Seasons", city: "Bora Bora" },
        { name: "Raffles", city: "Singapore" }, { name: "Soneva Fushi", city: "Maldives" },
        { name: "Aman Tokyo", city: "Tokyo" }, { name: "Mandarin Oriental", city: "Bangkok" },
        { name: "The Peninsula", city: "Hong Kong" }, { name: "St. Regis", city: "Bali" },
        { name: "Bulgari Resort", city: "Dubai" }, { name: "Rosewood", city: "London" },
        { name: "The Plaza", city: "New York" }, { name: "Fairmont Le Château Frontenac", city: "Quebec" },
        { name: "Emirates Palace", city: "Abu Dhabi" }, { name: "Badrutt's Palace", city: "St. Moritz" },
        { name: "Grand Hotel Tremezzo", city: "Lake Como" }, { name: "Hotel de Paris", city: "Monaco" },
        { name: "The Dorchester", city: "London" }, { name: "Como The Treasury", city: "Perth" },
        { name: "Hôtel de Crillon", city: "Paris" }, { name: "Oberoi Udaivilas", city: "Udaipur" },
        { name: "Royal Mansour", city: "Marrakech" }, { name: "Amangiri", city: "Utah" },
        { name: "Fogo Island Inn", city: "Newfoundland" }, { name: "Singita Grumeti", city: "Serengeti" },
        { name: "Taj Mahal Palace", city: "Mumbai" }, { name: "Belmond Cipriani", city: "Venice" }
    ];

    if (hotelsGrid) {
        topHotels.forEach((hotel, index) => {
            let price = Math.floor(Math.random() * 3000) + 800;
            let rating = (Math.random() * 0.5 + 4.5).toFixed(1);

            let card = document.createElement('div');
            card.className = "destination-card";
            // Set style to ensure it renders decently without images
            card.style.flexDirection = "column"; 
            card.style.alignItems = "flex-start";
            
            card.setAttribute('data-location', `hotel accommodation ${hotel.name.toLowerCase()} ${hotel.city.toLowerCase()}`);
            
            // Replaced the innerHTML to remove image container completely. 
            card.innerHTML = `
                <div class="card-content" style="width: 100%;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <span class="category" style="color: var(--secondary);">${hotel.city} Luxury</span>
                        <div class="rating" style="background: rgba(18,24,38,0.9); border: 1px solid var(--primary); padding: 5px 10px; border-radius: 10px; color: white; font-weight: bold;">
                            <i class="fa-solid fa-star" style="color: var(--primary);"></i> ${rating}
                        </div>
                    </div>
                    <h3>${hotel.name}</h3>
                    <p style="font-size: 0.95rem; color: var(--text-muted); margin-bottom: 1rem; line-height: 1.5;">Top-tier luxury accommodation bringing signature elegance and elite service to ${hotel.city}.</p>
                    <p class="price">From <strong>$${price}</strong> / night</p>
                    <button class="book-btn" style="margin-top: 10px;">Reserve Room</button>
                </div>
            `;

            let bookBtn = card.querySelector('.book-btn');
            bookBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                document.getElementById('paymentItemName').innerText = `${hotel.name} ($${price})`;
                document.getElementById('paymentModal').classList.add('active');
            });

            hotelsGrid.appendChild(card);
        });
    }

});