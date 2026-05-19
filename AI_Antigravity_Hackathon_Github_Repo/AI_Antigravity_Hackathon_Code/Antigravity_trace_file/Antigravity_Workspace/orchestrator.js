// --- MOCK DATABASE ---
const providersDataset = [
    {
        id: 1,
        name: "Ali Plumbing Services",
        service: "plumber",
        location: "DHA Karachi",
        city: "Karachi",
        rating: 4.8,
        distance: 1.2,
        available: true,
        x: 180, // Canvas X coordinate (local to Karachi grid)
        y: 200  // Canvas Y coordinate
    },
    {
        id: 2,
        name: "Fast Electricians",
        service: "electrician",
        location: "Clifton Karachi",
        city: "Karachi",
        rating: 4.5,
        distance: 2.5,
        available: true,
        x: 120,
        y: 130
    },
    {
        id: 3,
        name: "Cool Air AC Services",
        service: "AC technician",
        location: "G-13 Islamabad",
        city: "Islamabad",
        rating: 4.9,
        distance: 1.8,
        available: true,
        x: 220,
        y: 90
    },
    {
        id: 4,
        name: "Shaheen Plumbers",
        service: "plumber",
        location: "Clifton Karachi",
        city: "Karachi",
        rating: 4.2,
        distance: 3.4,
        available: true,
        x: 110,
        y: 160
    },
    {
        id: 5,
        name: "DHA Electric & Wire Co.",
        service: "electrician",
        location: "DHA Karachi",
        city: "Karachi",
        rating: 4.9,
        distance: 0.8,
        available: false, // Demo of unavailable ranking penalty
        x: 210,
        y: 220
    },
    {
        id: 6,
        name: "Islamabad AC Care",
        service: "AC technician",
        location: "G-13 Islamabad",
        city: "Islamabad",
        rating: 4.1,
        distance: 4.2,
        available: true,
        x: 260,
        y: 110
    }
];

// --- CANVAS RADAR MAP SETTINGS ---
const canvas = document.getElementById("radar-canvas");
const ctx = canvas.getContext("2d");
let radarAnimationId = null;
let currentCityCenter = { x: 200, y: 150, name: "Scanning..." };
let activeProvidersOnRadar = [];
let selectedProviderOnRadar = null;
let sweepAngle = 0;

// Setup canvas bounds
function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    currentCityCenter.x = canvas.width / 2;
    currentCityCenter.y = canvas.height / 2;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Render radar screen
