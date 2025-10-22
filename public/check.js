const endpoints = [
  "http://10.196.133.61:5000/sensor-data",
  "http://192.168.1.50:5000/sensor-data",
  "http://ec2-3-141-169-209.us-east-2.compute.amazonaws.com:7000/sensor-data"
];

// Try each endpoint until one responds OK
async function fetchWithFallback(urls) {
  for (const url of urls) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);
      if (res.ok) return url;  // ✅ Return the first successful endpoint
    } catch (err) {
      console.log("❌ Failed:", url);
    }
  }
  return null;
}

async function main() {
  const check = await fetchWithFallback(endpoints);
  console.log("✅ Active endpoint:", check);

  // ✅ If the working endpoint is your AWS link
  if (check === "http://ec2-3-141-169-209.us-east-2.compute.amazonaws.com:7000/sensor-data") {
    // 👉 Replace 'yourpage.html' below with your target HTML page
    window.location.href = "aws.html";
  }
}

main();