const $ = (id) => document.getElementById(id);

const example = {
  "id_caso": "caso 15",
  "estado": "respondido",
  "resumen": "El reglamento de la Tarjeta Débito Nequi Visa establece que el tratamiento de datos se realiza conforme a su política de protección de datos. Para la funcionalidad Click to Pay, Nequi trata datos personales y de la tarjeta, compartiéndolos con Visa y proveedores tecnológicos. El usuario conserva derechos para administrar o desactivar Click to Pay, bloquear o cancelar la tarjeta, presentar reclamos dentro de 90 días y pronunciarse sobre cambios al reglamento en un plazo de 15 días calendario.",
  "privacidad": "Nequi trata los datos personales de acuerdo con su política de protección de datos y autorización. En el servicio Click to Pay, Nequi trata datos personales y de la tarjeta, compartiéndolos con Visa y proveedores tecnológicos únicamente para habilitar, operar, administrar y garantizar la seguridad de los pagos.",
  "derechos_usuario": "El usuario puede administrar, suspender o desactivar Click to Pay; bloquear o cancelar la tarjeta en cualquier momento; presentar reclamos por compras o servicio defectuoso dentro de los 90 días calendario siguientes a la compra; y aceptar o cancelar la tarjeta dentro de los 15 días calendario posteriores a la notificación de cambios en el reglamento.",
  "evidencias": [
    "Para la habilitación de esta funcionalidad, Nequi podrá tratar tus datos personales y los de tu Tarjeta, con el fin de habilitar, operar y administrar Click to Pay.",
    "Esta información podrá ser compartida con la franquicia Visa y con los proveedores tecnológicos que participan en Click to Pay, únicamente para garantizar la seguridad y correcta ejecución de los pagos.",
    "puedes administrar esta funcionalidad cuando quieras, lo que incluye actualizar la información asociada, suspenderla temporalmente o desactivarla",
    "en cualquier momento le puedes pedir a Nequi que cancele la Tarjeta por los medios que hemos indicado en el sitio web nequi.com.co.",
    "las reclamaciones y documentación relacionada con desconocimientos de compras, servicio defectuoso, etc., deberán presentarse ante Nequi dentro de los noventa (90) días calendario siguientes a la fecha de la compra",
    "Después de que se anuncie el cambio, podrás pronunciarte para aceptarlo o cancelar tu Tarjeta, dentro de los quince (15) días calendario siguientes."
  ],
  "advertencias": [
    "Si el usuario no se pronuncia para cancelar la tarjeta dentro de los 15 días calendario posteriores al anuncio de modificaciones en el reglamento y continúa usándola, se aplica la aceptación tácita según el artículo 854 del Código de Comercio.",
    "Nequi no asume responsabilidad por el uso o disponibilidad de Click to Pay en comercios electrónicos ni por compras realizadas en dichos comercios, salvo responsabilidad imputable a Nequi."
  ],
  "asesoria_legal": false
};

const knownFields = new Set([
  "id_caso", "estado", "resumen", "privacidad", "derechos_usuario",
  "evidencias", "advertencias", "asesoria_legal"
]);

const labels = {
  id_caso: "Identificación del caso",
  estado: "Estado",
  resumen: "Resumen del caso",
  privacidad: "Privacidad y tratamiento de datos",
  derechos_usuario: "Derechos del usuario",
  evidencias: "Evidencias documentales",
  advertencias: "Advertencias importantes",
  asesoria_legal: "Asesoría legal"
};

const icons = {
  resumen: "▤",
  privacidad: "⌑",
  derechos_usuario: "⚖",
  evidencias: "❝",
  advertencias: "⚠",
  asesoria_legal: "⚖"
};

function addText(tag, className, value) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  node.textContent = value == null ? "" : String(value);
  return node;
}

function createCard(key, value, full = false) {
  const card = document.createElement("article");
  card.className = `info-card${full ? " full" : ""}`;

  const title = document.createElement("h3");
  title.className = "card-title";
  title.append(
    addText("span", "card-icon", icons[key] || "•"),
    addText("span", "", labels[key] || humanize(key))
  );
  card.append(title);

  if (key === "evidencias" && Array.isArray(value)) {
    const list = document.createElement("div");
    list.className = "evidence-list";
    value.forEach((item, index) => {
      const quote = document.createElement("blockquote");
      quote.className = "evidence-item";
      quote.append(
        addText("span", "evidence-number", `EVIDENCIA ${String(index + 1).padStart(2, "0")}`),
        document.createTextNode(toReadable(item))
      );
      list.append(quote);
    });
    if (!value.length) list.append(addText("p", "muted", "No hay evidencias."));
    card.append(list);
    return card;
  }

  if (key === "advertencias" && Array.isArray(value)) {
    const list = document.createElement("div");
    list.className = "warning-list";
    value.forEach(item => list.append(addText("div", "warning-item", toReadable(item))));
    if (!value.length) list.append(addText("p", "muted", "No hay advertencias registradas."));
    card.append(list);
    return card;
  }

  if (key === "derechos_usuario" && typeof value === "string") {
    const list = document.createElement("div");
    list.className = "rights-list";
    const chunks = value.split(/;\s*(?=[A-ZÁÉÍÓÚ¿])/u).map(s => s.trim()).filter(Boolean);
    chunks.forEach((chunk, index) => {
      const item = document.createElement("div");
      item.className = "right-item";
      item.append(addText("span", "right-symbol", ["✓", "↗", "◷", "§"][index % 4]));
      item.append(addText("p", "", chunk));
      list.append(item);
    });
    card.append(list);
    return card;
  }

  if (Array.isArray(value)) {
    const list = document.createElement("ol");
    list.className = "array-list";
    value.forEach(item => list.append(addText("li", "", toReadable(item))));
    card.append(list);
  } else if (value && typeof value === "object") {
    card.append(renderObject(value));
  } else {
    card.append(addText("div", "card-body", toReadable(value)));
  }
  return card;
}

