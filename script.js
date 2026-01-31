function beautify() {
  const input = document.getElementById("input").value;
  const output = document.getElementById("output");

  try {
    const obj = JSON.parse(input);
    output.textContent = JSON.stringify(obj, null, 2);
  } catch (e) {
    output.textContent = "❌ Invalid JSON:\n" + e.message;
  }
}

function minify() {
  const input = document.getElementById("input").value;
  const output = document.getElementById("output");

  try {
    const obj = JSON.parse(input);
    output.textContent = JSON.stringify(obj);
  } catch (e) {
    output.textContent = "❌ Invalid JSON:\n" + e.message;
  }
}

function clearAll() {
  document.getElementById("input").value = "";
  document.getElementById("output").textContent = "";
}

const copyBtn = document.getElementById("copyJsonBtn");
const output = document.getElementById("output");

copyBtn.addEventListener("click", () => {
  const text = output.textContent.trim();

  if (!text) {
    alert("JSON masih kosong");
    return;
  }

  navigator.clipboard.writeText(text)
    .then(() => {
      copyBtn.innerText = "Copied!";
      setTimeout(() => {
        copyBtn.innerText = "Copy JSON";
      }, 1500);
    })
    .catch(() => {
      alert("Gagal menyalin JSON");
    });
});

const darkToggle = document.getElementById("darkToggle");

// load mode
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
  darkToggle.textContent = "☀️ Light Mode";
}

darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("theme", isDark ? "dark" : "light");

  darkToggle.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
});
