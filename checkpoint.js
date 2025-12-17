const endpoints = [
  'http://10.196.133.61:5000/sensor-data',   // Place N
  'http://ec2-3-230-143-202.compute-1.amazonaws.com:7000/sensor-data'     // Place M
];

async function fetchWithFallback(urls) {
  for (let url of urls) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (res.ok) {
        console.log(`✅ Using ${url}`);
        return res; // ⚠️ return the response, not JSON, so existing code still works
      }
    } catch (err) {
      console.warn(`⚠️ Failed ${url}: ${err}`);
    }
  }
  throw new Error("All endpoints failed - Follow https://nexus.njit.edu/highlander_nexus?id=kb_article&sysparm_article=KB0010324&topic_id=87269d7987d4f950d0f70f670cbb3504");
}
