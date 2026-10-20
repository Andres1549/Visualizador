const $ = (id) => document.getElementById(id);

const example = {
  "id_caso": "T01",
  "nombre_aplicacion": "Ejemplo de red social",
  "jurisdiccion": "No especificada",
  "estado": "respondido",
  "resumen": "El fragmento indica que cierta información puede recopilarse para operar el servicio. No especifica en el texto suministrado todos los detalles sobre conservación de datos ni todos los mecanismos disponibles para ejercer derechos.",
  "privacidad": "El fragmento señala que la aplicación puede recopilar información de uso para operar y mejorar el servicio. No especifica en el fragmento qué plazo de conservación se aplica.",
  "derechos_usuario": "El usuario puede solicitar acceso a cierta información según las condiciones descritas en el fragmento. No especificado en el fragmento si existe un mecanismo de eliminación para todos los datos.",
  "evidencias": [
    "La aplicación puede recopilar información sobre cómo utilizas el servicio.",
    "Puedes solicitar acceso a determinada información de tu cuenta."
  ],
  "advertencias": [
    "El ejemplo es ilustrativo y no corresponde a una política real. Sustituye este contenido por el JSON generado por tu sistema."
  ],
  "asesoria_legal": false
};

const knownFields = new Set([
  "id_caso", "estado", "resumen", "privacidad", "derechos_usuario",
  "evidencias", "advertencias", "asesoria_legal"
]);

const labels = {
  id_caso: "Identificador del caso",
  estado: "Estado del análisis",
  resumen: "Resumen del fragmento",
  privacidad: "Privacidad y datos personales",
  derechos_usuario: "Derechos del usuario",
  evidencias: "Evidencias textuales",
  advertencias: "Advertencias y límites",
  asesoria_legal: "Asesoría legal",
  nombre_aplicacion: "Aplicación",
  aplicacion: "Aplicación",
  nombre_de_aplicacion: "Aplicación",
  jurisdiccion: "Jurisdicción",
  fragmento_tos: "Fragmento analizado",
  fragmento: "Fragmento analizado",
  fuente: "Fuente",
  plataforma: "Plataforma"
};

const icons = {
  resumen: "▤", privacidad: "⌑", derechos_usuario: "⚖",
  evidencias: "❝", advertencias: "⚠", asesoria_legal: "§"
};

function textNode(tag, className, value) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  node.textContent = value == null ? "" : String(value);
  return node;
}

function humanize(key) {
  return labels[key] || String(key)
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, char => char.toUpperCase());
}

function toReadable(value) {
  if (value === true) return "Sí";
  if (value === false) return "No";
  if (value === null) return "Nulo";
  if (typeof value === "object") return JSON.stringify(value, null, 2);
  return String(value);
}

function createCard(key, value, full = false) {
  const card = document.createElement("article");
  card.className = `info-card${full ? " full" : ""}`;

  const title = document.createElement("h3");
  title.className = "card-title";
  title.append(
    textNode("span", "card-icon", icons[key] || "•"),
    textNode("span", "", humanize(key))
  );
  card.append(title);

  if (key === "evidencias") {
    if (!Array.isArray(value) || value.length === 0) {
      card.append(textNode("div", "empty-state", "No se proporcionaron citas textuales en este resultado."));
      return card;
    }
    const list = document.createElement("div");
    list.className = "evidence-list";
    value.forEach((item, index) => {
      const quote = document.createElement("blockquote");
      quote.className = "evidence-item";
      quote.append(
        textNode("span", "evidence-number", `CITA TEXTUAL ${String(index + 1).padStart(2, "0")}`),
        document.createTextNode(toReadable(item))
      );
      list.append(quote);
    });
    card.append(list);
    return card;
  }

  if (key === "advertencias") {
    if (!Array.isArray(value) || value.length === 0) {
      card.append(textNode("div", "empty-state", "No se registraron advertencias en el JSON."));
      return card;
    }
    const list = document.createElement("div");
    list.className = "warning-list";
    value.forEach((item, index) => {
      const warning = document.createElement("div");
      warning.className = "warning-item";
      warning.append(
        textNode("span", "warning-label", `NOTA ${String(index + 1).padStart(2, "0")}`),
        document.createTextNode(toReadable(item))
      );
      list.append(warning);
    });
    card.append(list);
    return card;
  }

  if (key === "derechos_usuario" && typeof value === "string") {
    const absence = value.toLowerCase().includes("no especificado en el fragmento");
    const body = textNode("div", "card-body", value);
    card.append(body);
    if (absence) card.append(textNode("div", "absence-note", "El propio resultado indica que parte de la información no está especificada en el fragmento."));
    return card;
  }

  if (Array.isArray(value)) {
    const list = document.createElement("ol");
    list.className = "array-list";
    value.forEach(item => list.append(textNode("li", "", toReadable(item))));
    card.append(list);
  } else if (value && typeof value === "object") {
    card.append(renderObject(value));
  } else {
    card.append(textNode("div", "card-body", toReadable(value)));
    if (typeof value === "string" && value.toLowerCase().includes("no especificado en el fragmento")) {
      card.append(textNode("div", "absence-note", "El texto indica que este punto no está especificado en el fragmento."));
    }
  }
  return card;
}

