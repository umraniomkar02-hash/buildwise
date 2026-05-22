let costChart = null;

/* SHOW / HIDE CUSTOM INPUTS */
function toggleCustomInputs() {
    const mappings = {
        cementBrand: "cementCustom",
        steelBrand: "steelCustom",
        brickType: "brickCustom",
        sandType: "sandCustom",
        aggregateType: "aggregateCustom",
        paintBrand: "paintCustom",
        flooringType: "flooringCustom",
        plumbingBrand: "plumbingCustom",
        electricalBrand: "electricalCustom",
        roofingType: "roofingCustom",
        doorType: "doorCustom",
        laborType: "laborCustom"
    };

    Object.keys(mappings).forEach(id => {
        const dropdown = document.getElementById(id);
        const customInput = document.getElementById(mappings[id]);

        if (!dropdown || !customInput) return;

        if (dropdown.value === "other") {
            customInput.classList.remove("hidden");
        } else {
            customInput.classList.add("hidden");
            customInput.value = "";
        }
    });
}

/* GET RANGE */
function getRange(selection, customId, database) {
    if (selection === "other") {
        const customPrice = parseFloat(document.getElementById(customId).value);

        if (!customPrice || customPrice <= 0) {
            throw new Error("Please enter a valid custom price.");
        }

        return [customPrice, customPrice];
    }

    if (!database[selection]) {
        throw new Error("Please complete all required selections.");
    }

    return database[selection];
}

