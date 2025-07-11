# SmartComfort
# Alhamdulillah, Added in Laptop VSCode

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SmartComfort Threshold Monitoring</title>
    <style>
        body { font-family: Arial; background-color: #f2f2f2; padding: 20px; }
        .container { margin-bottom: 20px; }
        input, button { padding: 10px; margin: 5px; }
        .report { margin-top: 20px; color: green; font-weight: bold; }
        #normalMessage { margin-top: 20px; color: blue; font-weight: normal; }
    </style>
</head>
<body>
    <h1>SmartComfort Monitoring</h1>

    <h2>Temperature (°C)</h2>
    <div class="container">
        <label>Lower Temperature (°C): <input type="number" id="lowerTemp" value="18"></label>
        <label>Higher Temperature (°C): <input type="number" id="higherTemp" value="24"></label>
        <label>Threshold (°C): <input type="number" id="tempThreshold" value="0.5"></label>
    </div>

    <h2>Humidity (%)</h2>
    <div class="container">
        <label>Lower Humidity (%): <input type="number" id="lowerHumidity" value="40"></label>
        <label>Higher Humidity (%): <input type="number" id="higherHumidity" value="60"></label>
        <label>Threshold (%): <input type="number" id="humidityThreshold" value="2"></label>
    </div>

    <h2>Ambient Light (lux)</h2>
    <div class="container">
        <label>Lower Light (lux): <input type="number" id="lowerLux" value="100"></label>
        <label>Higher Light (lux): <input type="number" id="higherLux" value="500"></label>
        <label>Threshold (lux): <input type="number" id="luxThreshold" value="15"></label>
    </div>

    <div>
        <button onclick="startMonitoring()">Start Monitoring</button>
        <button onclick="pauseMonitoring()">Pause Monitoring</button>
        <button onclick="stopMonitoring()">Stop Monitoring</button>
    </div>

    <div id="tempReport" class="report"></div>
    <div id="humidityReport" class="report"></div>
    <div id="luxReport" class="report"></div>

    <div id="normalMessage">Monitoring not started.</div>

    <script>
        let intervalId = null;
        let paused = false;
        let previousData = { temp: null, humidity: null, lux: null };
        const dataPoints = { temp: [], humidity: [], lux: [] };

        async function fetchData() {
            try {
                const response = await fetch('http://10.202.14.3:5000/sensor-data');
                const data = await response.json();
                return {
                    temperature: parseFloat(data.temperature),
                    humidity: parseFloat(data.humidity),
                    lux: parseFloat(data.lux)
                };
            } catch (error) {
                console.error('Error fetching data:', error);
                return null;
            }
        }

        function calculateAverage(arr) {
            return arr.reduce((a, b) => a + b, 0) / arr.length;
        }

        async function monitor() {
            const data = await fetchData();
            if (!data) return;

            ['temp', 'humidity', 'lux'].forEach(key => {
                dataPoints[key].push(data[key === 'temp' ? 'temperature' : key]);
                if (dataPoints[key].length >= 3) {
                    const currentAvg = calculateAverage(dataPoints[key]);
                    const previous = previousData[key];
                    checkAndReport(key, currentAvg, previous);
                    previousData[key] = currentAvg;
                    dataPoints[key] = [];
                }
            });
        }

        function checkAndReport(type, current, previous) {
            const lower = parseFloat(document.getElementById(`lower${capitalize(type)}`).value);
            const higher = parseFloat(document.getElementById(`higher${capitalize(type)}`).value);
            const threshold = parseFloat(document.getElementById(`${type}Threshold`).value);
            const unit = type === 'temp' ? '°C' : type === 'humidity' ? '%' : 'lux';

            const diff = previous !== null ? Math.abs(current - previous) : 0;

            const reportId = `${type}Report`;

            if (current < lower || current > higher || diff >= threshold) {
                document.getElementById(reportId).innerText = `${capitalize(type)} Alert: ${current.toFixed(2)} ${unit}, change of ${diff.toFixed(2)} ${unit}`;
            } else {
                document.getElementById(reportId).innerText = `${capitalize(type)} is within normal range.`;
            }
        }

        function capitalize(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }

        function startMonitoring() {
            if (intervalId === null || paused) {
                paused = false;
                document.getElementById('normalMessage').innerText = 'Monitoring started.';
                monitor();
                intervalId = setInterval(monitor, 60000);
            }
        }

        function pauseMonitoring() {
            if (intervalId !== null) {
                clearInterval(intervalId);
                paused = true;
                document.getElementById('normalMessage').innerText = 'Monitoring paused.';
            }
        }

        function stopMonitoring() {
            if (intervalId !== null) {
                clearInterval(intervalId);
                intervalId = null;
                paused = false;
                previousData = { temp: null, humidity: null, lux: null };
                document.getElementById('normalMessage').innerText = 'Monitoring stopped.';
                ['tempReport', 'humidityReport', 'luxReport'].forEach(id => document.getElementById(id).innerText = '');
            }
        }
    </script>
</body>
</html>
v.1
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Threshold Setup with Range</title>
    <style>
        body { font-family: Arial; background-color: #f2f2f2; padding: 20px; }
        .container { margin-bottom: 20px; }
        input, button { padding: 10px; margin: 5px; }
        #report1, #report2, #humidityReport1, #humidityReport2, #lightReport1, #lightReport2 { margin-top: 20px; color: green; font-weight: bold; }
        #normalMessage { margin-top: 20px; color: blue; font-weight: normal; }
    </style>
</head>
<body>
    <h1>SmartComfort</h1>

    <!-- First Range and Threshold (Existing) for Temperature -->
     <h2>Temperature</h2>
    <div class="container">
        <label>Lower Temperature 1 (°C): <input type="number" id="lowerRange1" value="18"></label>
        <label>Higher Temperature 1 (°C): <input type="number" id="higherRange1" value="22"></label>
        <label>Threshold 1 (°C): <input type="number" id="threshold1" value="0.05"></label>
        <button id="monitorButton" onclick="startMonitoring()">Start Monitoring</button>
    </div>

    <!-- Second Range and Threshold (New) for Temperature -->
    <div class="container">
        <label>Lower Temperature 2 (°C): <input type="number" id="lowerRange2" value="20"></label>
        <label>Higher Temperature 2 (°C): <input type="number" id="higherRange2" value="24"></label>
        <label>Threshold 2 (°C): <input type="number" id="threshold2" value="0.5"></label>
    </div>

    <h2>Humidity</h2>
    <!-- First Range and Threshold for Humidity -->
    <div class="container">
        <label>Lower Humidity 1 (%): <input type="number" id="lowerHumidity1" value="80"></label>
        <label>Higher Humidity 1 (%): <input type="number" id="higherHumidity1" value="120"></label>
        <label>Threshold 1 (%): <input type="number" id="thresholdHumidity1" value="5"></label>
    </div>

    <!-- Second Range and Threshold for Humidity -->
    <div class="container">
        <label>Lower Humidity 2 (%): <input type="number" id="lowerHumidity2" value="100"></label>
        <label>Higher Humidity 2 (%): <input type="number" id="higherHumidity2" value="120"></label>
        <label>Threshold 2 (%): <input type="number" id="thresholdHumidity2" value="10"></label>
    </div>

    <h2>Light</h2>
    <!-- First Range and Threshold for Ambient Light -->
    <div class="container">
        <label>Lower Light 1 (%): <input type="number" id="lowerLight1" value="90"></label>
        <label>Higher Light 1 (%): <input type="number" id="higherLight1" value="120"></label>
        <label>Threshold 1 (%): <input type="number" id="thresholdLight1" value="5"></label>
    </div>

    <!-- Second Range and Threshold for Ambient Light -->
    <div class="container">
        <label>Lower Light 2 (%): <input type="number" id="lowerLight2" value="100"></label>
        <label>Higher Light 2 (%): <input type="number" id="higherLight2" value="120"></label>
        <label>Threshold 2 (%): <input type="number" id="thresholdLight2" value="10"></label>
    </div>

    <!-- Separate Outputs for both Range 1 and Range 2 -->
    <div id="report1"></div> <!-- Output for Range 1 (Temperature) -->
    <div id="report2"></div> <!-- Output for Range 2 (Temperature) -->

    <div id="humidityReport1"></div> <!-- Output for Range 1 (Humidity) -->
    <div id="humidityReport2"></div> <!-- Output for Range 2 (Humidity) -->

    <div id="lightReport1"></div> <!-- Output for Range 1 (Ambient Light) -->
    <div id="lightReport2"></div> <!-- Output for Range 2 (Ambient Light) -->

    <div id="normalMessage">No changes detected yet...</div> <!-- Normal Message Section -->

    <script>
        let previousAvg1 = null;
        let previousAvg2 = null;
        let previousAvgHumidity1 = null;
        let previousAvgHumidity2 = null;
        let previousAvgLight1 = null;
        let previousAvgLight2 = null;

        const dataPoints1 = [];
        const dataPoints2 = [];
        const dataPointsHumidity1 = [];
        const dataPointsHumidity2 = [];
        const dataPointsLight1 = [];
        const dataPointsLight2 = [];

        // Function to fetch data from the API
        async function fetchData() {
            try {
                console.log("Fetching data...");
                const response = await fetch('http://10.202.14.3:5000/sensor-data');
                const data = await response.json();
                return {
                    temperature: parseFloat(data.temperature),
                    humidity: parseFloat(data.humidity),
                    lux: parseFloat(data.lux)
                }; // Return all the necessary sensor data
            } catch (error) {
                console.error('Error fetching data:', error);
                return null;
            }
        }

        // Function to calculate the average of an array
        function calculateAverage(arr) {
            return arr.reduce((a, b) => a + b, 0) / arr.length;
        }

        // Function to monitor and check conditions
        async function monitor() {
            const data = await fetchData(); // Fetch data from API
            if (data === null) return;

            const { temperature, humidity, lux } = data; // Extract temperature, humidity, and lux values

            // Collect temperature for Range 1
            dataPoints1.push(temperature);
            if (dataPoints1.length === 3) {
                const currentAvg1 = calculateAverage(dataPoints1);
                if (previousAvg1 !== null) {
                    const difference1 = Math.abs(currentAvg1 - previousAvg1);
                    const lower1 = parseFloat(document.getElementById('lowerRange1').value);
                    const higher1 = parseFloat(document.getElementById('higherRange1').value);
                    const threshold1 = parseFloat(document.getElementById('threshold1').value);

                    if ((currentAvg1 < lower1 || currentAvg1 > higher1) || difference1 >= threshold1) {
                        document.getElementById('report1').innerText = `Alert for Range 1 (Temp): Avg Temp is ${currentAvg1.toFixed(2)} °C, changed by ${difference1.toFixed(2)} °C`;
                    }
                }
                previousAvg1 = currentAvg1;
                dataPoints1.length = 0; // Reset for next cycle
            }

            // Collect temperature for Range 2
            dataPoints2.push(temperature);
            if (dataPoints2.length === 3) {
                const currentAvg2 = calculateAverage(dataPoints2);
                if (previousAvg2 !== null) {
                    const difference2 = Math.abs(currentAvg2 - previousAvg2);
                    const lower2 = parseFloat(document.getElementById('lowerRange2').value);
                    const higher2 = parseFloat(document.getElementById('higherRange2').value);
                    const threshold2 = parseFloat(document.getElementById('threshold2').value);

                    if ((currentAvg2 < lower2 || currentAvg2 > higher2) || difference2 >= threshold2) {
                        document.getElementById('report2').innerText = `Alert for Range 2 (Temp): Avg Temp is ${currentAvg2.toFixed(2)} °C, changed by ${difference2.toFixed(2)} °C`;
                    }
                }
                previousAvg2 = currentAvg2;
                dataPoints2.length = 0; // Reset for next cycle
            }

            // Collect humidity for Range 1
            dataPointsHumidity1.push(humidity);
            if (dataPointsHumidity1.length === 3) {
                const currentAvgHumidity1 = calculateAverage(dataPointsHumidity1);
                if (previousAvgHumidity1 !== null) {
                    const differenceHumidity1 = Math.abs(currentAvgHumidity1 - previousAvgHumidity1);
                    const lowerHumidity1 = parseFloat(document.getElementById('lowerHumidity1').value);
                    const higherHumidity1 = parseFloat(document.getElementById('higherHumidity1').value);
                    const thresholdHumidity1 = parseFloat(document.getElementById('thresholdHumidity1').value);

                    if ((currentAvgHumidity1 < lowerHumidity1 || currentAvgHumidity1 > higherHumidity1) || differenceHumidity1 >= thresholdHumidity1) {
                        document.getElementById('humidityReport1').innerText = `Alert for Range 1 (Humidity): Avg Humidity is ${currentAvgHumidity1.toFixed(2)} %, changed by ${differenceHumidity1.toFixed(2)} %`;
                    }
                }
                previousAvgHumidity1 = currentAvgHumidity1;
                dataPointsHumidity1.length = 0; // Reset for next cycle
            }

            // Collect humidity for Range 2
            dataPointsHumidity2.push(humidity);
            if (dataPointsHumidity2.length === 3) {
                const currentAvgHumidity2 = calculateAverage(dataPointsHumidity2);
                if (previousAvgHumidity2 !== null) {
                    const differenceHumidity2 = Math.abs(currentAvgHumidity2 - previousAvgHumidity2);
                    const lowerHumidity2 = parseFloat(document.getElementById('lowerHumidity2').value);
                    const higherHumidity2 = parseFloat(document.getElementById('higherHumidity2').value);
                    const thresholdHumidity2 = parseFloat(document.getElementById('thresholdHumidity2').value);

                    if ((currentAvgHumidity2 < lowerHumidity2 || currentAvgHumidity2 > higherHumidity2) || differenceHumidity2 >= thresholdHumidity2) {
                        document.getElementById('humidityReport2').innerText = `Alert for Range 2 (Humidity): Avg Humidity is ${currentAvgHumidity2.toFixed(2)} %, changed by ${differenceHumidity2.toFixed(2)} %`;
                    }
                }
                previousAvgHumidity2 = currentAvgHumidity2;
                dataPointsHumidity2.length = 0; // Reset for next cycle
            }

            // Collect ambient light for Range 1
            dataPointsLight1.push(lux);
            if (dataPointsLight1.length === 3) {
                const currentAvgLight1 = calculateAverage(dataPointsLight1);
                if (previousAvgLight1 !== null) {
                    const differenceLight1 = Math.abs(currentAvgLight1 - previousAvgLight1);
                    const lowerLight1 = parseFloat(document.getElementById('lowerLight1').value);
                    const higherLight1 = parseFloat(document.getElementById('higherLight1').value);
                    const thresholdLight1 = parseFloat(document.getElementById('thresholdLight1').value);

                    if ((currentAvgLight1 < lowerLight1 || currentAvgLight1 > higherLight1) || differenceLight1 >= thresholdLight1) {
                        document.getElementById('lightReport1').innerText = `Alert for Range 1 (Light): Avg Light is ${currentAvgLight1.toFixed(2)} %, changed by ${differenceLight1.toFixed(2)} %`;
                    }
                }
                previousAvgLight1 = currentAvgLight1;
                dataPointsLight1.length = 0; // Reset for next cycle
            }

            // Collect ambient light for Range 2
            dataPointsLight2.push(lux);
            if (dataPointsLight2.length === 3) {
                const currentAvgLight2 = calculateAverage(dataPointsLight2);
                if (previousAvgLight2 !== null) {
                    const differenceLight2 = Math.abs(currentAvgLight2 - previousAvgLight2);
                    const lowerLight2 = parseFloat(document.getElementById('lowerLight2').value);
                    const higherLight2 = parseFloat(document.getElementById('higherLight2').value);
                    const thresholdLight2 = parseFloat(document.getElementById('thresholdLight2').value);

                    if ((currentAvgLight2 < lowerLight2 || currentAvgLight2 > higherLight2) || differenceLight2 >= thresholdLight2) {
                        document.getElementById('lightReport2').innerText = `Alert for Range 2 (Light): Avg Light is ${currentAvgLight2.toFixed(2)} %, changed by ${differenceLight2.toFixed(2)} %`;
                    }
                }
                previousAvgLight2 = currentAvgLight2;
                dataPointsLight2.length = 0; // Reset for next cycle
            }
        }

        // Start monitoring when the button is clicked
        function startMonitoring() {
            document.getElementById('report1').innerText = ''; // Clear Range 1 output
            document.getElementById('report2').innerText = ''; // Clear Range 2 output
            document.getElementById('normalMessage').innerText = 'Monitoring started...';
            setInterval(monitor, 60000); // Fetch every minute
        }
    </script>
</body>
</html>
v1.2

v2.1
hp
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Threshold Setup with Lux & Humidity</title>
    <style>
        body { font-family: Arial; background-color: #f2f2f2; padding: 20px; }
        .container { margin-bottom: 20px; }
        input, button { padding: 10px; margin: 5px; }
        #report1, #report2 { margin-top: 20px; color: green; font-weight: bold; }
        #normalMessage { margin-top: 20px; color: green; font-weight: normal; }
    </style>
</head>
<body>
    <h1>SmartComfort - Lux & Humidity Threshold Setup</h1>

    <!-- First Range and Threshold (Lux) -->
    <div class="container">
        <label>Lower Lux 1: <input type="number" id="lowerRange1" value="0"></label>
        <label>Higher Lux 1: <input type="number" id="higherRange1" value="100"></label>
        <label>Threshold 1: <input type="number" id="threshold1" value="5"></label>
        <button onclick="startMonitoring()">Start Monitoring</button>
    </div>

    <!-- Second Range and Threshold (Humidity) -->
    <div class="container">
        <label>Lower Humidity 1: <input type="number" id="lowerRange2" value="0"></label>
        <label>Higher Humidity 1: <input type="number" id="higherRange2" value="100"></label>
        <label>Threshold 2: <input type="number" id="threshold2" value="5"></label>
    </div>

    <!-- Separate Outputs for both Range 1 and Range 2 -->
    <div id="report1"></div> <!-- Output for Lux Range -->
    <div id="report2"></div> <!-- Output for Humidity Range -->

    <div id="normalMessage">No changes detected yet...</div> <!-- Normal Message Section -->

    <script>
        let previousAvg1 = null;
        let previousAvg2 = null;
        const dataPoints1 = [];
        const dataPoints2 = [];
        const min_value = 0;  // Min value for the scale (can be adjusted)
        const max_value = 100;  // Max value for the scale (can be adjusted)

        // Function to fetch lux (ambient light) from the API
        async function fetchLux() {
            try {
                const response = await fetch('http://10.202.14.3:5000/sensor-data');
                const data = await response.json();
                return parseFloat(data.lux);
            } catch (error) {
                console.error('Error fetching lux:', error);
                return null;
            }
        }

        // Function to fetch humidity from the API
        async function fetchHumidity() {
            try {
                const response = await fetch('http://10.202.14.3:5000/sensor-data');
                const data = await response.json();
                return parseFloat(data.humidity);
            } catch (error) {
                console.error('Error fetching humidity:', error);
                return null;
            }
        }

        // Function to calculate percentage change relative to Min-Max scale
        function calculatePercentage(current_value, min_value, max_value) {
            const percentage = ((current_value - min_value) / (max_value - min_value)) * 100;
            const relative_change = percentage - 100;  // Calculate relative change from 100%
            return { percentage, relative_change };
        }

        // Function to calculate the average of an array
        function calculateAverage(arr) {
            return arr.reduce((a, b) => a + b, 0) / arr.length;
        }

        // Function to monitor the lux and humidity and check conditions
        async function monitor() {
            const lux = await fetchLux();
            const humidity = await fetchHumidity();

            if (lux === null || humidity === null) return;

            // For Lux Range 1
            dataPoints1.push(lux);
            if (dataPoints1.length === 3) {
                const currentAvg1 = calculateAverage(dataPoints1);
                const { percentage: luxPercentage, relative_change: luxChange } = calculatePercentage(currentAvg1, min_value, max_value);

                if (previousAvg1 !== null) {
                    const threshold1 = parseFloat(document.getElementById('threshold1').value);
                    if (Math.abs(luxChange) >= threshold1) {
                        document.getElementById('report1').innerText = `Alert for Lux: Avg Lux is ${currentAvg1.toFixed(2)} lux, Change: ${luxChange.toFixed(2)}%`;
                    } else {
                        document.getElementById('normalMessage').innerText = `Current Lux (Range 1): ${lux.toFixed(2)} lux - No significant change.`;
                    }
                }
                previousAvg1 = currentAvg1;
                dataPoints1.length = 0;
            }

            // For Humidity Range 2
            dataPoints2.push(humidity);
            if (dataPoints2.length === 3) {
                const currentAvg2 = calculateAverage(dataPoints2);
                const { percentage: humidityPercentage, relative_change: humidityChange } = calculatePercentage(currentAvg2, min_value, max_value);

                if (previousAvg2 !== null) {
                    const threshold2 = parseFloat(document.getElementById('threshold2').value);
                    if (Math.abs(humidityChange) >= threshold2) {
                        document.getElementById('report2').innerText = `Alert for Humidity: Avg Humidity is ${currentAvg2.toFixed(2)} %, Change: ${humidityChange.toFixed(2)}%`;
                    } else {
                        document.getElementById('normalMessage').innerText = `Current Humidity (Range 2): ${humidity.toFixed(2)} % - No significant change.`;
                    }
                }
                previousAvg2 = currentAvg2;
                dataPoints2.length = 0;
            }
        }

        // Start monitoring when the button is clicked
        function startMonitoring() {
            document.getElementById('report1').innerText = '';
            document.getElementById('report2').innerText = '';
            document.getElementById('normalMessage').innerText = 'Monitoring started...';
            setInterval(monitor, 60000); // Fetch every minute and print status
        }
    </script>
</body>
</html>

v2.2
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Threshold Setup with Humidity</title>
    <style>
        body { font-family: Arial; background-color: #f2f2f2; padding: 20px; }
        .container { margin-bottom: 20px; }
        input, button { padding: 10px; margin: 5px; }
        #report1, #report2 { margin-top: 20px; color: green; font-weight: bold; }
        #normalMessage { margin-top: 20px; color: green; font-weight: normal; }
    </style>
</head>
<body>
    <h1>SmartComfort - Humidity Threshold Setup</h1>

    <!-- First Range and Threshold (Humidity) -->
    <div class="container">
        <label>Lower Humidity Range 1: <input type="number" id="lowerRange1" value="0"></label>
        <label>Higher Humidity Range 1: <input type="number" id="higherRange1" value="50"></label>
        <label>Threshold 1: <input type="number" id="threshold1" value="5"></label>
    </div>

    <!-- Second Range and Threshold (Humidity) -->
    <div class="container">
        <label>Lower Humidity Range 2: <input type="number" id="lowerRange2" value="50"></label>
        <label>Higher Humidity Range 2: <input type="number" id="higherRange2" value="100"></label>
        <label>Threshold 2: <input type="number" id="threshold2" value="5"></label>
    </div>

    <!-- Submit Button to Start Monitoring -->
    <div class="container">
        <button onclick="startMonitoring()">Start Monitoring</button>
    </div>

    <!-- Separate Outputs for both Range 1 and Range 2 -->
    <div id="report1"></div> <!-- Output for Humidity Range 1 -->
    <div id="report2"></div> <!-- Output for Humidity Range 2 -->

    <div id="normalMessage">No changes detected yet...</div> <!-- Normal Message Section -->

    <script>
        let previousAvg1 = null;
        let previousAvg2 = null;
        const dataPoints1 = [];
        const dataPoints2 = [];
        const min_value = 0;  // Min value for the scale (can be adjusted)
        const max_value = 100;  // Max value for the scale (can be adjusted)

        // Function to fetch humidity from the API
        async function fetchHumidity() {
            try {
                const response = await fetch('http://10.202.14.3:5000/sensor-data');
                const data = await response.json();
                return parseFloat(data.humidity);
            } catch (error) {
                console.error('Error fetching humidity:', error);
                return null;
            }
        }

        // Function to calculate percentage change relative to Min-Max scale
        function calculatePercentage(current_value, min_value, max_value) {
            const percentage = ((current_value - min_value) / (max_value - min_value)) * 100;
            const relative_change = percentage - 100;  // Calculate relative change from 100%
            return { percentage, relative_change };
        }

        // Function to calculate the average of an array
        function calculateAverage(arr) {
            return arr.reduce((a, b) => a + b, 0) / arr.length;
        }

        // Function to monitor the humidity and check conditions
        async function monitor() {
            const humidity = await fetchHumidity();

            if (humidity === null) return;

            // For Humidity Range 1
            dataPoints1.push(humidity);
            if (dataPoints1.length === 3) {
                const currentAvg1 = calculateAverage(dataPoints1);
                const diff1 = previousAvg1 !== null ? Math.abs(currentAvg1 - previousAvg1) : 0;  // Difference from previous average
                const { percentage: humidityPercentage1, relative_change: humidityChange1 } = calculatePercentage(diff1, min_value, max_value);

                if (previousAvg1 !== null) {
                    const threshold1 = parseFloat(document.getElementById('threshold1').value);
                    if (Math.abs(humidityChange1) >= threshold1) {
                        document.getElementById('report1').innerText = `Alert for Humidity Range 1: Avg Humidity is ${currentAvg1.toFixed(2)} %, Change: ${humidityChange1.toFixed(2)}%`;
                    } else {
                        document.getElementById('normalMessage').innerText = `Current Humidity (Range 1): ${humidity.toFixed(2)} % - No significant change.`;
                    }
                }
                previousAvg1 = currentAvg1;
                dataPoints1.length = 0;
            }

            // For Humidity Range 2
            dataPoints2.push(humidity);
            if (dataPoints2.length === 3) {
                const currentAvg2 = calculateAverage(dataPoints2);
                const diff2 = previousAvg2 !== null ? Math.abs(currentAvg2 - previousAvg2) : 0;  // Difference from previous average
                const { percentage: humidityPercentage2, relative_change: humidityChange2 } = calculatePercentage(diff2, min_value, max_value);

                if (previousAvg2 !== null) {
                    const threshold2 = parseFloat(document.getElementById('threshold2').value);
                    if (Math.abs(humidityChange2) >= threshold2) {
                        document.getElementById('report2').innerText = `Alert for Humidity Range 2: Avg Humidity is ${currentAvg2.toFixed(2)} %, Change: ${humidityChange2.toFixed(2)}%`;
                    } else {
                        document.getElementById('normalMessage').innerText = `Current Humidity (Range 2): ${humidity.toFixed(2)} % - No significant change.`;
                    }
                }
                previousAvg2 = currentAvg2;
                dataPoints2.length = 0;
            }
        }

        // Start monitoring when the button is clicked
        function startMonitoring() {
            // Clear previous reports and messages before starting
            document.getElementById('report1').innerText = '';
            document.getElementById('report2').innerText = '';
            document.getElementById('normalMessage').innerText = 'Monitoring started...';
            
            // Start the monitoring process with interval
            setInterval(monitor, 60000); // Fetch every minute and print status
        }
    </script>
</body>
</html>
 v2.3
 dataPointsHumidity2.push(humidity);
            if (dataPointsHumidity2.length === 3) {
                const currentAvg2 = calculateAverage(dataPointsHumidity2);
                if (previousAvgHumidity2 !== null) {
                    const diff2 = Math.abs(currentAvg2 - previousAvgHumidity2);
                    const low2 = parseFloat(document.getElementById('lowerHumidity2').value);
                    const high2 = parseFloat(document.getElementById('higherHumidity2').value);
                    const thresh2 = parseFloat(document.getElementById('thresholdHumidity2').value);

                    if ((currentAvg2 < low2 || currentAvg2 > high2) || diff2 >= thresh2) {
                        document.getElementById('humidityReport2').innerText =
                            `Alert for Range 2 (Humidity): Avg = ${currentAvg2.toFixed(2)} %, change = ${diff2.toFixed(2)} %`;
                    }
                }
                previousAvgHumidity2 = currentAvg2;
                dataPointsHumidity2.length = 0;
            }

vs3.1
<script>
        let previousAvgLight1 = null;
        let previousAvgLight2 = null;

        const dataPointsLight1 = [];
        const dataPointsLight2 = [];

        async function fetchData() {
            try {
                const response = await fetch('http://10.202.14.3:5000/sensor-data');
                const data = await response.json();
                return {
                    lux: parseFloat(data.lux)
                };
            } catch (error) {
                console.error('Error fetching data:', error);
                return null;
            }
        }

        function calculateAverage(arr) {
            return arr.reduce((a, b) => a + b, 0) / arr.length;
        }

        async function monitorLux() {
            const data = await fetchData();
            if (data === null) return;

            const { lux } = data;

            dataPointsLight1.push(lux);
            if (dataPointsLight1.length === 3) {
                const currentAvgLight1 = calculateAverage(dataPointsLight1);
                if (previousAvgLight1 !== null) {
                    const differenceLight1 = Math.abs(currentAvgLight1 - previousAvgLight1);
                    const lowerLight1 = parseFloat(document.getElementById('lowerLight1').value);
                    const higherLight1 = parseFloat(document.getElementById('higherLight1').value);
                    const thresholdLight1 = parseFloat(document.getElementById('thresholdLight1').value);
                    const diff_in_percentage1 = (differenceLight1 / 1140.25) * 100;

                    if ((currentAvgLight1 < lowerLight1 || currentAvgLight1 > higherLight1) || diff_in_percentage1 >= thresholdLight1) {
                        document.getElementById('lightReport1').innerText =
                            `Alert for Range 1 (Light): Avg Light is ${currentAvgLight1.toFixed(2)} lux, changed by ${differenceLight1.toFixed(2)} lux, ${diff_in_percentage1.toFixed(2)} %, Prev = ${previousAvgLight1.toFixed(2)}`;
                    }
                }
                previousAvgLight1 = currentAvgLight1;
                dataPointsLight1.length = 0;
            }

            dataPointsLight2.push(lux);
            if (dataPointsLight2.length === 3) {
                const currentAvgLight2 = calculateAverage(dataPointsLight2);
                if (previousAvgLight2 !== null) {
                    const differenceLight2 = Math.abs(currentAvgLight2 - previousAvgLight2);
                    const lowerLight2 = parseFloat(document.getElementById('lowerLight2').value);
                    const higherLight2 = parseFloat(document.getElementById('higherLight2').value);
                    const thresholdLight2 = parseFloat(document.getElementById('thresholdLight2').value);
                    const diff_in_percentage2 = (differenceLight2 / 1140.25) * 100;
                    
                    if ((currentAvgLight2 < lowerLight2 || currentAvgLight2 > higherLight2) || diff_in_percentage2 >= thresholdLight2) {
                        document.getElementById('lightReport2').innerText =
                            `Alert for Range 2 (Light): Avg Light is ${currentAvgLight2.toFixed(2)} lux, changed by ${differenceLight2.toFixed(2)} lux, ${diff_in_percentage2.toFixed(2)} %, Prev = ${previousAvgLight2.toFixed(2)}`;
                    }
                }
                previousAvgLight2 = currentAvgLight2;
                dataPointsLight2.length = 0;
            }
        }

        function startLuxMonitoring() {
            document.getElementById('lightReport1').innerText = '';
            document.getElementById('lightReport2').innerText = '';
            document.getElementById('normalMessage').innerText = 'Monitoring started...';
            setInterval(monitorLux, 60000); // Every 60 seconds
        }
    </script>

v3.2
<script>
        let previousAvgLight1 = null;
        let previousAvgLight2 = null;

        const dataPointsLight1 = [];
        const dataPointsLight2 = [];

        async function fetchData() {
            try {
                const response = await fetch('http://10.202.14.3:5000/sensor-data');
                const data = await response.json();
                return {
                    lux: parseFloat(data.lux)
                };
            } catch (error) {
                console.error('Error fetching data:', error);
                return null;
            }
        }

        function calculateAverage(arr) {
            return arr.reduce((a, b) => a + b, 0) / arr.length;
        }

        async function monitorLux() {
            const data = await fetchData();
            if (data === null) return;

            const { lux } = data;

            dataPointsLight1.push(lux);
            if (dataPointsLight1.length === 3) {
                const currentAvgLight1 = calculateAverage(dataPointsLight1);
                if (previousAvgLight1 !== null) {
                    const differenceLight1 = Math.abs(currentAvgLight1 - previousAvgLight1);
                    const lowerLight1 = parseFloat(document.getElementById('lowerLight1').value);
                    const higherLight1 = parseFloat(document.getElementById('higherLight1').value);
                    const thresholdLight1 = parseFloat(document.getElementById('thresholdLight1').value);
                    const diff_in_percentage1 = (differenceLight1 / 1140.25) * 100;

                    if ((currentAvgLight1 < lowerLight1 || currentAvgLight1 > higherLight1) || diff_in_percentage1 >= thresholdLight1) {
                        document.getElementById('lightReport1').innerText =
                            `Alert for Range 1 (Light): Avg Light is ${currentAvgLight1.toFixed(2)} lux, changed by ${differenceLight1.toFixed(2)} lux, ${diff_in_percentage1.toFixed(2)} %, Prev = ${previousAvgLight1.toFixed(2)}`;
                    }
                }
                previousAvgLight1 = currentAvgLight1;
                dataPointsLight1.length = 0;
            }

            dataPointsLight2.push(lux);
            if (dataPointsLight2.length === 3) {
                const currentAvgLight2 = calculateAverage(dataPointsLight2);
                if (previousAvgLight2 !== null) {
                    const differenceLight2 = Math.abs(currentAvgLight2 - previousAvgLight2);
                    const lowerLight2 = parseFloat(document.getElementById('lowerLight2').value);
                    const higherLight2 = parseFloat(document.getElementById('higherLight2').value);
                    const thresholdLight2 = parseFloat(document.getElementById('thresholdLight2').value);
                    const diff_in_percentage2 = (differenceLight2 / 1140.25) * 100;
                    
                    if ((currentAvgLight2 < lowerLight2 || currentAvgLight2 > higherLight2) || diff_in_percentage2 >= thresholdLight2) {
                        document.getElementById('lightReport2').innerText =
                            `Alert for Range 2 (Light): Avg Light is ${currentAvgLight2.toFixed(2)} lux, changed by ${differenceLight2.toFixed(2)} lux, ${diff_in_percentage2.toFixed(2)} %, Prev = ${previousAvgLight2.toFixed(2)}`;
                    }
                }
                previousAvgLight2 = currentAvgLight2;
                dataPointsLight2.length = 0;
            }
        }

        function startLuxMonitoring() {
            document.getElementById('lightReport1').innerText = '';
            document.getElementById('lightReport2').innerText = '';
            document.getElementById('normalMessage').innerText = 'Monitoring started...';
            setInterval(monitorLux, 60000); // Every 60 seconds
        }
    </script>