function renderObject(object) {
  const dl = document.createElement("dl");
  dl.className = "extra-fields";
  Object.entries(object).forEach(([key, value]) => {
    const wrap = document.createElement("div");
    wrap.className = "extra-field";
    wrap.append(textNode("dt", "", humanize(key)));
    const dd = document.createElement("dd");
    if (Array.isArray(value)) {
      const list = document.createElement("ul");
      list.className = "array-list";
      value.forEach(item => list.append(textNode("li", "", toReadable(item))));
      dd.append(list);
    } else if (value && typeof value === "object") {
      dd.textContent = JSON.stringify(value, null, 2);
    } else {
      dd.textContent = toReadable(value);
    }
    wrap.append(dd);
    dl.append(wrap);
  });
  return dl;
}

function getStatusInfo(status) {
  const normalized = String(status ?? "").toLowerCase().trim();
  if (normalized === "respondido") return { label: "Respondido", className: "", description: "El sistema indica que encontró evidencia suficiente." };
  if (normalized === "informacion_insuficiente" || normalized === "información_insuficiente") {
    return { label: "Información insuficiente", className: "insufficient", description: "El sistema indica que falta texto o un detalle esencial." };
  }
  if (normalized === "abstencion" || normalized === "abstención") {
    return { label: "Abstención", className: "abstention", description: "El sistema indica que no puede concluir con seguridad a partir del fragmento." };
  }
  return { label: status == null ? "Estado no indicado" : humanize(normalized), className: "unknown", description: "" };
}

