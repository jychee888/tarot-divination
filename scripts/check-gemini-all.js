const apiKey = "AIzaSyBb9NqoMzFM5G9xLR-ZNfQVeP67ImYM-zQ";

async function checkModels() {
  const versions = ["v1", "v1beta"];
  for (const v of versions) {
    try {
      const url = `https://generativelanguage.googleapis.com/${v}/models?key=${apiKey}`;
      const res = await fetch(url);
      const data = await res.json();
      console.log(`--- Version ${v} ---`);
      if (data.models) {
        data.models.forEach((m) => {
          console.log(`- ${m.name}`);
        });
      } else {
        console.log("Error:", data);
      }
    } catch (e) {
      console.error(`Error checking ${v}:`, e.message);
    }
  }
}

checkModels();
