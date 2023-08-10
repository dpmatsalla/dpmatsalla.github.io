// convert date & time in Brisbane timezone UTC+10
function formatDate(timestamp) {
  const options = {
    timeZone: 'Australia/Brisbane',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };
  const dateParts = new Date(timestamp).toLocaleDateString('en-US', options).split('/');
  const formattedDate = `${dateParts[2]}-${dateParts[0].padStart(2, '0')}-${dateParts[1].padStart(2, '0')}`;
  return formattedDate;
}
function formatTime(timestamp) {
  const options = {
    timeZone: 'Australia/Brisbane',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // Set to 24-hour
  };  
  const formattedTime = new Date(timestamp).toLocaleString('en-US', options);
  return formattedTime;
}

// Adjust tides for current and add timestamp
function adjustTides() {
    var tideTime;
    for (var i=0; i < tide_list.length; i++) {
        tideTime = Date.parse(tide_list[i].time_local);
        if (tide_list[i].tide === 'HIGH') { tideTime -= 0.5*3600*1000; }
        else { tideTime += 0.5*3600*1000; }

        tide_list[i].timestamp = tideTime;
        tide_list[i].time_local = new Date(tideTime).toISOString();
    }
}

// Function to group the tide information by date and separate low and high tides
function groupTidesByDate() {
    var tidesByDate = [];
    tide_list.forEach(function(tide) {
        var dateStr = formatDate(tide.timestamp);
        var timeStr = formatTime(tide.timestamp);
        if (tide.tide == 'HIGH') { tideStr = "↑"; }
        else { tideStr = "↓"; }
   
        tidesByDate.push({ date: dateStr, event: timeStr+" "+tideStr+" "+tide.height.toFixed(2)+"m" });
    });
    return tidesByDate;
}

// return height for a timestamp
function tideHeight(t) {
    var i = 0;
    while (tide_list[i].timestamp < t) {
        i++;
    }
    var t0 = tide_list[i-1].timestamp;
    var t1 = tide_list[i].timestamp;
    var h0 = tide_list[i-1].height;
    var h1 = tide_list[i].height;
    return (h0-h1)/2*Math.cos(Math.PI*(t0-t)/(t0-t1)) + (h0+h1)/2;
}

// Generate calendar and events
function generateCalendar() {
    const tableBody = document.querySelector("#calendar tbody");
    let currentDate = new Date();
    const now = currentDate.getTime();  //in timestamp
    currentDate.setDate(currentDate.getDate() - currentDate.getDay());  //set to the last Sunday
    
    // Get tides
    const tides = groupTidesByDate(); // { date: "2023-08-01), event: "5:21: LOW 0.21 m" }
    
    // Get today's date in "YYYY-MM-DD"
    const todayDate = formatDate(now);

    // Generate 10 weeks of calendar
    for (let week = 0; week < 10; week++) {
        const row = document.createElement("tr");

        for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
            const cell = document.createElement("td");
            const cellDate = formatDate(currentDate.getTime()); // Format: "YYYY-MM-DD"
            cell.textContent = currentDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    
            // Update tides on this date
            var matchingEvents = tides.filter(event => event.date === cellDate);
            if (matchingEvents.length > 0) {
                const eventsContainer = document.createElement("div");
                matchingEvents.forEach(eventInfo => {
                    const eventElement = document.createElement("div");
                    eventElement.textContent = eventInfo.event;
                    if (eventInfo.event.includes('↑')) { eventElement.classList.add('hightide'); }
                    else { eventElement.classList.add('lowtide'); }
                    eventsContainer.appendChild(eventElement);
                });
                cell.appendChild(eventsContainer);
            }

            // Check if there are any events on this date
            matchingEvents = events.filter(event => event.date === cellDate);
            if (matchingEvents.length > 0) {
                const eventsContainer = document.createElement("div");
                matchingEvents.forEach(eventInfo => {
                    const eventElement = document.createElement("div");
                    eventElement.textContent = eventInfo.event;
                    eventsContainer.appendChild(eventElement);
                });
                cell.appendChild(eventsContainer);
            }
            
            // Add today's date style
            if (cellDate === todayDate) {
                cell.classList.add("today");
            }
    
            row.appendChild(cell);
            currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
        }
        tableBody.appendChild(row);
    }
}

adjustTides();
generateCalendar();
