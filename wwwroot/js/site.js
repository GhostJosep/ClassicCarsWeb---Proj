let selectedVehiclesPool = [];

document.addEventListener('DOMContentLoaded', function () {
    document.body.addEventListener('change', function (event) {
        if (event.target && event.target.classList.contains('compare-check')) {
            handleCompareSelection(event.target);
        }
    });

    document.body.addEventListener('click', function (event) {
        if (event.target && event.target.classList.contains('compare-check')) {
            event.stopPropagation();
            return;
        }
        
        const checkboxContainer = event.target.closest('.compare-checkbox-container');
        if (checkboxContainer) {
            event.stopPropagation();
            return;
        }

        const cardElement = event.target.closest('.classic-card-trigger');
        if (cardElement) {
            launchQuickViewModal(cardElement);
        }
    });
});

function launchQuickViewModal(cardTrigger) {
    document.getElementById('modalTitle').innerText = cardTrigger.getAttribute('data-title');
    document.getElementById('modalCarName').innerText = cardTrigger.getAttribute('data-title');
    document.getElementById('modalImage').src = cardTrigger.getAttribute('data-img');
    document.getElementById('modalEngine').innerText = cardTrigger.getAttribute('data-engine');
    document.getElementById('modalHP').innerText = cardTrigger.getAttribute('data-hp');
    document.getElementById('modalFact').innerText = cardTrigger.getAttribute('data-fact');

    const modalTarget = new bootstrap.Modal(document.getElementById('quickViewModal'));
    modalTarget.show();
}

function handleCompareSelection(checkboxElement) {
    const vehicleId = checkboxElement.getAttribute('data-id').trim();
    
    if (checkboxElement.checked) {
        if (selectedVehiclesPool.length >= 3) {
            checkboxElement.checked = false;
            alert("The Workbench comparison deck is limited to a maximum of 3 configurations simultaneously.");
            return;
        }
        
        const exists = selectedVehiclesPool.some(car => car.id === vehicleId);
        if (!exists) {
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
    
    if (selectedVehiclesPool.length > 0) {
        drawer.classList.add('active');
    } else {
        drawer.classList.remove('active');
    }
    
    actionBtn.disabled = selectedVehiclesPool.length < 2;
}

function clearComparisons() {
    selectedVehiclesPool = [];
    document.querySelectorAll('.compare-check').forEach(box => box.checked = false);
    refreshComparisonHUDState();
}

function launchComparisonModal() {
    document.querySelectorAll('#compareRowImage th:not(:first-child)').forEach(el => el.remove());
    document.querySelectorAll('#compareRowTitle td:not(:first-child)').forEach(el => el.remove());
    document.querySelectorAll('#compareRowYear td:not(:first-child)').forEach(el => el.remove());
    document.querySelectorAll('#compareRowEngine td:not(:first-child)').forEach(el => el.remove());
    document.querySelectorAll('#compareRowHP td:not(:first-child)').forEach(el => el.remove());
    
    selectedVehiclesPool.forEach(car => {
        document.getElementById('compareRowImage').insertAdjacentHTML('beforeend', 
            `<th style="width: 25%;"><img src="${car.img}" class="img-fluid rounded" style="max-height:110px; object-fit:cover; width:100%; border:1px solid #444;" onerror="this.src='https://placehold.co/600x400/2b2b2b/eeeeee?text=Classic+Car'"/></th>`);
        document.getElementById('compareRowTitle').insertAdjacentHTML('beforeend', `<td class="fw-bold text-white">${car.title}</td>`);
        document.getElementById('compareRowYear').insertAdjacentHTML('beforeend', `<td><span class="badge bg-danger">${car.year}</span></td>`);
        document.getElementById('compareRowEngine').insertAdjacentHTML('beforeend', `<td class="text-secondary small">${car.engine}</td>`);
        document.getElementById('compareRowHP').insertAdjacentHTML('beforeend', `<td class="text-warning fw-semibold">${car.hp} HP</td>`);
    });
    
    const targetModal = new bootstrap.Modal(document.getElementById('compareDisplayModal'));
    targetModal.show();
}

let currentInsightIndex = 0;
const totalInsightSlides = 3;

function switchInsightSlideNext() {
    const currentSlide = document.getElementById(`slide-${currentInsightIndex}`);
    const currentDot = document.getElementById(`dot-${currentInsightIndex}`);
    if (currentSlide) currentSlide.style.display = 'none';
    if (currentDot) currentDot.style.backgroundColor = '#6c757d';
    
    currentInsightIndex = (currentInsightIndex + 1) % totalInsightSlides;
    
    const nextSlide = document.getElementById(`slide-${currentInsightIndex}`);
    const nextDot = document.getElementById(`dot-${currentInsightIndex}`);
    if (nextSlide) nextSlide.style.display = 'block';
    if (nextDot) nextDot.style.backgroundColor = '#dc3545';
}

function manuallyJumpToSlide(targetSlideIndex) {
    clearInterval(insightRotationTimerInstance);
    
    const currentSlide = document.getElementById(`slide-${currentInsightIndex}`);
    const currentDot = document.getElementById(`dot-${currentInsightIndex}`);
    if (currentSlide) currentSlide.style.display = 'none';
    if (currentDot) currentDot.style.backgroundColor = '#6c757d';
    
    currentInsightIndex = targetSlideIndex;
    
    const nextSlide = document.getElementById(`slide-${currentInsightIndex}`);
    const nextDot = document.getElementById(`dot-${currentInsightIndex}`);
    if (nextSlide) nextSlide.style.display = 'block';
    if (nextDot) nextDot.style.backgroundColor = '#dc3545';
    
    insightRotationTimerInstance = setInterval(switchInsightSlideNext, 6000);
}

let insightRotationTimerInstance = setInterval(switchInsightSlideNext, 6000);