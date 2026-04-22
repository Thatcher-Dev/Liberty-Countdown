const targetDate = new Date("July 4, 2026 00:00:00").getTime();

function updateBox(id, value) {
    const el = document.getElementById(id);
    const flipEnabled = document.getElementById("flipToggle").checked;

    if (el.innerText !== value.toString()) {
        el.innerText = value;

        if (flipEnabled) {
            el.classList.remove("flip");
            void el.offsetWidth;
            el.classList.add("flip");
        }
    }
}

function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    updateBox("days", days);
    updateBox("hours", hours);
    updateBox("minutes", minutes);
    updateBox("seconds", seconds);

    if (distance <= 0) {
        document.getElementById("countdown-boxes").innerHTML =
            "<h2>Happy Independence Day 🇺🇸</h2>";
    }
}

setInterval(updateCountdown, 1000);
updateCountdown();


// ===============================
// THIS DAY IN U.S. HISTORY (FILTERED)
// ===============================
window.addEventListener("DOMContentLoaded", () => {

    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();

    fetch(`https://history.muffinlabs.com/date/${month}/${day}`)
        .then(response => response.json())
        .then(data => {

            // find first US-related event
            const usEvent = data.data.Events.find(event =>
                event.text.includes("United States") ||
                event.text.includes("U.S.") ||
                event.text.includes("America") ||
                event.text.includes("American")
            );

            const eventToShow = usEvent || data.data.Events[0];

            document.getElementById("daily-fact").innerText =
                `This Day in U.S. History: ${eventToShow.year} – ${eventToShow.text}`;
        })
        .catch(() => {
            document.getElementById("daily-fact").innerText =
                "This Day in U.S. History: America has a rich history worth celebrating.";
        });

});
// ===============================
// STATE FACTS
// ===============================
const stateFacts = {
"Alabama": "Alabama was the first state to declare Christmas a legal holiday in 1836.",
"Alaska": "Alaska is the largest U.S. state by land area.",
"Arizona": "Arizona is home to the Grand Canyon.",
"Arkansas": "Arkansas produces over 40% of U.S. rice.",
"California": "California has the largest population of any U.S. state.",
"Colorado": "Colorado has the highest average elevation.",
"Florida": "Florida has the longest coastline in the contiguous U.S.",
"Georgia": "Georgia is known as the Peach State.",
"Hawaii": "Hawaii is the only U.S. state made of islands.",
"Idaho": "Idaho produces about one-third of U.S. potatoes.",
"Illinois": "Illinois is home to Chicago.",
"Indiana": "Indiana hosts the Indianapolis 500.",
"Iowa": "Iowa leads in corn production.",
"Kansas": "Kansas is nicknamed the Sunflower State.",
"Kentucky": "Kentucky is famous for horse racing.",
"Louisiana": "Louisiana is known for Mardi Gras.",
"Maine": "Maine is famous for lobster.",
"Maryland": "Maryland is known for blue crabs.",
"Massachusetts": "Massachusetts is home to the first Thanksgiving.",
"Michigan": "Michigan touches four Great Lakes.",
"Minnesota": "Minnesota is the Land of 10,000 Lakes.",
"Mississippi": "Mississippi is named after the Mississippi River.",
"Missouri": "Missouri is known as the Show-Me State.",
"Montana": "Montana is called Big Sky Country.",
"Nebraska": "Nebraska is a major beef producer.",
"Nevada": "Nevada is home to Las Vegas.",
"New Jersey": "New Jersey is the Garden State.",
"New Mexico": "New Mexico is known as the Land of Enchantment.",
"New York": "New York is home to the Statue of Liberty.",
"North Carolina": "North Carolina is First in Flight.",
"Ohio": "Ohio is the Buckeye State.",
"Oklahoma": "Oklahoma has a rich Native American history.",
"Oregon": "Oregon is known for Crater Lake.",
"Pennsylvania": "Pennsylvania hosted the signing of the Declaration of Independence.",
"South Dakota": "South Dakota has Mount Rushmore.",
"Tennessee": "Tennessee is known for country music.",
"Texas": "Texas is the second-largest state.",
"Utah": "Utah has five national parks.",
"Virginia": "Virginia is the birthplace of eight U.S. presidents.",
"Washington": "Washington produces many apples.",
"Wisconsin": "Wisconsin is America's Dairyland.",
"Wyoming": "Wyoming was the first state to allow women to vote."
};


// ===============================
// MAP
// ===============================
fetch("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json")
.then(res => res.json())
.then(us => {

    const width = 975;
    const height = 610;

    const svg = d3.select("#us-map")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`);

    const projection = d3.geoAlbersUsa()
        .translate([width / 2, height / 2])
        .scale(1300);

    const path = d3.geoPath().projection(projection);

    const states = topojson.feature(us, us.objects.states).features;

    svg.selectAll("path")
        .data(states)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("class", "state")
        .on("click", function(event, d) {

            const stateName = d.properties.name;
            const fact = stateFacts[stateName] || "Fun facts coming soon!";

            document.getElementById("state-info").innerText =
                stateName + ": " + fact;

            d3.selectAll(".state").classed("active", false);
            d3.select(this).classed("active", true);
        });

});

const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

function isJuly4th() {
    const now = new Date(); // automatically uses user's timezone
    return now.getMonth() === 6 && now.getDate() === 4; 
    // Month is 0-indexed (6 = July)
}

let particles = [];

function createFirework() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height / 2;

    for (let i = 0; i < 50; i++) {
        particles.push({
            x: x,
            y: y,
            dx: (Math.random() - 0.5) * 6,
            dy: (Math.random() - 0.5) * 6,
            life: 100
        });
    }
}

function animateFireworks() {
    if (!isJuly4th()) return; // only run on July 4

    requestAnimationFrame(animateFireworks);

    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (Math.random() < 0.05) createFirework();

    particles.forEach((p, i) => {
        p.x += p.dx;
        p.y += p.dy;
        p.life--;

        ctx.fillStyle = `hsl(${Math.random()*360},100%,50%)`;
        ctx.fillRect(p.x, p.y, 3, 3);

        if (p.life <= 0) particles.splice(i, 1);
    });
}

// Start checking every minute
setInterval(() => {
    if (isJuly4th()) {
        animateFireworks();
    }
}, 60000);

// also check immediately on load
if (isJuly4th()) {
    animateFireworks();
}
