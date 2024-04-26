// Data for the pie chart (values and colors)
function pie(lotdata) {
    console.log(lotdata)
    let occupied=(lotdata.capacity/lotdata.tolalCapicity)*100;
    const data = [
        { value: occupied, color: '#FF6384' },
        { value: 100-occupied, color: '#36A2EB' },
    ];

    // Get canvas element and context
    const canvas = document.getElementById('pieChart');
    const ctx = canvas.getContext('2d');

    // Set the center of the pie chart
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY);

    // Draw the pie chart
    let startAngle = 0;
    data.forEach(slice => {
        const sliceAngle = (slice.value / getTotal()) * 2 * Math.PI;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
        ctx.fillStyle = slice.color;
        ctx.fill();
        startAngle += sliceAngle;
    });

    // Function to calculate total value of all slices
    function getTotal() {
        return data.reduce((total, slice) => total + slice.value, 0);
    }
}

let data;

function closeLoginForm() {
    console.log('close form');
    var submitButton = document.getElementById("parkingLotSignin");
    var loginForm = document.getElementById("lookOutForm");

    submitButton.addEventListener("click", async function (event) {
        event.preventDefault(); // Prevent the default form submission behavior

        let data = await login();

        if (data.login == true) {
            loginForm.style.display = "none";
            pie(data.lotd);
            console.log(data.lotd);
            let lotdata=data.lotd;
            document.getElementById("pin").innerHTML=lotdata.pinCode;
            document.getElementById("locat").innerHTML=lotdata.location;
            document.getElementById("cap").innerHTML=lotdata.tolalCapicity;
            setInterval(await closeLoginFormrepeated, 2000);
        }
    });
}

async function closeLoginFormrepeated() {
    console.log('close form repeated');

    let newData = await loginrepeated(data);

    if (newData.login == true) {
       
        pie(newData.lotd);
    }
}

async function login() {
    let email = document.getElementById("lot_email").value;
    let password = document.getElementById("password").value;
    console.log("Email:", email);
    console.log("Password:", password);
    data = {
        em: email,
        pass: password
    };

    try {
        const response = await fetch('http://localhost:8000/admin', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
               
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        //console.log("Response:", data);
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function loginrepeated(data) {
    let email = data.em;
    let password = data.pass;
    console.log("Email:", email);
    console.log("Password:", password);

    try {
        const response = await fetch('http://localhost:8000/admin', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                
            },
            body: JSON.stringify({ email, password })
        });

        const newData = await response.json();
        
        return newData;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    closeLoginForm();
});

