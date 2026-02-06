function syntaxHighlight(json) {
  json = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    function (match) {
      let cls = "json-number";
      if (/^"/.test(match)) {
        cls = /:$/.test(match) ? "json-key" : "json-string";
      } else if (/true|false/.test(match)) {
        cls = "json-boolean";
      } else if (/null/.test(match)) {
        cls = "json-null";
      }
      return `<span class="${cls}">${match}</span>`;
    }
  );
}

function renderLineNumbers(text, errorLine = null) {
  const lines = text.split("\n");
  const lineNumbers = document.getElementById("lineNumbers");

  lineNumbers.innerHTML = lines
    .map((_, i) => {
      const lineNo = i + 1;
      return errorLine === lineNo
        ? `<span class="error-line">${lineNo}</span>`
        : `<span>${lineNo}</span>`;
    })
    .join("\n");
}


function beautify() {
  const input = document.getElementById("input").value;
  const output = document.getElementById("output");

  try {
    const obj = JSON.parse(input);
    const pretty = JSON.stringify(obj, null, 2);

    output.innerHTML = syntaxHighlight(pretty);
    renderLineNumbers(pretty);
  } catch (e) {
    handleJsonError(e, input);
  }
}

function minify() {
  const input = document.getElementById("input").value;
  const output = document.getElementById("output");

  try {
    const obj = JSON.parse(input);
    const minified = JSON.stringify(obj);
    output.innerHTML = syntaxHighlight(minified);
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
  const text = output.innerText.trim();
  if (!text) return;

  navigator.clipboard.writeText(text)
    .then(() => {
      copyBtn.textContent = "Copied!";
      setTimeout(() => {
        copyBtn.textContent = "Copy JSON";
      }, 1200);
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

function handleJsonError(error, source) {
  const output = document.getElementById("output");
  const match = error.message.match(/position (\d+)/);

  let errorLine = null;

  if (match) {
    const pos = parseInt(match[1], 10);
    errorLine = source.substring(0, pos).split("\n").length;
  }

  output.textContent = error.message;
  renderLineNumbers(source, errorLine);
}

document.getElementById('download-btn').addEventListener('click', function() {
    // 1. Ambil teks dari textarea/div hasil output Anda
    // Ganti 'output-area' dengan ID elemen tempat hasil beautify Anda muncul
    const jsonContent = document.getElementById('output').value;

    if (!jsonContent) {
        alert('Tidak ada konten untuk diunduh!');
        return;
    }

    try {
        // 2. Validasi apakah itu JSON yang benar sebelum diunduh (opsional tapi bagus)
        JSON.parse(jsonContent);

        // 3. Buat file Blob
        const blob = new Blob([jsonContent], { type: 'application/json' });
        
        // 4. Buat link unduhan sementara
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        // 5. Beri nama file (misal: data.json)
        link.href = url;
        link.download = 'beautified-data.json';
        
        // 6. Simulasikan klik untuk memulai unduhan
        document.body.appendChild(link);
        link.click();
        
        // 7. Bersihkan memori
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } catch (e) {
        alert('Pastikan format JSON sudah benar sebelum mengunduh.');
    }
});
