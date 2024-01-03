//deactivate lägga till button until all the fields are filled with information

document.addEventListener('DOMContentLoaded', function() {
    const addButton = document.querySelector('.btn-primary');
    const requiredInputs = document.querySelectorAll('[required]');

    function areALLInputsFilled() {
        let allFilled = true;

        requiredInputs.forEach(input => {
            if (input.value.trim() === '') {
                allFilled = false;
            }
        });
        return allFilled;
    }
    function updateButtonStatus() {
        addButton.disabled = !areALLInputsFilled();
    }

    requiredInputs.forEach(input => {
        input.addEventListener('input', updateButtonStatus);
    });
    updateButtonStatus();
});

//adding a car into the database

function addCar() {
    const make = document.getElementById("car-brand").value;
    const model = document.getElementById("car-model").value
    const licenseplate = document.getElementById("licenseplate").value
    const color = document.getElementById("car-color").value
}