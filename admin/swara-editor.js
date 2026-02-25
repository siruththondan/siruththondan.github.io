// ===============================
// 🎵 Thalam Calculator
// ===============================
function calculateThalam(thalam, jaathi) {

  const jaathiMap = {
    Thisra: 3,
    Chatusra: 4,
    Khanda: 5,
    Misra: 7,
    Sankeerna: 9
  };

  const jaathiValue = jaathiMap[jaathi] || 4;

  switch (thalam) {
    case "Dhruva": return jaathiValue + 2 + jaathiValue + jaathiValue;
    case "Matya": return jaathiValue + 2 + jaathiValue;
    case "Rupaka": return 2 + jaathiValue;
    case "Jhampa": return jaathiValue + 1 + 2;
    case "Triputa": return jaathiValue + 2 + 2;
    case "Ata": return jaathiValue + jaathiValue + 2 + 2;
    case "Eka": return jaathiValue;
    default: return 0;
  }
}

// ===============================
// 🔧 Helper
// ===============================
function getLineText(item) {
  if (!item) return "";
  if (typeof item === "string") return item;
  if (typeof item === "object") return item.line || "";
  return "";
}

// ===============================
// 🎵 Swara Editor Component
// ===============================
CMS.registerEditorComponent({

  id: "swara",
  label: "Swara Block",

  fields: [

    {
      name: "ragam",
      label: "Ragam",
      widget: "string"
    },

    {
      name: "mode",
      label: "Mode",
      widget: "select",
      default: "traditional",
      options: [
        { label: "Traditional (Thalam + Jaathi)", value: "traditional" },
        { label: "Custom Groups", value: "custom" }
      ]
    },

    {
      name: "thalam",
      label: "Thalam [Traditional only]",
      widget: "select",
      default: "Triputa",
      options: ["Dhruva", "Matya", "Rupaka", "Jhampa", "Triputa", "Ata", "Eka"]
    },

    {
      name: "jaathi",
      label: "Jaathi [Traditional only]",
      widget: "select",
      default: "Chatusra",
      options: ["Thisra", "Chatusra", "Khanda", "Misra", "Sankeerna"]
    },

    {
      name: "groups",
      label: "Number of Groups [Custom only]",
      widget: "number",
      default: 4,
      value_type: "int"
    },

    {
      name: "per_group",
      label: "Swaras Per Group [Custom only]",
      widget: "number",
      default: 4,
      value_type: "int"
    },

    {
      name: "double_bar",
      label: "End with ||",
      widget: "boolean",
      default: false
    },

    {
      name: "composer",
      label: "Composer (Optional)",
      widget: "string",
      required: false
    },

    {
      name: "lines",
      label: "Swara Lines",
      widget: "list",
      summary: "{{fields.line}}",
      field: {
        name: "line",
        label: "Swara Line",
        widget: "string"
      }
    },
    // ===============================
    // 🎼 Shruti Mapping
    // ===============================
    {
      name: "r",
      label: "Ri (R)",
      widget: "select",
      default: "R2",
      options: ["R1", "R2", "R3"]
    },

    {
      name: "g",
      label: "Ga (G)",
      widget: "select",
      default: "G3",
      options: ["G1", "G2", "G3"]
    },

    {
      name: "m",
      label: "Ma (M)",
      widget: "select",
      default: "M1",
      options: ["M1", "M2"]
    },

    {
      name: "d",
      label: "Da (D)",
      widget: "select",
      default: "D2",
      options: ["D1", "D2", "D3"]
    },

    {
      name: "n",
      label: "Ni (N)",
      widget: "select",
      default: "N3",
      options: ["N1", "N2", "N3"]
    },

    // ===============================
    // 🎵 Playback Controls
    // ===============================
    {
      name: "bpm",
      label: "BPM",
      widget: "number",
      default: 72,
      value_type: "int"
    },

    {
      name: "octave",
      label: "Base Octave",
      widget: "number",
      default: 4,
      value_type: "int"
    }

  ],

  // ===============================
  // 🔍 Pattern Detection
  // ===============================
  pattern: /{{<\s*swara\s+([^>]*)>}}([\s\S]*?){{<\s*\/swara\s*>}}/,

  // ===============================
  // 📥 Markdown → Form
  // ===============================
  fromBlock: function (match) {

    const attrsString = match[1];
    const body = match[2].trim();

    const attrs = {};
    const attrRegex = /(\w+)="([^"]*)"/g;
    let attrMatch;

    while ((attrMatch = attrRegex.exec(attrsString))) {
      attrs[attrMatch[1]] = attrMatch[2];
    }

    const lines = body
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => ({ line }));

    return {
      ragam: attrs.ragam || "",
      mode: attrs.mode || "traditional",
      thalam: attrs.thalam || "Triputa",
      jaathi: attrs.jaathi || "Chatusra",
      groups: attrs.groups ? parseInt(attrs.groups) : 4,
      per_group: attrs.per_group ? parseInt(attrs.per_group) : 4,
      double_bar: attrs.double_bar === "true",
      composer: attrs.composer || "",
      r: attrs.r || "R2",
      g: attrs.g || "G3",
      m: attrs.m || "M1",
      d: attrs.d || "D2",
      n: attrs.n || "N3",
      bpm: attrs.bpm ? parseInt(attrs.bpm) : 72,
      octave: attrs.octave ? parseInt(attrs.octave) : 4,
      lines: lines
    };
  },

  // ===============================
  // 📤 Form → Markdown
  // ===============================
  toBlock: function (obj) {

    if (!obj.ragam) {
      return `{{< swara ragam="" >}}\n{{< /swara >}}`;
    }

    const mode = obj.mode || "traditional";
    let attrs = `ragam="${obj.ragam}" mode="${mode}"`;
    attrs += ` r="${obj.r || "R2"}"`;
    attrs += ` g="${obj.g || "G3"}"`;
    attrs += ` m="${obj.m || "M1"}"`;
    attrs += ` d="${obj.d || "D2"}"`;
    attrs += ` n="${obj.n || "N3"}"`;
    attrs += ` bpm="${obj.bpm || 72}"`;
    attrs += ` octave="${obj.octave || 4}"`;
    let totalSwaras = 0;

    if (mode === "traditional") {
      const thalam = obj.thalam || "Triputa";
      const jaathi = obj.jaathi || "Chatusra";
      totalSwaras = calculateThalam(thalam, jaathi);
      attrs += ` thalam="${thalam}" jaathi="${jaathi}"`;
    } else {
      const groups = parseInt(obj.groups) || 4;
      const per_group = parseInt(obj.per_group) || 4;
      totalSwaras = groups * per_group;
      attrs += ` groups="${groups}" per_group="${per_group}"`;
    }

    // ✅ Validate swara count per line
    if (Array.isArray(obj.lines) && totalSwaras > 0) {
      const invalidLines = [];

      obj.lines.forEach((item, index) => {
        const lineText = getLineText(item);

        if (lineText.trim() !== "") {
          const swaraCount = lineText.trim().split(/\s+/).length;

          if (swaraCount !== totalSwaras) {
            invalidLines.push({
              lineNumber: index + 1,
              line: lineText,
              count: swaraCount
            });
          }
        }
      });

      if (invalidLines.length > 0) {
        const errorMsg = invalidLines.map(e =>
          `Line ${e.lineNumber}: found ${e.count} swaras, expected ${totalSwaras}\n  → ${e.line}`
        ).join("\n\n");
        alert(`⚠️ Swara count mismatch (expected ${totalSwaras} per line):\n\n${errorMsg}`);
      }
    }

    attrs += ` total_swaras="${totalSwaras}"`;
    if (obj.double_bar) attrs += ` double_bar="true"`;
    if (obj.composer) attrs += ` composer="${obj.composer}"`;

    let notation = "";
    if (Array.isArray(obj.lines)) {
      obj.lines.forEach(item => {
        const lineText = getLineText(item);
        if (lineText) notation += lineText + "\n";
      });
    }

    return `{{< swara ${attrs} >}}\n${notation.trim()}\n{{< /swara >}}`;
  },

  // ===============================
  // 👁 Preview Renderer
  // ===============================
  toPreview: function (obj) {

    let html = `<div style="padding:12px;border:1px solid #ddd;border-radius:6px;background:#fafafa;">`;

    html += `<strong>Ragam:</strong> ${obj.ragam || ""}<br/>`;
    html += `<strong>Mode:</strong> ${obj.mode || ""}<br/>`;

    if (obj.mode === "traditional") {
      html += `<strong>Thalam:</strong> ${obj.thalam || ""}<br/>`;
      html += `<strong>Jaathi:</strong> ${obj.jaathi || ""}<br/>`;
    } else {
      html += `<strong>Groups:</strong> ${obj.groups || ""}<br/>`;
      html += `<strong>Per Group:</strong> ${obj.per_group || ""}<br/>`;
    }

    if (obj.composer) {
      html += `<strong>Composer:</strong> ${obj.composer}<br/>`;
    }

    html += `<strong>R:</strong> ${obj.r || ""} &nbsp; `;
    html += `<strong>G:</strong> ${obj.g || ""} &nbsp; `;
    html += `<strong>M:</strong> ${obj.m || ""} &nbsp; `;
    html += `<strong>D:</strong> ${obj.d || ""} &nbsp; `;
    html += `<strong>N:</strong> ${obj.n || ""}<br/>`;

    html += `<strong>BPM:</strong> ${obj.bpm || 72} &nbsp; `;
    html += `<strong>Octave:</strong> ${obj.octave || 4}<br/>`;

    html += `<hr/>`;

    if (Array.isArray(obj.lines)) {
      obj.lines.forEach(item => {
        const lineText = getLineText(item);
        if (lineText) html += `${lineText}<br/>`;
      });
    }

    html += `</div>`;

    return html;
  }

});