function humanize(key) {
  return String(key)
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

function renderObject(object) {
  const dl = document.createElement("dl");
  dl.className = "extra-fields";
  Object.entries(object).forEach(([key, value]) => {
    const wrap = document.createElement("div");
    wrap.className = "extra-field";
    wrap.append(addText("dt", "", humanize(key)));
    const dd = document.createElement("dd");
    if (Array.isArray(value)) {
      const list = document.createElement("ul");
      list.className = "array-list";
      value.forEach(item => list.append(addText("li", "", toReadable(item))));
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

function renderResult(data) {
  const result = $("visualResult");
  result.replaceChildren();

  const banner = document.createElement("div");
  banner.className = "case-banner";
  const left = document.createElement("div");
  left.append(
    addText("div", "case-label", "Ficha de análisis"),
    addText("h3", "", data.id_caso ?? "Resultado JSON")
  );
  const statusText = data.estado == null ? "Sin estado" : humanize(String(data.estado));
  const status = addText("span", `status-pill${data.estado == null ? " neutral" : ""}`, statusText);
  banner.append(left, status);
  result.append(banner);

  const grid = document.createElement("div");
  grid.className = "cards-grid";

  const order = ["resumen", "privacidad", "derechos_usuario", "evidencias", "advertencias"];
  order.forEach(key => {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      grid.append(createCard(key, data[key], ["resumen", "evidencias", "advertencias"].includes(key)));
    }
  });

  if (Object.prototype.hasOwnProperty.call(data, "asesoria_legal")) {
    const card = document.createElement("article");
    card.className = "info-card full";
    const row = document.createElement("div");
    row.className = "legal-row";
    const label = document.createElement("h3");
    label.className = "card-title";
    label.append(addText("span", "card-icon", icons.asesoria_legal), document.createTextNode(labels.asesoria_legal));
    row.append(label);
    const value = data.asesoria_legal;
    row.append(addText("span", `bool-pill ${value === true ? "yes" : "no"}`, value === true ? "Sí" : value === false ? "No" : toReadable(value)));
    card.append(row);
    grid.append(card);
  }

  const extras = Object.entries(data).filter(([key]) => !knownFields.has(key));
  if (extras.length) {
    const card = document.createElement("article");
    card.className = "info-card full";
    const title = document.createElement("h3");
    title.className = "card-title";
    title.append(addText("span", "card-icon", "＋"), document.createTextNode("Otros campos"));
    card.append(title, renderObject(Object.fromEntries(extras)));
    grid.append(card);
  }

  if (!grid.children.length) {
    grid.append(createCard("contenido", data, true));
  }
  result.append(grid);
  $("resultMeta").textContent = `${Object.keys(data).length} campos detectados · ${Array.isArray(data.evidencias) ? data.evidencias.length + " evidencias" : "sin lista de evidencias"}`;
  $("resultSection").hidden = false;
  $("prettyCode").textContent = JSON.stringify(data, null, 2);
  $("prettyJson").hidden = true;
  $("showRaw").textContent = "Ver JSON formateado";
  $("resultSection").scrollIntoView({ behavior: "smooth", block: "start" });
}

function processInput() {
  const raw = $("jsonInput").value.trim();
  $("errorBox").hidden = true;
  if (!raw) {
    showError("Pega un JSON en el cuadro antes de procesar.");
    return;
  }
  try {
    const parsed = JSON.parse(raw);
    if (parsed === null || typeof parsed !== "object") {
      showError("El JSON debe ser un objeto o una lista, no un valor aislado.");
      return;
    }
    if (Array.isArray(parsed)) {
      const data = { resultados: parsed };
      renderGenericArray(data);
    } else {
      renderResult(parsed);
    }
  } catch (error) {
    showError(`El JSON no es válido. Revisa las comillas, comas y llaves.\nDetalle: ${error.message}`);
  }
}

function renderGenericArray(data) {
  renderResult(data);
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
    $("copyJson").textContent = "Seleccionado";
  }
});
$("showRaw").addEventListener("click", () => {
  const panel = $("prettyJson");
  panel.hidden = !panel.hidden;
  $("showRaw").textContent = panel.hidden ? "Ver JSON formateado" : "Ocultar JSON";
});
$("themeToggle").addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
  const dark = document.documentElement.classList.contains("dark");
  $("themeToggle").textContent = dark ? "☀ Tema" : "☾ Tema";
});

$("jsonInput").value = JSON.stringify(example, null, 2);
processInput();
