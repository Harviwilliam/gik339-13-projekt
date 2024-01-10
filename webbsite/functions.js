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


    //adding a confirmation modal before submitting
    addButton.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default form submission behavior

        if (areALLInputsFilled()) {
            // Show confirmation modal
            const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
            confirmationModal.show();
        }
    });
});
//adding a car into the database

function addCar() {
    const make = document.getElementById("car-brand").value;
    const model = document.getElementById("car-model").value
    const licenseplate = document.getElementById("licenseplate").value
    const color = document.getElementById("car-color").value
    const year = document.getElementById("car-model-year").value
    const mileage = document.getElementById("miles-traveled").value

    console.log("Car details:", { make, model, licenseplate, color, year, mileage }); // Add this line for debugging

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
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        console.log('Car added successfully');
    })
    .catch(error => console.error('Error', error));
};

let retrievedRegValue = " ";
function retrieveRegValue() {
    const chooseAdjCar = document.getElementById("car-adj-reg").value;
    retrievedRegValue = chooseAdjCar;
    return retrievedRegValue;
}

function adjCar() {
    const chooseAdjCar = retrievedRegValue;

    const make = document.getElementById("change-car-brand").value;
    const model = document.getElementById("change-car-model").value;
    const licenseplate = document.getElementById("change-car-reg").value;
    const color = document.getElementById("change-car-color").value;
    const year = document.getElementById("change-car-year").value;
    const mileage = document.getElementById("change-car-miles").value;

    

    // Find car with reg number
    fetch('http://localhost:3000/api/cars', {
        method: 'GET',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(cars => {
        const carToAdj = cars.find(car => car.licenseplate === chooseAdjCar);
        if (!carToAdj) {
            throw new Error('Car not found');
        }

        console.log('Car to update:', carToAdj);

        const updateData = {};
        updateData.make = make.trim() !== '' ? make : carToAdj.make;
        updateData.model = model.trim() !== '' ? model : carToAdj.model;
        updateData.licenseplate = licenseplate.trim() !== '' ? licenseplate : carToAdj.licenseplate;
        updateData.color = color.trim() !== '' ? color : carToAdj.color;
        updateData.year = year.trim() !== '' ? year : carToAdj.year;
        updateData.mileage = mileage.trim() !== '' ? mileage : carToAdj.mileage;

        console.log('Update data:', updateData);

        if (Object.keys(updateData).length > 0) {
            fetch(`http://localhost:3000/api/cars/${carToAdj.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                console.log('Car updated successfully');
            })
            .catch(error => console.error('Error during PUT request:', error));
        } else {
            console.log('No data to update');
        }
    })
    .catch(error => console.error('Error during GET request:', error));
}


// removing car function

    function deleteCar() {
    const carToRemove = document.getElementById("remove-car-reg").value;
  

    fetch('http://localhost:3000/api/cars', {
        method: 'GET',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(cars => {
        const carToDelete = cars.find(car => car.licenseplate === carToRemove);
        if (!carToDelete) {
            throw new Error('Car not found');
        }

        return fetch(`http://localhost:3000/api/cars/${carToDelete.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        console.log('Car deleted successfully');
        // Optionally, perform any actions after successful deletion
    })
    .catch(error => console.error('Error', error));
}



// Function to fetch and display all cars
function getCars() {
    fetch('http://localhost:3000/api/cars')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(cars => {
            // Clear previous list if any
            const carListContainer = document.getElementById('carListContainer');
            if (carListContainer) {
                carListContainer.innerHTML = '';
            }

            // Create a new list container
            const newListContainer = document.createElement('div');
            newListContainer.id = 'carListContainer';

            // Create a list and append each car as a list item
            const carList = document.createElement('ul');
            cars.forEach(car => {
                const listItem = document.createElement('li');

                // Set text content
                listItem.textContent = `Make: ${car.make}, Model: ${car.model}, License Plate: ${car.licenseplate}, Year: ${car.year}, Mileage: ${car.mileage}`;

                // Set background color based on the color of the car
                listItem.style.backgroundColor = car.color || 'white';

                // Add margin to each list item
                listItem.style.marginBottom = '10px';

                carList.appendChild(listItem);
            });

            // Append the list to the new container
            newListContainer.appendChild(carList);

            // Append the new container to the body
            document.body.appendChild(newListContainer);
        })
        .catch(error => console.error('Error fetching cars', error));
}



function showCarByRegistration() {
    const registrationInput = document.getElementById('showInfoForCar').value;
    const registration = registrationInput.trim();

    if (!registration) {
        alert('Please enter a registration number.');
        return;
    }

    fetch(`http://localhost:3000/api/cars/${encodeURIComponent(registration)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(car => {
            console.log('Car fetched successfully:', car);
            // Display information about the car
            alert(`Make: ${car.make}\nModel: ${car.model}\nLicense Plate: ${car.licenseplate}\nYear: ${car.year}\nMileage: ${car.mileage}\nColor: ${car.color}`);
        })
        .catch(error => {
            console.error('Error fetching car by registration', error);
            alert('Car not found or an error occurred.');
        });

    // Clear the input field after processing
    document.getElementById('showInfoForCar').value = '';
}




