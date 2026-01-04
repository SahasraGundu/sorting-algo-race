let paused = false;
let results = {};
let complexities = {
    "bubble": "O(n²)",
    "selection": "O(n²)",
    "insertion": "O(n²)",
    "merge": "O(n log n)",
    "quick": "O(n log n)"
};

function togglePause() {
    paused = !paused;
}

function speed() {
    return Number(document.getElementById("speedControl").value);
}

async function controlledSleep() {
    while (paused) await new Promise(r => setTimeout(r, 50));
    await new Promise(r => setTimeout(r, speed()));
}

/* ================= START ================= */

async function startRace() {
    const arr = document.getElementById("inputArray").value
        .split(",").map(Number);

    results = {};
    document.getElementById("winner").innerText = "";

    await bubbleSort([...arr]);
    await selectionSort([...arr]);
    await insertionSort([...arr]);
    await mergeSortMain([...arr]);
    await quickSortMain([...arr]);

    showWinner();
}

/* ================= VISUAL HELPERS ================= */

function createBars(id, arr) {
    const c = document.getElementById(id);
    c.innerHTML = "";
    arr.forEach(v => {
        const b = document.createElement("div");
        b.className = "bar";
        b.style.height = v * 10 + "px";
        b.innerText = v;
        c.appendChild(b);
    });
}

function updateBars(id, arr) {
    [...document.getElementById(id).children].forEach((b, i) => {
        b.style.height = arr[i] * 10 + "px";
        b.innerText = arr[i];
    });
}

function color(id, i, j, clr) {
    const bars = document.getElementById(id).children;
    [...bars].forEach(b => b.style.background = "#4CAF50");
    if (i !== null) bars[i].style.background = clr;
    if (j !== null) bars[j].style.background = clr;
}

function explain(id, text) {
    document.getElementById(id + "Explain").innerText = text;
}

/* ================= SORTS ================= */

// ================= BUBBLE SORT =================
async function bubbleSort(arr) {
    createBars("bubble", arr);
    let start = performance.now();

    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
            explain("bubble", `Step: Compare indices ${j} and ${j+1}: [${arr.join(", ")}]`);
            color("bubble", j, j + 1, "red");
            await controlledSleep();

            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                updateBars("bubble", arr);
                explain("bubble", `Swap ${arr[j+1]} and ${arr[j]} → New array: [${arr.join(", ")}]`);
                color("bubble", j, j + 1, "orange");
                await controlledSleep();
            }
        }
        document.getElementById("bubbleProg").style.width =
            ((i + 1) / arr.length) * 100 + "%";
    }

    [...document.getElementById("bubble").children].forEach(b => b.style.background = "green");

    let timeTaken = performance.now() - start;
    results["Bubble Sort"] = timeTaken;
    explain("bubble", `Completed! Sorted Array: [${arr.join(", ")}] | Complexity: ${complexities["bubble"]} | Time: ${timeTaken.toFixed(1)} ms`);
}

// ================= SELECTION SORT =================
async function selectionSort(arr) {
    createBars("selection", arr);
    let start = performance.now();

    for (let i = 0; i < arr.length; i++) {
        let min = i;
        for (let j = i + 1; j < arr.length; j++) {
            explain("selection", `Finding min from index ${i} to ${arr.length-1}: Current array: [${arr.join(", ")}], min=${arr[min]}`);
            color("selection", min, j, "red");
            await controlledSleep();
            if (arr[j] < arr[min]) min = j;
        }
        [arr[i], arr[min]] = [arr[min], arr[i]];
        updateBars("selection", arr);
        explain("selection", `Swap index ${i} (${arr[min]}) with min index ${min} → New array: [${arr.join(", ")}]`);
        await controlledSleep();
    }

    [...document.getElementById("selection").children].forEach(b => b.style.background = "green");

    let timeTaken = performance.now() - start;
    results["Selection Sort"] = timeTaken;
    explain("selection", `Completed! Sorted Array: [${arr.join(", ")}] | Complexity: ${complexities["selection"]} | Time: ${timeTaken.toFixed(1)} ms`);
}

