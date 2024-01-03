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
    const year = document.getElementById("car-model-year").value
    const mileage = document.getElementById("miles-traveled").value

    fetch('http://localhost:3000/api/cars', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            make,
            model,
            licenseplate,
            color,
            year,
            mileage,
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(' HTTP error! Status: ${response.status}');
        }
        console.log('Car added successfully');
    })
    .catch(error => console.error('Error', error));
}