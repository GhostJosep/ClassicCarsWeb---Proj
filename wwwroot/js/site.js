let selectedVehiclesPool = [];
let carDataMap = [];

document.addEventListener('DOMContentLoaded', function () {
    // 1. Fetch data from Controller
    fetch('/api/Data/GetCars')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(data => { 
            carDataMap = data; 
            console.log("Data loaded successfully.");
            // Start the rotation only after data is ready
            startGarageInsightsCycle(); 
        })
        .catch(err => console.error("Data Load Error:", err));

    // 2. Event Listeners
    document.body.addEventListener('change', (e) => {
        if (e.target.classList.contains('compare-check')) handleCompareSelection(e.target);
    });

    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('test-drive-btn')) return;
        if (e.target.closest('.compare-checkbox-container')) {
            e.stopPropagation();
            return;
        }
        const card = e.target.closest('.classic-card-trigger');
        if (card) launchQuickViewModal(card);
    });
});

// --- Garage Insights Carousel ---
function startGarageInsightsCycle() {
    const categoryEl = document.getElementById('insightCategory');
    const titleEl = document.getElementById('insightTitle');
    
    if (!categoryEl || !titleEl || carDataMap.length === 0) return;

    let index = 0;
    setInterval(() => {
        index = (index + 1) % carDataMap.length;
        const car = carDataMap[index];
        categoryEl.innerText = "FEATURED VEHICLE";
        titleEl.innerText = car.Title;
    }, 5000);
}

// --- Quick View Modal ---
function launchQuickViewModal(cardTrigger) {
    if (!carDataMap || carDataMap.length === 0) return;

    const title = cardTrigger.getAttribute('data-title');
    const car = carDataMap.find(c => c.Title === title);

    if (!car) return;

    const modal = document.getElementById('quickViewModal');
    modal.querySelector('#modalTitle').innerText = car.Title;
    modal.querySelector('#modalCarName').innerText = car.Title;
    modal.querySelector('#modalImage').src = car.ImageUrl;
    
    modal.querySelector('#modalEngine').innerText = car.Engine || "N/A";
    modal.querySelector('#modalHP').innerText = car.Horsepower || "N/A";
    modal.querySelector('#modalDrive').innerText = car.DriveType || "N/A";
    modal.querySelector('#modalTrans').innerText = car.Transmission || "N/A";

    bootstrap.Modal.getOrCreateInstance(modal).show();
}

// --- Booking & Comparison Logic ---
window.openTestDriveModal = function(event, carTitle) {
    if (event) event.stopPropagation();
    const modalEl = document.getElementById('testDriveModal');
    document.getElementById('testDriveModalTitle').innerText = "Schedule Test Drive: " + carTitle;
    document.getElementById('testDriveCarTitle').value = carTitle;
    document.getElementById('testDriveForm').style.display = 'block';
    document.getElementById('successMessage').style.display = 'none';
    bootstrap.Modal.getOrCreateInstance(modalEl).show();
};

window.handleBooking = function(event) {
    event.preventDefault();
    document.getElementById('testDriveForm').style.display = 'none';
    document.getElementById('successMessage').style.display = 'block';
    setTimeout(() => bootstrap.Modal.getInstance(document.getElementById('testDriveModal')).hide(), 2000);
};

window.clearComparisons = function() {
    selectedVehiclesPool = [];
    document.querySelectorAll('.compare-check').forEach(box => box.checked = false);
    refreshComparisonHUDState();
};

function handleCompareSelection(cb) {
    const id = cb.getAttribute('data-id').trim();
    if (cb.checked) {
        if (selectedVehiclesPool.length >= 3) {
            cb.checked = false;
            return alert("Limit 3 vehicles.");
        }
        if (!selectedVehiclesPool.some(c => c.id === id)) {
            selectedVehiclesPool.push({ id, title: cb.getAttribute('data-title'), engine: cb.getAttribute('data-engine'), hp: cb.getAttribute('data-hp'), year: cb.getAttribute('data-year'), img: cb.getAttribute('data-img') });
        }
    } else {
        selectedVehiclesPool = selectedVehiclesPool.filter(c => c.id !== id);
    }
    refreshComparisonHUDState();
}

function refreshComparisonHUDState() {
    const drawer = document.getElementById('compareDrawer');
    const count = document.getElementById('compareCount');
    const btn = document.getElementById('compareLaunchBtn');
    if (!drawer || !count || !btn) return;
    count.innerText = selectedVehiclesPool.length;
    drawer.classList.toggle('active', selectedVehiclesPool.length > 0);
    btn.disabled = selectedVehiclesPool.length < 2;
}

window.launchComparisonModal = function() {
    ['compareRowImage', 'compareRowTitle', 'compareRowYear', 'compareRowEngine', 'compareRowHP'].forEach(id => {
        document.querySelectorAll(`#${id} th:not(:first-child), #${id} td:not(:first-child)`).forEach(el => el.remove());
    });
    selectedVehiclesPool.forEach(car => {
        document.getElementById('compareRowImage').insertAdjacentHTML('beforeend', `<th style="width: 25%;"><img src="${car.img}" class="img-fluid rounded"/></th>`);
        document.getElementById('compareRowTitle').insertAdjacentHTML('beforeend', `<td class="fw-bold">${car.title}</td>`);
        document.getElementById('compareRowYear').insertAdjacentHTML('beforeend', `<td>${car.year}</td>`);
        document.getElementById('compareRowEngine').insertAdjacentHTML('beforeend', `<td>${car.engine}</td>`);
        document.getElementById('compareRowHP').insertAdjacentHTML('beforeend', `<td>${car.hp}</td>`);
    });
    bootstrap.Modal.getOrCreateInstance(document.getElementById('compareDisplayModal')).show();
};