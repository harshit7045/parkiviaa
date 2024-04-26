document.addEventListener("DOMContentLoaded", function () {
  async function book() {
   
      var name = document.getElementById("name").value;
      var phone = document.getElementById("phone").value;
      var pincode = document.getElementById("pincode").value;
      var dateInput = document.getElementById("date").value;
      var timeInput = document.getElementById("time").value;
      
      // Extracting day, month, and year from date input
      var day = parseInt(dateInput.substring(0, 2), 10);
      var month = parseInt(dateInput.substring(3, 5), 10) - 1; // Months are 0-based in JavaScript Date object
      var year = parseInt(dateInput.substring(6), 10);
      
      // Extracting hours and minutes from time input
      var hours = parseInt(timeInput.substring(0, 2), 10);
      var minutes = parseInt(timeInput.substring(3), 10);
    
      // Creating a new Date object with the provided date and time
      var dateTime = new Date(year, month, day, hours, minutes);
      
     
  
  
    ///
    let data={
      pincode:pincode,
      date:dateTime,
      phone:phone,
      entry:false
    };
    try {
      const request = await fetch('http://localhost:8000/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
         
        },
        body: JSON.stringify(data)
      });

      
      console.log(data)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async function find() {
    try {
      let pincodeValue = document.getElementById("pincode").value;
      let data = {
        date: pincodeValue
      };
      console.log(data.date);
      
      const response = await fetch('http://localhost:8000/find', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      console.log('Response:', responseData.value[0].name);
      document.getElementById("lotName").innerText=responseData.value[0].name;
      document.getElementById("lotlocation").innerText=responseData.value[0].location;
      document.getElementById("lotPincode").innerText=responseData.value[0].pinCode;
    } catch (error) {
      console.error('Error sending request:', error);
    }
  }

  function debounce(func, delay) {
    let timeoutId;
    return function() {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, arguments);
      }, delay);
    };
  }

  const debouncedFind = debounce(find, 1000);

  function openPopup() {
    document.getElementById("popupContainer").style.display = "flex";
  }

  function closePopup() {
    document.getElementById("popupContainer").style.display = "none";
  }

  document.getElementById("sub").addEventListener("click", openPopup);
  document.getElementById("closeBtn").addEventListener("click", book);
  document.getElementById("closeBtn").addEventListener("click", closePopup);
  document.getElementById("pincode").addEventListener("keydown", debouncedFind);
});
