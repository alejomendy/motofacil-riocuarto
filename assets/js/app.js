/* =========================================================
   Moto Fácil Río Cuarto — catálogo, simulador y trámite
   ========================================================= */
(function () {
  "use strict";

  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

  const fmtPesos = (n) =>
    "$" + Math.round(n).toLocaleString("es-AR", { maximumFractionDigits: 0 });

  const waLink = (texto) =>
    "https://wa.me/" + NEGOCIO.whatsapp + (texto ? "?text=" + encodeURIComponent(texto) : "");

  /** Cuota de una moto para un plan/opción dados, descontando anticipo. */
  function calcular(precio, opcion, anticipo) {
    const base = Math.max(precio - (anticipo || 0), 0);
    const total = base * opcion.coef;
    return { base, total, cuota: opcion.cuotas ? total / opcion.cuotas : total };
  }

  /** Cuota más baja posible entre todos los planes, sin anticipo. */
  function cuotaDesde(moto) {
    let min = Infinity;
    PLANES.forEach((p) =>
      p.opciones.forEach((o) => {
        const c = calcular(moto.precio, o, 0).cuota;
        if (c < min) min = c;
      })
    );
    return min;
  }

  const PLACEHOLDER = `
    <div class="ph">
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M19 13a4 4 0 1 0 .001 8.001A4 4 0 0 0 19 13Zm0 6a2 2 0 1 1 .001-4.001A2 2 0 0 1 19 19ZM5 13a4 4 0 1 0 .001 8.001A4 4 0 0 0 5 13Zm0 6a2 2 0 1 1 .001-4.001A2 2 0 0 1 5 19ZM20 8h-3l-1.2-2.4A1 1 0 0 0 15 5h-3v2h2.4l1 2H9.6L7.4 6.2A2 2 0 0 0 5.8 5.4L3 5v2l2.6.4L9 12H5v2h5.5l3-4H17l1.2 2.4 1.8-.9L19 9h1V8Z"/>
      </svg>
      <span>Foto a cargar</span>
    </div>`;

  /** Estilo y foto de referencia de cada tipo de moto para las cards de categoría. */
  const TIPO_META = {
    Cub: {
      t1: "#453e8c", t2: "#5a51b8",
      desc: "Prácticas, livianas y económicas para el uso diario.",
      img: "assets/img/motos/honda-wave-110.jpg"
    },
    Street: {
      t1: "#5a51b8", t2: "#8478e0",
      desc: "Equilibrio entre potencia y comodidad en la ciudad.",
      img: "assets/img/motos/yamaha-fzs-150.jpg"
    },
    Enduro: {
      t1: "#e87b33", t2: "#f4964f",
      desc: "Para el asfalto y el camino de tierra, sin miedo.",
      img: "assets/img/motos/corven-triax-150.jpg"
    }
  };

  const filtros = { marca: "", tipo: "", cuotaMax: 0, tab: "destacadas" };

  /* =========================================================
     Bloques estáticos
     ========================================================= */
  function renderEstaticos() {
    const saludo = "Hola! Vi el catálogo online de Moto Fácil y quiero hacer una consulta.";
    ["headerWa", "cWa", "waFloat", "ctaWa"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.href = waLink(saludo);
    });

    $("#tbTel").href = "tel:+" + NEGOCIO.whatsapp;
    $("#tbTelTxt").textContent = NEGOCIO.telefonoVisible;
    $("#tbIg").href = NEGOCIO.instagram;
    $("#fIg").href = NEGOCIO.instagram;

    $("#cDireccion").textContent = NEGOCIO.direccion;
    $("#fDireccion").textContent = NEGOCIO.direccion + " · Tel. " + NEGOCIO.telefonoVisible;
    $("#cTel").textContent = NEGOCIO.telefonoVisible;
    $("#cIg").href = NEGOCIO.instagram;
    $("#mapaFrame").src = NEGOCIO.mapa;

    $("#cHorarios").innerHTML = NEGOCIO.horarios
      .map((h) => `<div><span>${h.dias}</span><span>${h.horas}</span></div>`)
      .join("");

    $("#planesGrid").innerHTML = PLANES.map(
      (p, i) => `
      <article class="plan">
        <div class="plan-top">
          <span class="plan-n">0${i + 1}</span>
          <h3>${p.nombre}</h3>
        </div>
        <div class="plan-bottom">
          <p>${p.bajada}</p>
          <ul>${p.requisitos.map((r) => `<li><span>${r}</span></li>`).join("")}</ul>
          <div class="chips">${p.opciones.map((o) => `<span>${o.cuotas} cuotas</span>`).join("")}</div>
        </div>
      </article>`
    ).join("");

    $("#faqList").innerHTML = FAQS.map(
      (f) => `<details><summary>${f.q}</summary><p>${f.a}</p></details>`
    ).join("");
  }

  /* =========================================================
     Categorías (tipo)
     ========================================================= */
  function renderTipos() {
    const tipos = Array.from(new Set(MOTOS.map((m) => m.tipo)));
    $("#tipoGrid").innerHTML = tipos
      .map((t) => {
        const n = MOTOS.filter((x) => x.tipo === t).length;
        const meta = TIPO_META[t] || { t1: "#453e8c", t2: "#5a51b8", desc: "" };
        return `
        <button class="tipo-card" type="button" data-tipo="${t}"
                style="--t1:${meta.t1};--t2:${meta.t2}">
          ${meta.img ? `<img class="tipo-img" src="${meta.img}" alt="" loading="lazy">` : ""}
          <span class="tipo-body">
            <span class="qty">${n} ${n === 1 ? "modelo" : "modelos"}</span>
            <h3>${t}</h3>
            <p>${meta.desc}</p>
          </span>
        </button>`;
      })
      .join("");

    $("#tipoGrid").addEventListener("click", (e) => {
      const b = e.target.closest("[data-tipo]");
      if (!b) return;
      const tipo = b.dataset.tipo;
      filtros.tipo = filtros.tipo === tipo ? "" : tipo;
      filtros.tab = "todas";
      sincronizarControles();
      renderGrid();
      $("#catalogo").scrollIntoView({ behavior: "smooth" });
    });
  }

  /** Deja tabs, selects y tiles de categoría coherentes con el estado. */
  function sincronizarControles() {
    $$("#tipoGrid .tipo-card").forEach((b) =>
      b.classList.toggle("on", b.dataset.tipo === filtros.tipo)
    );
    $$("#tabs .tab").forEach((t) => t.classList.toggle("on", t.dataset.tab === filtros.tab));
    $("#fMarca").value = filtros.marca;
    $("#fTipo").value = filtros.tipo;
  }

  /* =========================================================
     Catálogo
     ========================================================= */
  function poblarFiltros() {
    const unico = (arr) => Array.from(new Set(arr)).sort();
    $("#fMarca").insertAdjacentHTML(
      "beforeend",
      unico(MOTOS.map((m) => m.marca)).map((m) => `<option value="${m}">${m}</option>`).join("")
    );
    $("#fTipo").insertAdjacentHTML(
      "beforeend",
      unico(MOTOS.map((m) => m.tipo)).map((t) => `<option value="${t}">${t}</option>`).join("")
    );

    const tope = Math.ceil(Math.max(...MOTOS.map(cuotaDesde)) / 10000) * 10000;
    $("#fCuota").max = tope;
    $("#fCuota").value = 0;
  }

  function pasaTab(m) {
    if (filtros.tab === "destacadas") return m.destacada;
    if (filtros.tab === "110") return m.cilindrada <= 110;
    if (filtros.tab === "150") return m.cilindrada >= 125;
    return true;
  }

  function motosFiltradas() {
    const base = (incluirTab) => MOTOS.filter((m) => {
      if (filtros.marca && m.marca !== filtros.marca) return false;
      if (filtros.tipo && m.tipo !== filtros.tipo) return false;
      if (filtros.cuotaMax && cuotaDesde(m) > filtros.cuotaMax) return false;
      return incluirTab ? pasaTab(m) : true;
    });
    // Si la pestaña "destacadas" queda vacía por los filtros, mostramos todo igual.
    let lista = base(true);
    if (!lista.length && filtros.tab === "destacadas") lista = base(false);
    return lista.sort((a, b) => b.destacada - a.destacada || a.precio - b.precio);
  }

  function renderGrid() {
    const lista = motosFiltradas();

    $("#grid").innerHTML = lista
      .map((m) => {
        const desde = cuotaDesde(m);
        const hay = m.stock !== "pedido";
        return `
        <article class="card" data-id="${m.id}" tabindex="0" role="button"
                 aria-label="Ver ${m.marca} ${m.modelo} y simular cuota">
          <div class="card-media">
            ${m.img ? `<img src="${m.img}" alt="${m.marca} ${m.modelo}" loading="lazy">` : PLACEHOLDER}
            ${m.destacada ? `<span class="cinta">Más elegida</span>` : ""}
            <span class="stock ${hay ? "ok" : "pedido"}">${hay ? "En piso" : "A pedido"}</span>
            <div class="card-tag"><small>Desde</small><b>${fmtPesos(desde)}</b><span>por mes</span></div>
          </div>
          <div class="card-body">
            <span class="card-marca">${m.marca}</span>
            <h3 class="card-modelo">${m.modelo}</h3>
            <div class="card-specs">
              <span>${m.cilindrada} cc</span><span>${m.tipo}</span><span>${m.specs.transmision}</span>
            </div>
            <div class="card-foot">
              <span class="p-lista">Contado ${fmtPesos(m.precio)}</span>
              <button class="card-cta" type="button">Simular crédito</button>
            </div>
          </div>
        </article>`;
      })
      .join("");

    $("#vacio").hidden = lista.length !== 0;
    $("#resultadoCount").textContent =
      lista.length === 1 ? "1 moto encontrada" : lista.length + " motos encontradas";
    sincronizarControles();
  }

  function bindControles() {
    $("#tabs").addEventListener("click", (e) => {
      const t = e.target.closest(".tab");
      if (!t) return;
      filtros.tab = t.dataset.tab;
      renderGrid();
    });

    $("#fMarca").addEventListener("change", (e) => {
      filtros.marca = e.target.value;
      if (filtros.marca) filtros.tab = "todas";
      renderGrid();
    });
    $("#fTipo").addEventListener("change", (e) => {
      filtros.tipo = e.target.value;
      if (filtros.tipo) filtros.tab = "todas";
      renderGrid();
    });
    $("#fCuota").addEventListener("input", (e) => {
      filtros.cuotaMax = Number(e.target.value);
      $("#fCuotaVal").textContent = filtros.cuotaMax ? fmtPesos(filtros.cuotaMax) : "sin límite";
      renderGrid();
    });

    $("#limpiarFiltros").addEventListener("click", () => {
      filtros.marca = filtros.tipo = "";
      filtros.cuotaMax = 0;
      filtros.tab = "destacadas";
      $("#fCuota").value = 0;
      $("#fCuotaVal").textContent = "sin límite";
      renderGrid();
    });

    $("#grid").addEventListener("click", (e) => {
      const card = e.target.closest(".card");
      if (card) abrirModal(card.dataset.id);
    });
    $("#grid").addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const card = e.target.closest(".card");
      if (card) { e.preventDefault(); abrirModal(card.dataset.id); }
    });
  }

  /* =========================================================
     Modal: ficha, simulador y formulario
     ========================================================= */
  const sel = { moto: null, planId: PLANES[0].id, cuotas: PLANES[0].opciones[0].cuotas, anticipo: 0 };

  const planActual = () => PLANES.find((p) => p.id === sel.planId);
  const opcionActual = () => {
    const p = planActual();
    return p.opciones.find((o) => o.cuotas === sel.cuotas) || p.opciones[0];
  };

  function abrirModal(id) {
    const moto = MOTOS.find((m) => m.id === id);
    if (!moto) return;
    sel.moto = moto;
    sel.planId = PLANES[0].id;
    sel.cuotas = PLANES[0].opciones[0].cuotas;
    sel.anticipo = 0;

    $("#modalBody").innerHTML = plantillaModal(moto);
    $("#modal").hidden = false;
    document.body.classList.add("lock");
    bindModal();
    actualizarResumen();
    $("#modal .modal-x").focus();
  }

  function cerrarModal() {
    $("#modal").hidden = true;
    $("#modalBody").innerHTML = "";
    document.body.classList.remove("lock");
  }

  function plantillaModal(m) {
    return `
      ${m.img
        ? `<div class="m-media"><img src="${m.img}" alt="${m.marca} ${m.modelo}"></div>`
        : `<div class="m-media m-media-ph">${PLACEHOLDER}</div>`}
      <div class="m-head">
        <span class="m-kicker">${m.marca} · ${m.cilindrada} cc · ${m.tipo}</span>
        <h3 class="m-titulo" id="mTitulo">${m.modelo}</h3>
      </div>
      <p class="m-detalle">${m.detalle}</p>

      <div class="specs">
        <div><small>Motor</small>${m.specs.motor}</div>
        <div><small>Arranque</small>${m.specs.arranque}</div>
        <div><small>Transmisión</small>${m.specs.transmision}</div>
        <div><small>Frenos</small>${m.specs.freno}</div>
      </div>

      <div class="sim">
        <p class="step-t"><b>1</b> Elegí cómo financiar</p>
        <div class="opciones" id="opPlanes">
          ${PLANES.map(
            (p) => `<button type="button" class="chip ${p.id === sel.planId ? "on" : ""}" data-plan="${p.id}">${p.nombre}</button>`
          ).join("")}
        </div>

        <p class="step-t"><b>2</b> Cantidad de cuotas</p>
        <div class="opciones" id="opCuotas"></div>

        <div class="anticipo" id="boxAnticipo" hidden>
          <label for="inpAnticipo">Anticipo <b id="lblAnticipo">$0</b></label>
          <input type="range" id="inpAnticipo" min="0" step="50000" value="0">
        </div>

        <div class="resumen" id="resumen"></div>
      </div>

      <form id="formLead" novalidate>
        <p class="step-t"><b>3</b> Tus datos para arrancar el trámite</p>
        <div class="form-grid">
          <div class="campo">
            <label for="inNombre">Nombre y apellido</label>
            <input id="inNombre" name="nombre" autocomplete="name" placeholder="Juan Pérez">
            <span class="err">Escribí tu nombre completo.</span>
          </div>
          <div class="campo">
            <label for="inDni">DNI</label>
            <input id="inDni" name="dni" inputmode="numeric" placeholder="30123456">
            <span class="err">Ingresá un DNI válido (7 u 8 números).</span>
          </div>
          <div class="campo">
            <label for="inTel">Teléfono / WhatsApp</label>
            <input id="inTel" name="tel" inputmode="tel" autocomplete="tel" placeholder="358 400 0000">
            <span class="err">Ingresá un teléfono de contacto.</span>
          </div>
          <div class="campo">
            <label for="inLocalidad">Localidad</label>
            <input id="inLocalidad" name="localidad" placeholder="Río Cuarto">
            <span class="err">Contanos de dónde sos.</span>
          </div>
          <div class="campo">
            <label for="inSituacion">Situación laboral</label>
            <select id="inSituacion" name="situacion">
              <option value="">Elegí una opción</option>
              <option>Empleado en relación de dependencia</option>
              <option>Empleado público</option>
              <option>Jubilado o pensionado</option>
              <option>Monotributista</option>
              <option>Trabajo independiente sin recibo</option>
            </select>
            <span class="err">Elegí tu situación laboral.</span>
          </div>
          <div class="campo">
            <label for="inIngreso">Ingreso mensual aprox. (opcional)</label>
            <input id="inIngreso" name="ingreso" inputmode="numeric" placeholder="850000">
          </div>
          <div class="campo full">
            <label for="inNota">Algo más que quieras aclarar (opcional)</label>
            <textarea id="inNota" name="nota" placeholder="Entrego mi moto usada, la necesito para trabajar, etc."></textarea>
          </div>
        </div>

        <p class="form-legal">
          Al enviar se abre WhatsApp con el mensaje ya armado para que solo toques enviar.
          Tus datos viajan únicamente en ese mensaje al local. La aprobación queda sujeta a
          evaluación crediticia.
        </p>

        <div class="form-actions">
          <button class="btn btn-wa btn-block" type="submit">Enviar y empezar el trámite</button>
          <button class="btn btn-ghost btn-block btn-sm" type="button" data-close>Seguir mirando motos</button>
        </div>
      </form>`;
  }

  function renderChipsCuotas() {
    const plan = planActual();
    if (!plan.opciones.some((o) => o.cuotas === sel.cuotas)) sel.cuotas = plan.opciones[0].cuotas;

    $("#opCuotas").innerHTML = plan.opciones
      .map((o) => `<button type="button" class="chip ${o.cuotas === sel.cuotas ? "on" : ""}" data-cuotas="${o.cuotas}">${o.cuotas} cuotas</button>`)
      .join("");

    const box = $("#boxAnticipo");
    if (plan.admiteAnticipo) {
      box.hidden = false;
      const inp = $("#inpAnticipo");
      inp.max = Math.floor((sel.moto.precio * 0.7) / 50000) * 50000;
      inp.value = sel.anticipo;
    } else {
      box.hidden = true;
      sel.anticipo = 0;
    }
  }

  function actualizarResumen() {
    renderChipsCuotas();
    const op = opcionActual();
    const r = calcular(sel.moto.precio, op, sel.anticipo);
    const lbl = $("#lblAnticipo");
    if (lbl) lbl.textContent = fmtPesos(sel.anticipo);

    $("#resumen").innerHTML = `
      <div><span>Precio de lista</span><b>${fmtPesos(sel.moto.precio)}</b></div>
      ${sel.anticipo ? `<div><span>Anticipo</span><b>- ${fmtPesos(sel.anticipo)}</b></div>` : ""}
      <div><span>Monto a financiar</span><b>${fmtPesos(r.base)}</b></div>
      <div><span>Total en ${op.cuotas} cuotas</span><b>${fmtPesos(r.total)}</b></div>
      <div class="big"><span>Cuota mensual estimada</span><b>${fmtPesos(r.cuota)}</b></div>`;
  }

  function bindModal() {
    $("#opPlanes").addEventListener("click", (e) => {
      const chip = e.target.closest("[data-plan]");
      if (!chip) return;
      sel.planId = chip.dataset.plan;
      sel.anticipo = 0;
      $$("#opPlanes .chip").forEach((c) => c.classList.toggle("on", c === chip));
      actualizarResumen();
    });

    $("#opCuotas").addEventListener("click", (e) => {
      const chip = e.target.closest("[data-cuotas]");
      if (!chip) return;
      sel.cuotas = Number(chip.dataset.cuotas);
      actualizarResumen();
    });

    $("#boxAnticipo").addEventListener("input", (e) => {
      sel.anticipo = Number(e.target.value);
      actualizarResumen();
    });

    $("#formLead").addEventListener("submit", enviarLead);
  }

  /* =========================================================
     Validación y mensaje
     ========================================================= */
  const marcar = (input, ok) => {
    input.closest(".campo").classList.toggle("invalid", !ok);
    return ok;
  };

  function enviarLead(e) {
    e.preventDefault();
    const f = e.target;
    const v = (n) => f.elements[n].value.trim();

    const ok =
      marcar(f.elements.nombre, v("nombre").length >= 3) &
      marcar(f.elements.dni, /^\d{7,8}$/.test(v("dni").replace(/\D/g, ""))) &
      marcar(f.elements.tel, v("tel").replace(/\D/g, "").length >= 8) &
      marcar(f.elements.localidad, v("localidad").length >= 3) &
      marcar(f.elements.situacion, v("situacion") !== "");

    if (!ok) {
      f.querySelector(".campo.invalid input, .campo.invalid select").focus();
      return;
    }

    const op = opcionActual();
    const r = calcular(sel.moto.precio, op, sel.anticipo);
    const m = sel.moto;

    const texto = [
      "Hola Moto Fácil! Quiero arrancar el trámite desde la web.",
      "",
      "MOTO: " + m.marca + " " + m.modelo + " (" + m.cilindrada + " cc)",
      "Precio de lista: " + fmtPesos(m.precio),
      "Plan: " + planActual().nombre,
      sel.anticipo ? "Anticipo: " + fmtPesos(sel.anticipo) : null,
      "Cuotas: " + op.cuotas,
      "Cuota estimada: " + fmtPesos(r.cuota),
      "",
      "MIS DATOS",
      "Nombre: " + v("nombre"),
      "DNI: " + v("dni"),
      "Teléfono: " + v("tel"),
      "Localidad: " + v("localidad"),
      "Situación: " + v("situacion"),
      v("ingreso") ? "Ingreso aprox.: " + v("ingreso") : null,
      v("nota") ? "Nota: " + v("nota") : null,
      "",
      "Quedo a la espera de la confirmación. Gracias!"
    ].filter(Boolean).join("\n");

    const link = waLink(texto);
    window.open(link, "_blank", "noopener");

    $("#modalBody").innerHTML = `
      <div class="exito">
        <h3>¡Listo!</h3>
        <p>Se abrió WhatsApp con tu consulta ya escrita. Tocá enviar y te respondemos con la aprobación.</p>
        <p style="margin-top:14px">¿No se abrió? <a href="${link}" target="_blank" rel="noopener">Abrilo desde acá</a>.</p>
        <div class="form-actions">
          <button class="btn btn-ghost btn-block" type="button" data-close>Volver al catálogo</button>
        </div>
      </div>`;
  }

  /* ---------- Cierre del modal ---------- */
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-close]")) cerrarModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !$("#modal").hidden) cerrarModal();
  });

  /* ---------- Init ---------- */
  renderEstaticos();
  renderTipos();
  poblarFiltros();
  bindControles();
  renderGrid();
})();