function renderResult(data) {
  const result = $("visualResult");
  result.replaceChildren();

  if (Array.isArray(data)) data = { resultados: data };

  const banner = document.createElement("div");
  banner.className = "case-banner";
  const left = document.createElement("div");
  left.append(
    textNode("div", "case-overline", "FICHA DE EXTRACCIÓN"),
    textNode("h3", "", data.id_caso ?? "Caso sin identificador")
  );

  const appName = data.nombre_aplicacion ?? data.aplicacion ?? data.nombre_de_aplicacion;
  const jurisdiction = data.jurisdiccion;
  const contextParts = [];
  if (appName != null && String(appName).trim()) contextParts.push(`Aplicación: ${appName}`);
  if (jurisdiction != null && String(jurisdiction).trim()) contextParts.push(`Jurisdicción: ${jurisdiction}`);
  if (contextParts.length) left.append(textNode("div", "case-context", contextParts.join("  ·  ")));

  const statusInfo = getStatusInfo(data.estado);
  const status = textNode("span", `status-pill ${statusInfo.className}`, statusInfo.label);
  banner.append(left, status);
  result.append(banner);

  if (statusInfo.description) {
    const statusDescription = textNode("p", "result-meta", statusInfo.description);
    statusDescription.style.margin = "-5px 2px 0";
    result.append(statusDescription);
  }

  const grid = document.createElement("div");
  grid.className = "cards-grid";

  const order = ["resumen", "privacidad", "derechos_usuario", "evidencias", "advertencias"];
  order.forEach(key => {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      grid.append(createCard(key, data[key], ["resumen", "evidencias", "advertencias"].includes(key)));
    } else if (["resumen", "privacidad", "derechos_usuario", "evidencias", "advertencias"].includes(key)) {
      // The visualizer intentionally does not invent missing content.
    }
  });

  if (Object.prototype.hasOwnProperty.call(data, "asesoria_legal")) {
    const card = document.createElement("article");
    card.className = "info-card full";
    const row = document.createElement("div");
    row.className = "legal-row";
    const title = document.createElement("h3");
    title.className = "card-title";
    title.append(textNode("span", "card-icon", icons.asesoria_legal), document.createTextNode(labels.asesoria_legal));
    row.append(title);
    const value = data.asesoria_legal;
    const badgeClass = value === false ? "no" : value === true ? "yes" : "other";
    const badgeText = value === false ? "No · false" : value === true ? "Sí · true" : toReadable(value);
    row.append(textNode("span", `bool-pill ${badgeClass}`, badgeText));
    card.append(row);
    card.append(textNode("p", "muted", "Campo informativo recibido del sistema; no constituye una evaluación jurídica."));
    grid.append(card);
  }

  const excluded = new Set([...knownFields, "nombre_aplicacion", "aplicacion", "nombre_de_aplicacion", "jurisdiccion"]);
  const extras = Object.entries(data).filter(([key]) => !excluded.has(key));
  if (extras.length) {
    const card = document.createElement("article");
    card.className = "info-card full";
    const title = document.createElement("h3");
    title.className = "card-title";
    title.append(textNode("span", "card-icon", "＋"), document.createTextNode("Otros datos recibidos"));
    card.append(title, renderObject(Object.fromEntries(extras)));
    grid.append(card);
  }

  if (!grid.children.length) grid.append(createCard("contenido", data, true));
  result.append(grid);

  const evidenceCount = Array.isArray(data.evidencias) ? data.evidencias.length : 0;
  $("resultMeta").textContent = `${Object.keys(data).length} campos recibidos · ${evidenceCount} ${evidenceCount === 1 ? "cita textual" : "citas textuales"}`;
  $("resultSection").hidden = false;
  $("prettyCode").textContent = JSON.stringify(data, null, 2);
  $("prettyJson").hidden = true;
  $("showRaw").textContent = "{ } Ver JSON";
  $("resultSection").scrollIntoView({ behavior: "smooth", block: "start" });
}

function processInput() {
  const raw = $("jsonInput").value.trim();
  $("errorBox").hidden = true;
  if (!raw) {
    showError("Pega el JSON generado por tu sistema antes de continuar.");
    return;
  }
  try {
    const parsed = JSON.parse(raw);
    if (parsed === null || typeof parsed !== "object") {
      showError("Se esperaba un objeto o una lista JSON.");
      return;
    }
    renderResult(parsed);
  } catch (error) {
    showError(`El JSON no es válido. Comprueba las comillas, comas y llaves.\nDetalle: ${error.message}`);
  }
}

function showError(message) {
  $("errorBox").textContent = message;
  $("errorBox").hidden = false;
}

$("processJson").addEventListener("click", processInput);
$("loadExample").addEventListener("click", () => {
  $("jsonInput").value = JSON.stringify(example, null, 2);
  $("errorBox").hidden = true;
  processInput();
});
$("clearInput").addEventListener("click", () => {
  $("jsonInput").value = "";
  $("errorBox").hidden = true;
  $("resultSection").hidden = true;
  $("jsonInput").focus();
});
$("copyJson").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText($("prettyCode").textContent);
    $("copyJson").textContent = "Copiado ✓";
    setTimeout(() => $("copyJson").textContent = "Copiar JSON", 1600);
  } catch {
    const range = document.createRange();
    range.selectNodeContents($("prettyCode"));
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    $("copyJson").textContent = "JSON seleccionado";
  }
});
$("showRaw").addEventListener("click", () => {
  const panel = $("prettyJson");
  panel.hidden = !panel.hidden;
  $("showRaw").textContent = panel.hidden ? "{ } Ver JSON" : "Ocultar JSON";
});
$("themeToggle").addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
  const dark = document.documentElement.classList.contains("dark");
  $("themeToggle").textContent = dark ? "☀" : "☾";
  $("themeToggle").setAttribute("aria-label", dark ? "Cambiar a tema claro" : "Cambiar a tema oscuro");
});

$("jsonInput").value = JSON.stringify(example, null, 2);
processInput();