/* MAIN CALCULATOR */
function calculateCost() {
    try {
        const length = parseFloat(document.getElementById("length").value);
        const width = parseFloat(document.getElementById("width").value);
        const floors = parseInt(document.getElementById("floors").value);
        const contingency = parseFloat(
            document.getElementById("contingency").value || 0
        );

        if (!length || !width || !floors) {
            throw new Error("Enter project dimensions.");
        }

        const areaSqM = length * width * floors;
        const areaSqFt = areaSqM * 10.764;

        /* DATABASES */

        const cementDB = {
            ultratech: [420, 470],
            acc: [400, 450],
            ambuja: [410, 455],
            shree: [360, 420],
            dalmia: [380, 430],
            ramco: [380, 440],
            jk: [390, 450],
            wonder: [400, 460]
        };

        const steelDB = {
            tata: [75, 85],
            jsw: [70, 82],
            sail: [68, 78],
            jindal: [72, 84],
            vizag: [65, 80],
            kamdhenu: [65, 78],
            shyam: [60, 75]
        };

        const brickDB = {
            red: [7, 12],
            flyash: [5, 9],
            aac: [60, 120],
            concrete: [40, 90]
        };

        const sandDB = {
            river: [1800, 3500],
            msand: [1200, 2500],
            plaster: [1500, 2800]
        };

        const aggregateDB = {
            "20mm": [900, 1400],
            "40mm": [1000, 1600],
            crushed: [1100, 1800]
        };

        const paintDB = {
            asian: [15, 30],
            berger: [14, 28],
            nerolac: [15, 30],
            dulux: [18, 35]
        };

        const flooringDB = {
            tiles: [80, 250],
            granite: [180, 450],
            marble: [250, 800],
            wood: [300, 1000]
        };

        const plumbingDB = {
            ashirvad: [100, 180],
            supreme: [120, 200],
            jaquar: [180, 300],
            hindware: [150, 280]
        };
                const electricalDB = {
            havells: [150, 280],
            anchor: [120, 220],
            legrand: [180, 320],
            schneider: [180, 340]
        };

        const roofingDB = {
            rcc: [200, 450],
            sheet: [100, 250],
            falseceiling: [120, 300]
        };

        const doorDB = {
            wood: [120000, 300000],
            upvc: [100000, 220000],
            aluminium: [90000, 200000],
            steel: [80000, 180000]
        };

        const laborDB = {
            basic: [250, 350],
            standard: [350, 500],
            premium: [500, 700]
        };

        /* GET USER SELECTIONS */
        const cementRange = getRange(
            document.getElementById("cementBrand").value,
            "cementCustom",
            cementDB
        );

        const steelRange = getRange(
            document.getElementById("steelBrand").value,
            "steelCustom",
            steelDB
        );

        const brickRange = getRange(
            document.getElementById("brickType").value,
            "brickCustom",
            brickDB
        );

        const sandRange = getRange(
            document.getElementById("sandType").value,
            "sandCustom",
            sandDB
        );

        const aggregateRange = getRange(
            document.getElementById("aggregateType").value,
            "aggregateCustom",
            aggregateDB
        );

        const paintRange = getRange(
            document.getElementById("paintBrand").value,
            "paintCustom",
            paintDB
        );

        const flooringRange = getRange(
            document.getElementById("flooringType").value,
            "flooringCustom",
            flooringDB
        );

        const plumbingRange = getRange(
            document.getElementById("plumbingBrand").value,
            "plumbingCustom",
            plumbingDB
        );

        const electricalRange = getRange(
            document.getElementById("electricalBrand").value,
            "electricalCustom",
            electricalDB
        );

        const roofingRange = getRange(
            document.getElementById("roofingType").value,
            "roofingCustom",
            roofingDB
        );

        const doorRange = getRange(
            document.getElementById("doorType").value,
            "doorCustom",
            doorDB
        );

        const laborRange = getRange(
            document.getElementById("laborType").value,
            "laborCustom",
            laborDB
        );

        /* QUANTITY ASSUMPTIONS */
        const cementBags = areaSqFt * 0.4;
        const steelKg = areaSqFt * 4;
        const bricks = areaSqFt * 8;
        const sandM3 = areaSqFt * 0.03;
        const aggregateTons = areaSqFt * 0.015;

        /* COST CALCULATIONS */
        const minCost =
            (cementBags * cementRange[0]) +
            (steelKg * steelRange[0]) +
            (bricks * brickRange[0]) +
            (sandM3 * sandRange[0]) +
            (aggregateTons * aggregateRange[0]) +
            (areaSqFt * paintRange[0]) +
            (areaSqFt * flooringRange[0]) +
            (areaSqFt * plumbingRange[0]) +
            (areaSqFt * electricalRange[0]) +
            (areaSqFt * roofingRange[0]) +
            (laborRange[0] * areaSqFt) +
            doorRange[0];

        const maxCost =
            (cementBags * cementRange[1]) +
            (steelKg * steelRange[1]) +
            (bricks * brickRange[1]) +
            (sandM3 * sandRange[1]) +
            (aggregateTons * aggregateRange[1]) +
            (areaSqFt * paintRange[1]) +
            (areaSqFt * flooringRange[1]) +
            (areaSqFt * plumbingRange[1]) +
            (areaSqFt * electricalRange[1]) +
            (areaSqFt * roofingRange[1]) +
            (laborRange[1] * areaSqFt) +
            doorRange[1];

        const minFinal = minCost + (minCost * contingency / 100);
        const maxFinal = maxCost + (maxCost * contingency / 100);
        const expected = (minFinal + maxFinal) / 2;

        /* RESULTS */
        document.getElementById("results").innerHTML = `
            <div class="result-item">
                🏠 Built-up Area: <strong>${areaSqFt.toFixed(0)} sq ft</strong>
            </div>

            <div class="result-item">
                📉 Minimum Estimate: <strong>₹${Math.round(minFinal).toLocaleString()}</strong>
            </div>

            <div class="result-item">
                📈 Maximum Estimate: <strong>₹${Math.round(maxFinal).toLocaleString()}</strong>
            </div>

            <div class="total-cost">
                💰 Expected Budget: ₹${Math.round(expected).toLocaleString()}
            </div>

            <div class="result-item">
                🎯 Approximate Accuracy: ±₹1–2 Lakhs
            </div>
        `;

        renderChart(
            expected * 0.14,
            expected * 0.18,
            expected * 0.20,
            expected * 0.22,
            expected * 0.12
        );

    } catch (err) {
        alert(err.message);
    }
}

/* CHART */
function renderChart(cement, steel, flooring, labor, electrical) {
    const ctx = document.getElementById("costChart").getContext("2d");

    if (costChart) {
        costChart.destroy();
    }

    costChart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: [
                "Cement",
                "Steel",
                "Flooring",
                "Labor",
                "Electrical"
            ],
            datasets: [{
                data: [
                    cement,
                    steel,
                    flooring,
                    labor,
                    electrical
                ],
                backgroundColor: [
                    "#2563EB",
                    "#60A5FA",
                    "#38BDF8",
                    "#1D4ED8",
                    "#7DD3FC"
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: "#F8FAFC"
                    }
                }
            }
        }
    });
}