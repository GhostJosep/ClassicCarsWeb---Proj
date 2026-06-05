let selectedVehiclesPool = [];
let carDataMap = [];

document.addEventListener('DOMContentLoaded', function () {
    // 1. Load data for fallback
    fetch('/api/Data/GetCars')
        .then(response => response.json())
        .then(data => { carDataMap = data; })
        .catch(err => console.error("Data Load Error:", err));

    // 2. Global Change Listener (For Compare Checkboxes)
    document.body.addEventListener('change', (e) => {
        if (e.target.classList.contains('compare-check')) {
            handleCompareSelection(e.target);
        }
    });

    // 3. Global Click Listener (For Quick View)
    document.body.addEventListener('click', (e) => {
        const trigger = e.target.closest('.classic-card-trigger');
        // Only trigger if clicking the card, but NOT if clicking buttons/checkboxes inside it
        if (trigger && !e.target.closest('.compare-checkbox-container') && !e.target.closest('button') && !e.target.closest('a')) {
            launchQuickViewModal(trigger);
        }
    });
});

// --- Modal Logic: Test Drive ---
window.openTestDriveModal = function(event, carTitle) {
    if (event) event.stopPropagation();
    const modalEl = document.getElementById('testDriveModal');
    if (modalEl) {
        document.getElementById('testDriveModalTitle').innerText = "Schedule Test Drive: " + carTitle;
        document.getElementById('testDriveCarTitle').value = carTitle;
        bootstrap.Modal.getOrCreateInstance(modalEl).show();
    }
};

// --- Modal Logic: Quick View 
function launchQuickViewModal(cardTrigger) {
    const modalEl = document.getElementById('quickViewModal');
    if (!modalEl) return;

    const setSafeText = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.innerText = val || "N/A";
    };

    const data = {
        title: cardTrigger.getAttribute('data-title'),
        img: cardTrigger.getAttribute('data-img'),
        engine: cardTrigger.getAttribute('data-engine'),
        hp: cardTrigger.getAttribute('data-hp'),
        drive: cardTrigger.getAttribute('data-drive'),
        trans: cardTrigger.getAttribute('data-trans')
    };

    // Populate the modal fields
    setSafeText('modalTitle', data.title);
    setSafeText('modalCarName', data.title);
    setSafeText('modalEngine', data.engine);
    setSafeText('modalHP', data.hp);
    setSafeText('modalDrive', data.drive);
    setSafeText('modalTrans', data.trans);

    const imgEl = document.getElementById('modalImage');
    if (imgEl) imgEl.src = data.img;

    // Show the modal
    bootstrap.Modal.getOrCreateInstance(modalEl).show();
}

// --- Comparison Logic ---
function handleCompareSelection(cb) {
    const id = cb.getAttribute('data-id').trim();
    if (cb.checked) {
        if (selectedVehiclesPool.length >= 3) { 
            cb.checked = false; 
            return alert("Limit 3 vehicles."); 
        }
        selectedVehiclesPool.push({ 
            id, 
            title: cb.getAttribute('data-title'), 
            engine: cb.getAttribute('data-engine'), 
            hp: cb.getAttribute('data-hp'), 
            year: cb.getAttribute('data-year'), 
            img: cb.getAttribute('data-img') 
        });
    } else {
        selectedVehiclesPool = selectedVehiclesPool.filter(c => c.id !== id);
    }
    refreshComparisonHUDState();
}

window.clearComparisons = function() {
    selectedVehiclesPool = [];
    document.querySelectorAll('.compare-check').forEach(box => box.checked = false);
    refreshComparisonHUDState();
};

function refreshComparisonHUDState() {
    const count = document.getElementById('compareCount');
    const drawer = document.getElementById('compareDrawer');
    const launchBtn = document.getElementById('compareLaunchBtn');
    
    if (count) count.innerText = selectedVehiclesPool.length;
    
    if (drawer) {
        if (selectedVehiclesPool.length > 0) {
            drawer.classList.add('active');
            drawer.classList.remove('d-none');
        } else {
            drawer.classList.remove('active');
            drawer.classList.add('d-none');
        }
    }
    if (launchBtn) launchBtn.disabled = selectedVehiclesPool.length < 2;
}

window.launchComparisonModal = function() {
    ['compareRowImage', 'compareRowTitle', 'compareRowYear', 'compareRowEngine', 'compareRowHP'].forEach(id => {
        document.querySelectorAll(`#${id} th:not(:first-child), #${id} td:not(:first-child)`).forEach(el => el.remove());
    });

    const hpValues = selectedVehiclesPool.map(car => parseInt(car.hp.replace(/\D/g, '')) || 0);
    const maxHP = Math.max(...hpValues);

    selectedVehiclesPool.forEach(car => {
        const carHP = parseInt(car.hp.replace(/\D/g, '')) || 0;

        const isWinner = (carHP === maxHP && maxHP > 0);
        const highlightClass = isWinner ? 'bg-success text-white fw-bold' : '';

        document.getElementById('compareRowImage').insertAdjacentHTML('beforeend', `<th style="width: 25%;"><img src="${car.img}" class="img-fluid rounded" style="max-height:100px; object-fit:cover;"/></th>`);
        document.getElementById('compareRowTitle').insertAdjacentHTML('beforeend', `<td class="fw-bold">${car.title}</td>`);
        document.getElementById('compareRowYear').insertAdjacentHTML('beforeend', `<td>${car.year}</td>`);
        document.getElementById('compareRowEngine').insertAdjacentHTML('beforeend', `<td>${car.engine}</td>`);

        document.getElementById('compareRowHP').insertAdjacentHTML('beforeend', `<td class="${highlightClass}">${car.hp}</td>`);
    });

    bootstrap.Modal.getOrCreateInstance(document.getElementById('compareDisplayModal')).show();
};

window.showSuccessModal = function(message) {
    const msgEl = document.getElementById('successMessage');
    if (msgEl) msgEl.innerText = message;
    const modalEl = document.getElementById('successModal');
    if (modalEl) bootstrap.Modal.getOrCreateInstance(modalEl).show();
};