// ================= INSERTION SORT =================
async function insertionSort(arr) {
    createBars("insertion", arr);
    let start = performance.now();

    for (let i = 1; i < arr.length; i++) {
        let key = arr[i], j = i - 1;
        explain("insertion", `Insert key=${key} at index ${i} into sorted left part: [${arr.slice(0,i).join(", ")}]`);
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            updateBars("insertion", arr);
            explain("insertion", `Shift ${arr[j]} right → Array: [${arr.join(", ")}]`);
            await controlledSleep();
            j--;
        }
        arr[j + 1] = key;
        updateBars("insertion", arr);
        explain("insertion", `Insert key=${key} at position ${j+1} → Array now: [${arr.join(", ")}]`);
        await controlledSleep();
    }

    [...document.getElementById("insertion").children].forEach(b => b.style.background = "green");

    let timeTaken = performance.now() - start;
    results["Insertion Sort"] = timeTaken;
    explain("insertion", `Completed! Sorted Array: [${arr.join(", ")}] | Complexity: ${complexities["insertion"]} | Time: ${timeTaken.toFixed(1)} ms`);
}

// ================= MERGE SORT =================
async function mergeSortMain(arr) {
    createBars("merge", arr);
    let start = performance.now();

    async function mergeSort(l, r) {
        if (l >= r) return;
        let m = Math.floor((l + r) / 2);
        await mergeSort(l, m);
        await mergeSort(m + 1, r);

        explain("merge", `Merging subarrays [${arr.slice(l, m+1).join(", ")}] and [${arr.slice(m+1, r+1).join(", ")}]`);
        let temp = [], i = l, j = m + 1;
        while (i <= m && j <= r)
            temp.push(arr[i] < arr[j] ? arr[i++] : arr[j++]);
        while (i <= m) temp.push(arr[i++]);
        while (j <= r) temp.push(arr[j++]);

        for (let k = l; k <= r; k++) arr[k] = temp[k - l];
        updateBars("merge", arr);
        explain("merge", `After merging → Array: [${arr.join(", ")}]`);
        await controlledSleep();
    }

    await mergeSort(0, arr.length - 1);

    [...document.getElementById("merge").children].forEach(b => b.style.background = "green");

    let timeTaken = performance.now() - start;
    results["Merge Sort"] = timeTaken;
    explain("merge", `Completed! Sorted Array: [${arr.join(", ")}] | Complexity: ${complexities["merge"]} | Time: ${timeTaken.toFixed(1)} ms`);
}

// ================= QUICK SORT =================
async function quickSortMain(arr) {
    createBars("quick", arr);
    let start = performance.now();

    async function quickSort(l, h) {
        if (l < h) {
            let p = await partition(l, h);
            await quickSort(l, p - 1);
            await quickSort(p + 1, h);
        }
    }

    async function partition(l, h) {
        let pivot = arr[h], i = l - 1;
        explain("quick", `Pivot=${pivot} at index ${h} → Array: [${arr.join(", ")}]`);
        for (let j = l; j < h; j++) {
            color("quick", j, h, "red");
            await controlledSleep();
            if (arr[j] < pivot) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]];
                updateBars("quick", arr);
                explain("quick", `Swap ${arr[i]} and ${arr[j]} → Array: [${arr.join(", ")}]`);
                await controlledSleep();
            }
        }
        [arr[i + 1], arr[h]] = [arr[h], arr[i + 1]];
        updateBars("quick", arr);
        explain("quick", `Move pivot ${pivot} to index ${i+1} → Array: [${arr.join(", ")}]`);
        return i + 1;
    }

    await quickSort(0, arr.length - 1);

    [...document.getElementById("quick").children].forEach(b => b.style.background = "green");

    let timeTaken = performance.now() - start;
    results["Quick Sort"] = timeTaken;
    explain("quick", `Completed! Sorted Array: [${arr.join(", ")}] | Complexity: ${complexities["quick"]} | Time: ${timeTaken.toFixed(1)} ms`);
}

/* ================= RESULT ================= */
function showWinner() {
    const best = Object.entries(results).sort((a, b) => a[1] - b[1])[0];
    document.getElementById("winner").innerText =
        `🏆 Fastest Algorithm: ${best[0]} (${best[1].toFixed(1)} ms)`;
}
