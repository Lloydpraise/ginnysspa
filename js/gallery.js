const sheets = [
    document.getElementById('sheet1'),
    document.getElementById('sheet2'),
    document.getElementById('sheet3'),
    document.getElementById('sheet4'),
    document.getElementById('sheet5')
];
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const indicator = document.getElementById('pageIndicator');

let currentSpread = 0; 
const maxSpread = sheets.length;

function updateBookState() {
    if (currentSpread === 0) {
        indicator.innerText = "Cover";
    } else if (currentSpread === maxSpread) {
        indicator.innerText = "Back Cover";
    } else {
        indicator.innerText = `Spread ${currentSpread} of ${maxSpread - 1}`;
    }

    sheets.forEach((sheet, idx) => {
        if (idx < currentSpread) {
            sheet.classList.add('flipped');
            sheet.style.zIndex = idx + 1; 
        } else {
            sheet.classList.remove('flipped');
            sheet.style.zIndex = maxSpread - idx; 
        }
    });
}

function goNext() {
    if (currentSpread < maxSpread) {
        currentSpread++;
        updateBookState();
    }
}

function goPrev() {
    if (currentSpread > 0) {
        currentSpread--;
        updateBookState();
    }
}

nextBtn.addEventListener('click', goNext);
prevBtn.addEventListener('click', goPrev);

sheets.forEach((sheet) => {
    sheet.addEventListener('click', (e) => {
        if(e.target.tagName === 'BUTTON') return;
        if (sheet.classList.contains('flipped')) {
            goPrev();
        } else {
            goNext();
        }
    });
});

// Event script wiring to bind the booking triggers while inside gallery context
document.querySelectorAll('.show-concierge-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation(); // Avoid triggering flip book logic checks accidentally
        
        // If you are using the unified booking drawer logic we built earlier:
        if (typeof toggleDrawer === "function") {
            toggleDrawer();
        } else {
            // Fail-safe alert fallback hook until the booking js is fully integrated
            alert("Opening the interactive booking experience window...");
        }
    });
});

updateBookState();