function startRadarScan(city, providers = [], selected = null) {
    currentCityCenter.name = city;
    activeProvidersOnRadar = providers;
    selectedProviderOnRadar = selected;

    if (radarAnimationId) cancelAnimationFrame(radarAnimationId);

    function draw() {
        ctx.fillStyle = "rgba(7, 8, 11, 0.15)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        // Draw Radar Grid Circles
        ctx.strokeStyle = "rgba(6, 182, 212, 0.1)";
        ctx.lineWidth = 1;
        for (let r = 40; r < Math.max(canvas.width, canvas.height); r += 40) {
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Draw Radar Axis Lines
        ctx.beginPath();
        ctx.moveTo(0, cy); ctx.lineTo(canvas.width, cy);
        ctx.moveTo(cx, 0); ctx.lineTo(cx, canvas.height);
        ctx.stroke();

        // Draw radar sweeping green line
        sweepAngle += 0.02;
        const sweepX = cx + Math.cos(sweepAngle) * 300;
        const sweepY = cy + Math.sin(sweepAngle) * 300;
        ctx.strokeStyle = "rgba(6, 182, 212, 0.25)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(sweepX, sweepY);
        ctx.stroke();

        // Draw sweeping glow
        ctx.fillStyle = "rgba(6, 182, 212, 0.02)";
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, 300, sweepAngle - 0.2, sweepAngle);
        ctx.closePath();
        ctx.fill();

        // Draw User Center Location
        ctx.fillStyle = "rgba(99, 102, 241, 1)";
        ctx.shadowColor = "rgba(99, 102, 241, 0.5)";
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // reset

        // Draw Discovered Providers
        activeProvidersOnRadar.forEach(p => {
            const relX = cx + (p.x - 200);
            const relY = cy + (p.y - 150);

            const isWinner = selectedProviderOnRadar && selectedProviderOnRadar.id === p.id;

            // Pulsing dot
            ctx.fillStyle = isWinner ? "rgba(16, 185, 129, 1)" : "rgba(6, 182, 212, 0.8)";
            ctx.shadowColor = isWinner ? "#10b981" : "#06b6d4";
            ctx.shadowBlur = isWinner ? 12 : 6;
            ctx.beginPath();
            ctx.arc(relX, relY, isWinner ? 7 : 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            // Pulsing outer ring for match
            if (isWinner) {
                const pulseSize = 7 + Math.sin(Date.now() / 150) * 4;
                ctx.strokeStyle = "rgba(16, 185, 129, 0.4)";
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.arc(relX, relY, pulseSize, 0, Math.PI * 2);
                ctx.stroke();

                // Draw connecting line to center
                ctx.strokeStyle = "rgba(16, 185, 129, 0.35)";
                ctx.lineWidth = 2;
                ctx.setLineDash([5, 3]);
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(relX, relY);
                ctx.stroke();
                ctx.setLineDash([]); // Reset
            }

            // Provider Label text
            ctx.fillStyle = isWinner ? "#fff" : "rgba(255,255,255,0.7)";
            ctx.font = isWinner ? "bold 10px 'Plus Jakarta Sans'" : "9px 'Plus Jakarta Sans'";
            ctx.fillText(p.name, relX + 10, relY + 3);
        });

        radarAnimationId = requestAnimationFrame(draw);
    }

    draw();
}

// Reset radar representation
function resetRadar() {
    activeProvidersOnRadar = [];
    selectedProviderOnRadar = null;
    currentCityCenter.name = "Scanning...";
    if (radarAnimationId) cancelAnimationFrame(radarAnimationId);

    // Draw default blank radar screen once
    ctx.fillStyle = "#07080b";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    for (let r = 40; r < Math.max(canvas.width, canvas.height); r += 40) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(0, cy); ctx.lineTo(canvas.width, cy);
    ctx.moveTo(cx, 0); ctx.lineTo(cx, canvas.height);
    ctx.stroke();
}

resetRadar();


// --- LOGGING AGENT HELPER ---
const terminalBody = document.getElementById("terminal-body");

function addLogLine(agentClass, prefix, message) {
    const timestamp = new Date().toLocaleTimeString();
    const line = document.createElement("div");
    line.className = `log-line ${agentClass}`;

    const tsSpan = document.createElement("span");
    tsSpan.className = "log-timestamp";
    tsSpan.textContent = `[${timestamp}]`;

    const agentSpan = document.createElement("span");
    agentSpan.className = "log-agent-name";
    agentSpan.textContent = prefix;

    const msgText = document.createTextNode(message);

    line.appendChild(tsSpan);
    line.appendChild(agentSpan);
    line.appendChild(msgText);

    terminalBody.appendChild(line);
    terminalBody.scrollTop = terminalBody.scrollHeight;
}


// --- INTENT UNDERSTANDING AGENT (NLU ENGINE) ---
function detectLanguageAndQuery(query) {
    const lowerQuery = query.toLowerCase();

    // Detect Language
    let lang = "English";
    // Check for Arabic characters (Urdu)
    const urduRegex = /[\u0600-\u06FF]/;
    if (urduRegex.test(query)) {
        lang = "Urdu (اردو)";
    } else {
        // Look for common Roman Urdu words
        const romanKeywords = ["mujhe", "chahiye", "hai", "mein", "me", "kal", "dha", "clifton", "tayyar", "plumber", "electrician", "karna", "krdo", "karado"];
        const matchCount = romanKeywords.filter(kw => lowerQuery.includes(kw)).length;
        if (matchCount >= 2) {
            lang = "Roman Urdu";
        }
    }

    // Extract Service Category
    let service = "unknown";
    const plumberKws = ["plumber", "plumbing", "pipe", "tap", "leak", "پلمبر", "نل ساز", "nal saaz", "pipe wala"];
    const elecKws = ["electrician", "electricity", "light", "fan", "wire", "الیکٹریشن", "bijli", "bijliwala", "bijli wala"];
    const acKws = ["ac", "air conditioner", "cooling", "cool air", "اے سی", "ac technician", "ac wala", "ac repair"];

    if (plumberKws.some(kw => lowerQuery.includes(kw))) {
        service = "plumber";
    } else if (elecKws.some(kw => lowerQuery.includes(kw))) {
        service = "electrician";
    } else if (acKws.some(kw => lowerQuery.includes(kw))) {
        service = "AC technician";
    }

    // Extract Location
    let location = "unknown";
    let city = "unknown";

    if (lowerQuery.includes("dha") || lowerQuery.includes("ڈی ایچ اے")) {
        location = "DHA Karachi";
        city = "Karachi";
    } else if (lowerQuery.includes("clifton") || lowerQuery.includes("کلفٹن")) {
        location = "Clifton Karachi";
        city = "Karachi";
    } else if (lowerQuery.includes("g-13") || lowerQuery.includes("g13") || lowerQuery.includes("جی-13")) {
        location = "G-13 Islamabad";
        city = "Islamabad";
    }

    // Extract Time
    let time = "immediate";
    const tomorrowKws = ["kal", "tomorrow", "dopahar", "shaam", "dopahrain", "کل", "اگلے دن"];
    if (tomorrowKws.some(kw => lowerQuery.includes(kw))) {
        time = "Tomorrow";
    } else {
        time = "Immediate (Asap)";
    }

    return { lang, service, location, city, time };
}


// --- ACTIVE PIPELINE CONTROLLER ---
let activeState = "IDLE";
const stepElements = {
    intent: document.getElementById("step-intent"),
    discovery: document.getElementById("step-discovery"),
    ranking: document.getElementById("step-ranking"),
    booking: document.getElementById("step-booking"),
    followup: document.getElementById("step-followup")
};

function resetPipelineUI() {
    Object.keys(stepElements).forEach(k => {
        stepElements[k].className = "pipeline-step";
        stepElements[k].querySelector(".step-status").textContent = "Idle";
    });
    document.querySelectorAll(".pipeline-line").forEach(l => l.className = "pipeline-line");

    document.getElementById("workspace-idle-msg").classList.remove("hidden");
    document.getElementById("agent-active-card").classList.add("hidden");

    // Hide all sub-contents
    document.getElementById("intent-output").classList.add("hidden");
    document.getElementById("discovery-output").classList.add("hidden");
    document.getElementById("ranking-output").classList.add("hidden");
    document.getElementById("booking-output-details").classList.add("hidden");
    document.getElementById("followup-output-details").classList.add("hidden");

    const badge = document.getElementById("active-agent-badge");
    badge.className = "agent-badge";
    badge.textContent = "NO ACTIVE AGENT";
    document.getElementById("active-agent-title").textContent = "Active Agent Workspace";
}

function updatePipelineStep(step, state) {
    const el = stepElements[step];
    if (!el) return;

    if (state === "ACTIVE") {
        el.className = "pipeline-step active";
        el.querySelector(".step-status").textContent = "Processing...";
    } else if (state === "COMPLETE") {
        el.className = "pipeline-step complete";
        el.querySelector(".step-status").textContent = "Completed";
    }
}


// --- MAIN ORCHESTRATION ENGINE WORKFLOW ---
async function runServiceBookingWorkflow(query) {
    if (!query || query.trim() === "") {
        alert("Please enter a service request query first!");
        return;
    }

    document.getElementById("run-orchestration-btn").disabled = true;
    resetPipelineUI();
    addLogLine("system-msg", "[SYSTEM]", `Initializing execution for query: "${query}"`);

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // ==========================================
    // 1. INTENT UNDERSTANDING AGENT
    // ==========================================
    activeState = "INTENT";
    updatePipelineStep("intent", "ACTIVE");

    const badge = document.getElementById("active-agent-badge");
    badge.className = "agent-badge intent";
    badge.textContent = "Intent Agent";
    document.getElementById("active-agent-title").textContent = "Parsing Conversational Request";

    document.getElementById("workspace-idle-msg").classList.add("hidden");
    document.getElementById("agent-active-card").classList.remove("hidden");
    document.getElementById("intent-output").classList.remove("hidden");

    // Intent logic planning & logs
    addLogLine("intent-log", "[INTENT_AGENT] [PLAN]", "Step 1: Parse string script to identify colloquial terms, service nouns, location coordinates and temporal entities.");
    addLogLine("intent-log", "[INTENT_AGENT] [REASONING]", "Analyzing language morphology to detect script origin (Urdu Arabic vs transliterated Roman Urdu vs standard Latin English).");

    await delay(1200);

    const intent = detectLanguageAndQuery(query);

    // Populate UI
    document.getElementById("intent-lang").textContent = intent.lang;
    document.getElementById("intent-service").textContent = intent.service !== "unknown" ? intent.service.toUpperCase() : "NOT IDENTIFIED";
    document.getElementById("intent-location").textContent = intent.location !== "unknown" ? intent.location : "NOT IDENTIFIED";
    document.getElementById("intent-time").textContent = intent.time;

    addLogLine("intent-log", "[INTENT_AGENT] [ACTION]", `Extracted structured tokens -> Lang: ${intent.lang} | Service: ${intent.service} | Location: ${intent.location} | Time: ${intent.time}`);
    addLogLine("intent-log", "[INTENT_AGENT] [FOLLOW-UP]", "Broadcasting intent results downstream to spatial Provider Discovery Agent.");

    updatePipelineStep("intent", "COMPLETE");
    document.getElementById("line-intent-discovery").className = "pipeline-line complete";

    if (intent.service === "unknown" || intent.location === "unknown") {
        addLogLine("error-log", "[SYSTEM] [ERROR]", "Failed to extract matching service category or location bounds. Halting orchestrator.");
        document.getElementById("run-orchestration-btn").disabled = false;
        return;
    }

    await delay(1000);

    // ==========================================
    // 2. PROVIDER DISCOVERY AGENT
    // ==========================================
    activeState = "DISCOVERY";
    updatePipelineStep("discovery", "ACTIVE");

    badge.className = "agent-badge discovery";
    badge.textContent = "Discovery Agent";
    document.getElementById("active-agent-title").textContent = "Nearby Spatial Discovery";

    document.getElementById("intent-output").classList.add("hidden");
    document.getElementById("discovery-output").classList.remove("hidden");

    addLogLine("discovery-log", "[DISCOVERY_AGENT] [PLAN]", `Query mock data warehouse for providers offering service category: '${intent.service}' inside region: '${intent.city}'.`);
    addLogLine("discovery-log", "[DISCOVERY_AGENT] [REASONING]", "Utilize geographical indexing (2D spatial coordinates scan) to overlay available service suppliers.");

    // Filter Providers
    const filteredProviders = providersDataset.filter(p => {
        const matchService = p.service.toLowerCase() === intent.service.toLowerCase();
        const matchCity = p.city.toLowerCase() === intent.city.toLowerCase();
        return matchService && matchCity;
    });

    // Animate map sweep and show providers
    startRadarScan(intent.city, filteredProviders, null);

    // Render list in workspace
    const listElem = document.getElementById("discovered-providers-list");
    listElem.innerHTML = "";
    document.getElementById("discovery-count").textContent = `${filteredProviders.length} Provider(s) Discovered in ${intent.city}`;

    filteredProviders.forEach(p => {
        const item = document.createElement("div");
        item.className = "provider-item-card";
        item.innerHTML = `
            <div class="provider-name">${p.name}</div>
            <div class="provider-details-list">
                <div class="p-detail"><span>Service:</span><span class="val">${p.service}</span></div>
                <div class="p-detail"><span>Location:</span><span class="val">${p.location}</span></div>
                <div class="p-detail"><span>Distance:</span><span class="val">${p.distance} km</span></div>
                <div class="p-detail"><span>Rating:</span><span class="val">★ ${p.rating}</span></div>
                <div class="p-detail"><span>Status:</span><span class="avail-tag ${p.available ? 'yes' : 'no'}">${p.available ? 'Available' : 'Busy'}</span></div>
            </div>
        `;
        listElem.appendChild(item);
    });

    await delay(1500);

    addLogLine("discovery-log", "[DISCOVERY_AGENT] [ACTION]", `Discovered ${filteredProviders.length} providers mapping spatial range index filters.`);
    addLogLine("discovery-log", "[DISCOVERY_AGENT] [FOLLOW-UP]", "Transferring discovered candidates list to multi-criteria Ranking Agent.");

    updatePipelineStep("discovery", "COMPLETE");
    document.getElementById("line-discovery-ranking").className = "pipeline-line complete";

    await delay(1000);

    // ==========================================
    // 3. RANKING AGENT
    // ==========================================
    activeState = "RANKING";
    updatePipelineStep("ranking", "ACTIVE");

    badge.className = "agent-badge ranking";
    badge.textContent = "Ranking Agent";
    document.getElementById("active-agent-title").textContent = "Multi-Criteria Ranking Matrix";

    document.getElementById("discovery-output").classList.add("hidden");
    document.getElementById("ranking-output").classList.remove("hidden");

    addLogLine("ranking-log", "[RANKING_AGENT] [PLAN]", "Compute rank scores based on Weighted Multi-Criteria Decisional Analysis (40% rating, 40% distance, 20% availability).");
    addLogLine("ranking-log", "[RANKING_AGENT] [REASONING]", "Availability acts as a hard criteria gate (0 value if busy), while closer distances and higher customer feedback ratings yield positive score values.");

    // Compute Scores and Rank
    const rankedList = filteredProviders.map(p => {
        // Normalize Distance: max rating distance is 5km
        const normDistScore = Math.max(0, (5 - p.distance) * 20); // 0 to 100
        const normRatingScore = (p.rating / 5) * 100; // 0 to 100
        const availScore = p.available ? 100 : 0;

        const finalScore = (normRatingScore * 0.4) + (normDistScore * 0.4) + (availScore * 0.2);

        return {
            ...p,
            normDistScore: normDistScore.toFixed(1),
            normRatingScore: normRatingScore.toFixed(1),
            availScore,
            finalScore: finalScore.toFixed(1)
        };
    }).sort((a, b) => b.finalScore - a.finalScore);

    const topProvider = rankedList[0];

    // Highlight winning provider on map
    startRadarScan(intent.city, filteredProviders, topProvider);

    // Render ranking table
    const tbody = document.getElementById("ranking-tbody");
    tbody.innerHTML = "";

    rankedList.forEach((p, idx) => {
        const tr = document.createElement("tr");
        if (idx === 0) tr.className = "top-rank";
        tr.innerHTML = `
            <td>#${idx + 1}</td>
            <td>${p.name} ${idx === 0 ? '👑' : ''}</td>
            <td>${p.rating} (${p.normRatingScore})</td>
            <td>${p.distance}km (${p.normDistScore})</td>
            <td>${p.available ? 'Yes (100)' : 'No (0)'}</td>
            <td class="score">${p.finalScore}</td>
        `;
        tbody.appendChild(tr);
    });

    // Dynamic explanation text
    const explanationDiv = document.getElementById("ranking-explanation");
    explanationDiv.innerHTML = `
        <strong>System Ranking Recommendation:</strong> Selected <strong>${topProvider.name}</strong> as primary candidate. 
        <br><em>Reasoning:</em> It holds an excellent rating of ${topProvider.rating}/5 at a highly convenient distance of ${topProvider.distance} km, 
        and is fully available. Calculated utility index coefficient is <strong>${topProvider.finalScore}/100</strong>, exceeding next alternative by ${(topProvider.finalScore - (rankedList[1] ? rankedList[1].finalScore : 0)).toFixed(1)} points.
    `;

    await delay(1800);

    addLogLine("ranking-log", "[RANKING_AGENT] [ACTION]", `Rankings computed. Primary candidate designated: ${topProvider.name} (${topProvider.finalScore} pts).`);
    addLogLine("ranking-log", "[RANKING_AGENT] [FOLLOW-UP]", "Forwarding assigned primary candidate payload to Booking confirmation agent.");

    updatePipelineStep("ranking", "COMPLETE");
    document.getElementById("line-ranking-booking").className = "pipeline-line complete";

    await delay(1000);

    // ==========================================
    // 4. BOOKING AGENT
    // ==========================================
    activeState = "BOOKING";
    updatePipelineStep("booking", "ACTIVE");

    badge.className = "agent-badge booking";
    badge.textContent = "Booking Agent";
    document.getElementById("active-agent-title").textContent = "Simulating Transaction Confirmation";

    document.getElementById("ranking-output").classList.add("hidden");
    document.getElementById("booking-output-details").classList.remove("hidden");

    addLogLine("booking-log", "[BOOKING_AGENT] [PLAN]", `Locking scheduling availability and assigning provider '${topProvider.name}' for immediate/tomorrow reservation slot.`);
    addLogLine("booking-log", "[BOOKING_AGENT] [REASONING]", "Ensure unique transaction ID generation to guarantee idempotency and update supplier index availability status.");

    // Simulate booking
    const bookingIdNum = Math.floor(100 + Math.random() * 900);
    const bookingId = `BK${bookingIdNum}`;

    // Mutate provider status in local dataset (make it busy)
    topProvider.available = false;

    // Fill Ticket UI
    document.getElementById("ticket-booking-id").textContent = bookingId;
    document.getElementById("ticket-provider").textContent = topProvider.name;
    document.getElementById("ticket-service").textContent = topProvider.service.toUpperCase();
    document.getElementById("ticket-time").textContent = intent.time;
    document.getElementById("ticket-location").textContent = topProvider.location;

    await delay(1500);

    addLogLine("booking-log", "[BOOKING_AGENT] [ACTION]", `Successfully locked booking slot! Booking ID: ${bookingId} generated. assigned to ${topProvider.name}.`);
    addLogLine("booking-log", "[BOOKING_AGENT] [FOLLOW-UP]", "Instantiating follow-up operations cron workflow loops.");

    updatePipelineStep("booking", "COMPLETE");
    document.getElementById("line-booking-followup").className = "pipeline-line complete";

    await delay(1000);

    // ==========================================
    // 5. FOLLOW-UP AGENT
    // ==========================================
    activeState = "FOLLOWUP";
    updatePipelineStep("followup", "ACTIVE");

    badge.className = "agent-badge followup";
    badge.textContent = "Follow-Up Agent";
    document.getElementById("active-agent-title").textContent = "Automated Reminders & Event Execution";

    document.getElementById("booking-output-details").classList.add("hidden");
    document.getElementById("followup-output-details").classList.remove("hidden");

    addLogLine("followup-log", "[FOLLOWUP_AGENT] [PLAN]", "Setup scheduled WhatsApp notification events and job transition simulation pipelines.");
    addLogLine("followup-log", "[FOLLOWUP_AGENT] [REASONING]", "Informal economy demands frequent status signals to boost supplier reliability and secure client trust.");

    // Step-by-step notification stream simulation
    const notiReminder = document.getElementById("noti-reminder");
    const notiDispatch = document.getElementById("noti-dispatch");
    const notiProgress = document.getElementById("noti-progress");
    const notiCompletion = document.getElementById("noti-completion");

    // Reset notification statuses
    notiReminder.className = "notification-card active";
    notiDispatch.className = "notification-card";
    notiProgress.className = "notification-card";
    notiCompletion.className = "notification-card";

    // Update texts
    document.getElementById("noti-reminder-text").innerHTML = `Booking confirmation sent. <strong>${topProvider.name}</strong> is scheduled for ${intent.time} at <strong>${intent.location}</strong>.`;

    addLogLine("followup-log", "[FOLLOWUP_AGENT] [ACTION]", "WhatsApp/SMS pre-reminder dispatched to client and service supplier.");

    await delay(2000);

    // Transit to Dispatch
    notiReminder.className = "notification-card done";
    notiDispatch.className = "notification-card active";
    document.getElementById("noti-dispatch-text").innerHTML = `Status update: <strong>${topProvider.name}</strong> has loaded equipment and is in-transit to Clifton/DHA coordinates. (1.2 km away).`;
    addLogLine("followup-log", "[FOLLOWUP_AGENT] [ACTION]", "Transit update received. Provider has departed from their base terminal.");

    await delay(2000);

    // Transit to In Progress
    notiDispatch.className = "notification-card done";
    notiProgress.className = "notification-card active";
    document.getElementById("noti-progress-text").innerHTML = `Task status: In-progress. Provider has arrived on site, diagnosed structural repair point and initiated active service work.`;
    addLogLine("followup-log", "[FOLLOWUP_AGENT] [ACTION]", "Site arrival confirmation. Job execution tracker initiated.");

    await delay(2000);

    // Transit to Completion
    notiProgress.className = "notification-card done";
    notiCompletion.className = "notification-card active";
    document.getElementById("noti-completion-text").innerHTML = `Service complete! Job verified by user. ${topProvider.name} is leaving. Please rate your orchestration experience to complete the audit trail:`;
    addLogLine("followup-log", "[FOLLOWUP_AGENT] [ACTION]", "Completion confirmation received from worker and customer signature verification.");
    addLogLine("followup-log", "[FOLLOWUP_AGENT] [FOLLOW-UP]", "Booking closure logged. Ready for feedback evaluation.");

    updatePipelineStep("followup", "COMPLETE");

    addLogLine("system-msg", "[SYSTEM]", `=== MULTI-AGENT WORKFLOW ORCHESTRATION COMPLETED SECURELY FOR ID: ${bookingId} ===`);

    document.getElementById("run-orchestration-btn").disabled = false;
}


// --- ATTACH EVENT HANDLERS ---

// Execute button trigger
document.getElementById("run-orchestration-btn").addEventListener("click", () => {
    const q = document.getElementById("user-query").value;
    runServiceBookingWorkflow(q);
});

// Preset button triggers
document.querySelectorAll(".preset-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const query = btn.getAttribute("data-query");
        const area = document.getElementById("user-query");
        area.value = query;
        document.getElementById("char-count").textContent = `${query.length} chars`;

        // Auto-scroll request hub to view
        runServiceBookingWorkflow(query);
    });
});

