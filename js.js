const unitsMap = {
      length: { label: "Length", units: { m: 1, cm: 100, mm: 1000, ft: 3.28084, in: 39.3701, yd: 1.09361 }},
      volume: { label: "Volume", units: { l: 1, ml: 1000, gal: 0.264172, qt: 1.05669, cup: 4.22675, 'fl oz': 33.814 }},
      area: { label: "Area", units: { m2: 1, cm2: 10000, ft2: 10.7639, in2: 1550, km2: 0.000001, acre: 0.000247105 }},
      weight: { label: "Weight", units: { kg: 1, g: 1000, mg: 1000000, lb: 2.20462, oz: 35.274, st: 0.157473 }},
      speed: { label: "Speed", units: { kmh: 1, ms: 0.277778, mph: 0.621371, knot: 0.539957, 'mach': 0.000809847 }},
      temperature: { label: "Temperature", units: { C: "Celsius", F: "Fahrenheit", K: "Kelvin" }},
      angle: { label: "Angle", units: { deg: 1, rad: 0.0174533, grad: 1.11111 }},
      energy: { label: "Energy", units: { J: 1, kJ: 0.001, cal: 0.239006, kcal: 0.000239, kWh: 2.77778e-7, 'eV': 6.242e18 }},
      pressure: { label: "Pressure", units: { Pa: 1, kPa: 0.001, bar: 1e-5, atm: 9.8692e-6, psi: 0.000145038, mmHg: 0.00750062 }},
      data: { label: "Data", units: { bit: 1, byte: 0.125, KB: 1/8000, MB: 1/8e6, GB: 1/8e9, TB: 1/8e12 }}
    };

    document.addEventListener('DOMContentLoaded', function() {
      const menu = document.getElementById("converterMenu");
      const fromUnit = document.getElementById("fromUnit");
      const toUnit = document.getElementById("toUnit");
      const inputValue = document.getElementById("inputValue");
      const resultArea = document.getElementById("resultArea");
      const convertBtn = document.getElementById("convertBtn");
      const form = document.getElementById("converterForm");
      const title = document.getElementById("converterTitle");
      const introMessage = document.getElementById("introMessage");

      let currentType = "";

      // Auto-select the first converter on load
      setTimeout(() => {
        const firstLink = document.querySelector('.nav-link[data-type="length"]');
        firstLink.classList.add("active");
        loadConverter(firstLink.dataset.type);
      }, 500);

      menu.addEventListener("click", (e) => {
        e.preventDefault();
        if (!e.target.closest(".nav-link")) return;

        document.querySelectorAll(".nav-link").forEach(link => link.classList.remove("active"));
        const link = e.target.closest(".nav-link");
        link.classList.add("active");
        
        const type = link.dataset.type;
        loadConverter(type);
      });

      function loadConverter(type) {
        currentType = type;
        form.style.display = "block";
        introMessage.style.display = "none";
        title.textContent = unitsMap[type].label + " Converter";
        
        // Clear previous options
        fromUnit.innerHTML = "";
        toUnit.innerHTML = "";
        
        // Add new options
        const units = unitsMap[type].units;
        for (const u in units) {
          const option1 = document.createElement("option");
          option1.value = u;
          option1.textContent = u;
          fromUnit.appendChild(option1);
          
          const option2 = document.createElement("option");
          option2.value = u;
          option2.textContent = u;
          toUnit.appendChild(option2);
          
          // Set different default selections
          if (u === "m") fromUnit.value = u;
          if (u === "ft") toUnit.value = u;
        }
        
        // Clear previous result
        resultArea.textContent = "";
        inputValue.value = "";
        inputValue.focus();
      }

      convertBtn.addEventListener("click", () => {
        const val = parseFloat(inputValue.value) || 0;
        const from = fromUnit.value;
        const to = toUnit.value;
        let result = "";

        if (currentType === "temperature") {
          result = convertTemp(val, from, to);
        } else {
          const factorFrom = unitsMap[currentType].units[from];
          const factorTo = unitsMap[currentType].units[to];
          result = ((val / factorFrom) * factorTo).toFixed(6);
        }

        // Format large numbers
        if (Math.abs(result) > 1000000 || Math.abs(result) < 0.0001) {
          result = Number(result).toExponential(4);
        }
        
        resultArea.textContent = `${val} ${from} = ${result} ${to}`;
        resultArea.style.background = "rgba(33, 150, 243, 0.2)";
        resultArea.classList.add("fade-in");
      });

      function convertTemp(val, from, to) {
        if (from === to) return val;
        if (from === "C" && to === "F") return ((val * 9/5) + 32).toFixed(2);
        if (from === "C" && to === "K") return (val + 273.15).toFixed(2);
        if (from === "F" && to === "C") return ((val - 32) * 5/9).toFixed(2);
        if (from === "F" && to === "K") return (((val - 32) * 5/9) + 273.15).toFixed(2);
        if (from === "K" && to === "C") return (val - 273.15).toFixed(2);
        if (from === "K" && to === "F") return (((val - 273.15) * 9/5) + 32).toFixed(2);
        return val;
      }
      
      // Add keyboard shortcut for conversion
      inputValue.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
          convertBtn.click();
        }
      });
    });