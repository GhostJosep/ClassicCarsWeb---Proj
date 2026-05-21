let selectedVehiclesPool = [];

document.addEventListener('DOMContentLoaded', function () {
    // Compare Checkbox handling
    document.body.addEventListener('change', function (event) {
        if (event.target && event.target.classList.contains('compare-check')) {
            handleCompareSelection(event.target);
        }
    });

    // Global Click Listener (The source of your QuickView interference)
    document.body.addEventListener('click', function (event) {
        // 1. BLOCKING LOGIC: If user clicked a Test Drive button, ignore this listener
        if (event.target.classList.contains('test-drive-btn')) return;

        // 2. Comparison drawer exclusion
        if (event.target && (event.target.classList.contains('compare-check') || event.target.closest('.compare-checkbox-container'))) {
            event.stopPropagation();
            return;
        }

        // 3. QuickView trigger
        const cardElement = event.target.closest('.classic-card-trigger');
        if (cardElement) launchQuickViewModal(cardElement);
    });
});

// --- Test Drive Logic ---
window.openTestDriveModal = function(event, carTitle) {
    // Stop the click from bubbling up to the card container
    if (event) {
        event.stopPropagation();
    }

    // Force hide any open QuickView
    const quickViewEl = document.getElementById('quickViewModal');
    if (quickViewEl) {
        const modal = bootstrap.Modal.getInstance(quickViewEl);
        if (modal) modal.hide();
    }

    const modalEl = document.getElementById('testDriveModal');
    const titleDisp = document.getElementById('testDriveModalTitle');
    const hiddenInp = document.getElementById('testDriveCarTitle');
    const form = document.getElementById('testDriveForm');
    const success = document.getElementById('successMessage');

    if (modalEl && titleDisp && hiddenInp) {
        form.style.display = 'block';
        success.style.display = 'none';
        titleDisp.innerText = "Schedule Test Drive: " + carTitle;
        hiddenInp.value = carTitle;
        bootstrap.Modal.getOrCreateInstance(modalEl).show();
    }
};

window.handleBooking = function(event) {
    event.preventDefault();
    document.getElementById('testDriveForm').style.display = 'none';
    document.getElementById('successMessage').style.display = 'block';
    setTimeout(() => {
        const modal = bootstrap.Modal.getInstance(document.getElementById('testDriveModal'));
        if (modal) modal.hide();
    }, 2000);
};

// --- Quick View Logic ---
function launchQuickViewModal(cardTrigger) {
    document.getElementById('modalTitle').innerText = cardTrigger.getAttribute('data-title');
    document.getElementById('modalCarName').innerText = cardTrigger.getAttribute('data-title');
    document.getElementById('modalImage').src = cardTrigger.getAttribute('data-img');
    const fact = document.getElementById('modalFact');
    if (fact) fact.innerText = cardTrigger.getAttribute('data-fact') || "Details available soon.";
    bootstrap.Modal.getOrCreateInstance(document.getElementById('quickViewModal')).show();
}

// --- Comparison Logic ---
window.clearComparisons = function() {
    selectedVehiclesPool = [];
    document.querySelectorAll('.compare-check').forEach(box => box.checked = false);
    refreshComparisonHUDState();
};

function handleCompareSelection(checkboxElement) {
    const vehicleId = checkboxElement.getAttribute('data-id').trim();
    if (checkboxElement.checked) {
        if (selectedVehiclesPool.length >= 3) {
            checkboxElement.checked = false;
            alert("Comparison limited to 3 vehicles.");
            return;
        }
        if (!selectedVehiclesPool.some(car => car.id === vehicleId)) {
            selectedVehiclesPool.push({
                id: vehicleId,
                title: checkboxElement.getAttribute('data-title'),
                engine: checkboxElement.getAttribute('data-engine'),
                hp: checkboxElement.getAttribute('data-hp'),
                year: checkboxElement.getAttribute('data-year'),
                img: checkboxElement.getAttribute('data-img')
            });
        }
    } else {
        selectedVehiclesPool = selectedVehiclesPool.filter(car => car.id.trim() !== vehicleId);
    }
    refreshComparisonHUDState();
}

function refreshComparisonHUDState() {
    const drawer = document.getElementById('compareDrawer');
    const countLabel = document.getElementById('compareCount');
    const actionBtn = document.getElementById('compareLaunchBtn');
    if (!drawer || !countLabel || !actionBtn) return;
    countLabel.innerText = selectedVehiclesPool.length;
    drawer.classList.toggle('active', selectedVehiclesPool.length > 0);
    actionBtn.disabled = selectedVehiclesPool.length < 2;
}

window.launchComparisonModal = function() {
    const rows = ['compareRowImage', 'compareRowTitle', 'compareRowYear', 'compareRowEngine', 'compareRowHP'];
    rows.forEach(id => {
        document.querySelectorAll(`#${id} th:not(:first-child), #${id} td:not(:first-child)`).forEach(el => el.remove());
    });
    selectedVehiclesPool.forEach(car => {
        document.getElementById('compareRowImage').insertAdjacentHTML('beforeend', `<th style="width: 25%;"><img src="${car.img}" class="img-fluid rounded" style="max-height:110px; object-fit:cover; width:100%;"/></th>`);
        document.getElementById('compareRowTitle').insertAdjacentHTML('beforeend', `<td class="fw-bold text-white">${car.title}</td>`);
        document.getElementById('compareRowYear').insertAdjacentHTML('beforeend', `<td><span class="badge bg-danger">${car.year}</span></td>`);
        document.getElementById('compareRowEngine').insertAdjacentHTML('beforeend', `<td class="text-secondary small">${car.engine}</td>`);
        document.getElementById('compareRowHP').insertAdjacentHTML('beforeend', `<td class="text-warning fw-semibold">${car.hp} HP</td>`);
    });
    bootstrap.Modal.getOrCreateInstance(document.getElementById('compareDisplayModal')).show();
};