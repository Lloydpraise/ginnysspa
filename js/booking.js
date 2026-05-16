document.addEventListener('DOMContentLoaded', () => {
    const modalOverlay = document.getElementById('bookingModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const bookingForm = document.getElementById('spaBookingForm');
    const allButtons = document.querySelectorAll('.btn, .explore-link');
    
    // Multi-Step Navigation Selectors
    const steps = document.querySelectorAll('.form-step');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    let currentStep = 1;

    // Service Select & Receipt DOM elements
    const spaServiceSelect = document.getElementById('spaService');
    const directMassageSelect = document.getElementById('directMassageSelect');
    const liveReceipt = document.getElementById('liveReceipt');

    // Date/Time Inputs Reference for Itinerary Rendering
    const bookingDateInput = document.getElementById('bookingDate');
    const bookingTimeInput = document.getElementById('bookingTime');

    // --- CONCIERGE WORKFLOW METHODS ---

    // Open Concierge Modal Experience
    allButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const btnText = btn.textContent.toLowerCase();
            
            // Filter click listeners specifically to conversion buttons
            if (btnText.includes('book') || btnText.includes('secure') || btnText.includes('preference') || btnText.includes('explore') || btnText.includes('experience')) {
                e.preventDefault();
                resetConciergeForm();
                
                // If user clicks "Select Preference" on the massage card, inherit that value natively!
                if (btnText.includes('preference') && directMassageSelect && spaServiceSelect) {
                    spaServiceSelect.value = directMassageSelect.value;
                    updateReceiptSummary();
                }

                if (modalOverlay) {
                    modalOverlay.classList.add('active');
                }
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Close Modal Elements Toggle
    const dismissModal = () => {
        if (modalOverlay) {
            modalOverlay.classList.remove('active');
        }
        document.body.style.overflow = 'auto';
    };

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', dismissModal);
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) dismissModal();
        });
    }

    // --- MULTI-STEP NAVIGATION IMPLEMENTATION ---
    const updateFormStepState = () => {
        steps.forEach(step => {
            const stepNum = parseInt(step.getAttribute('data-step'));
            if (stepNum === currentStep) {
                step.classList.add('active');
                // Enable child input validation fields natively
                step.querySelectorAll('input, select').forEach(input => input.removeAttribute('disabled'));
            } else {
                step.classList.remove('active');
                step.querySelectorAll('input, select').forEach(input => input.setAttribute('disabled', 'true'));
            }
        });

        // Mutate Control Button States
        if (prevBtn && nextBtn) {
            if (currentStep === 1) {
                prevBtn.style.visibility = 'hidden';
                nextBtn.textContent = 'Continue';
            } else {
                prevBtn.style.visibility = 'visible';
                prevBtn.textContent = '← Back';
                
                if (currentStep === 3) {
                    nextBtn.textContent = 'Confirm Reservation';
                } else {
                    nextBtn.textContent = 'Continue';
                }
            }
        }
    };

    // Forward Validation Logic
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const activeStepEl = document.querySelector(`.form-step[data-step="${currentStep}"]`);
            if (!activeStepEl) return;
            
            const inputs = activeStepEl.querySelectorAll('input, select');
            
            // Use browser native constraint checking mechanisms
            let stepValid = true;
            inputs.forEach(input => {
                if (!input.checkValidity()) {
                    input.reportValidity();
                    stepValid = false;
                }
            });

            if (!stepValid) return;

            if (currentStep < 3) {
                currentStep++; // Fixed: Removed the lookbook variable overwrite here!
                updateFormStepState();
            } else {
                // Step 3 submission firing sequence
                if (bookingForm) bookingForm.requestSubmit();
            }
        });
    }

    // Backward Step Execution
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentStep > 1) {
                currentStep--;
                updateFormStepState();
            }
        });
    }

    // --- DYNAMIC RECEIPT TICKETING SYSTEM ---
    const updateReceiptSummary = () => {
        if (!liveReceipt) return; 
        if (!spaServiceSelect) return;

        const selectedOption = spaServiceSelect.options[spaServiceSelect.selectedIndex];
        
        if (!selectedOption || selectedOption.value === "") {
            liveReceipt.innerHTML = `<div class="receipt-empty-state">No therapy selected yet. Your summary itinerary updates dynamically here.</div>`;
            return;
        }

        const treatmentName = selectedOption.value;
        const groupLabel = selectedOption.closest('optgroup')?.label || 'Spa Therapy';
        const price = selectedOption.getAttribute('data-price') || '0';
        const duration = selectedOption.getAttribute('data-duration') || 'N/A';
        
        // Parse current date/time strings safely
        const dateValue = (bookingDateInput && bookingDateInput.value) ? new Date(bookingDateInput.value).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : 'Unscheduled Date';
        const timeValue = (bookingTimeInput && bookingTimeInput.value) ? bookingTimeInput.value : 'Unscheduled Time';

        liveReceipt.innerHTML = `
            <div class="receipt-data">
                <div class="category">${groupLabel}</div>
                <h3>${treatmentName}</h3>
                <div class="receipt-row" style="margin-top: 1.5rem;">
                    <span>Session Allocation:</span>
                    <span>${duration}</span>
                </div>
                <div class="receipt-row">
                    <span>Schedule Date:</span>
                    <span>${dateValue}</span>
                </div>
                <div class="receipt-row">
                    <span>Arrival Window:</span>
                    <span>${timeValue}</span>
                </div>
                <div class="receipt-total">
                    <span>Total Due</span>
                    <span class="price">${price}/=</span>
                </div>
            </div>
        `;
    };

    // Bind event dynamic list checking loops safely
    if (spaServiceSelect) spaServiceSelect.addEventListener('change', updateReceiptSummary);
    if (bookingDateInput) bookingDateInput.addEventListener('input', updateReceiptSummary);
    if (bookingTimeInput) bookingTimeInput.addEventListener('input', updateReceiptSummary);

    // Form Initialization States Sanitizer
    const resetConciergeForm = () => {
        if (bookingForm) bookingForm.reset();
        currentStep = 1;
        updateFormStepState();
        updateReceiptSummary();
    };

    // Final Payload Capture processing handler
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Reservation Successful. Your dedicated luxury concierge from Ginny Spa will contact you shortly to confirm your private room allocation.');
            dismissModal();
            resetConciergeForm();
        });
    }
});