// Character count helper
document.getElementById("user-query").addEventListener("input", (e) => {
    document.getElementById("char-count").textContent = `${e.target.value.length} chars`;
});

// Clear input
document.getElementById("clear-btn").addEventListener("click", () => {
    document.getElementById("user-query").value = "";
    document.getElementById("char-count").textContent = "0 chars";
    resetPipelineUI();
    resetRadar();
});

// Copy Logs
document.getElementById("copy-logs-btn").addEventListener("click", () => {
    const lines = Array.from(terminalBody.querySelectorAll(".log-line")).map(el => el.textContent).join("\n");
    navigator.clipboard.writeText(lines).then(() => {
        alert("Logs successfully copied to clipboard!");
    }).catch(err => {
        console.error("Failed to copy: ", err);
    });
});

// Clear Logs
document.getElementById("clear-logs-btn").addEventListener("click", () => {
    terminalBody.innerHTML = `
        <div class="log-line system-msg">[SYSTEM] Logs cleared. Waiting for user intent...</div>
    `;
});

// Interactive Stars rating
document.querySelectorAll(".rating-stars-interactive .star").forEach(star => {
    star.addEventListener("click", (e) => {
        const val = parseInt(e.target.getAttribute("data-val"));
        const parent = e.target.parentElement;
        const stars = parent.querySelectorAll(".star");

        stars.forEach(s => {
            const sVal = parseInt(s.getAttribute("data-val"));
            if (sVal <= val) {
                s.classList.add("active");
            } else {
                s.classList.remove("active");
            }
        });

        addLogLine("system-msg", "[SYSTEM]", `Customer submitted a feedback rating of ${val}/5 stars for the booking.`);
    });
});
