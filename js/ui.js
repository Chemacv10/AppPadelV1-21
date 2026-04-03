// ─────────────────────────────────────────────
//  ESCUELA DE PÁDEL — UI helpers compartidos
// ─────────────────────────────────────────────

// ── Navegación ────────────────────────────────

/**
 * Renderiza el menú de navegación en el elemento #nav-container.
 * @param {string} moduloActivo  id del módulo actual (ej: 'alumnos')
 */
function renderNav(moduloActivo) {
  const el = document.getElementById('nav-container');
  if (!el) return;
  el.innerHTML = MODULOS.map(m => `
    <a class="nav-item ${m.id === moduloActivo ? 'active' : ''}" href="${m.href}">
      <div class="nav-icon"><img src="${m.icon}" alt="${m.label}"></div>
      <div class="nav-label">${m.label}</div>
    </a>`).join('');
}

// ── Header ────────────────────────────────────

/**
 * Renderiza el header estándar.
 * @param {object} opts  { titulo, subtitulo, icono, botonDerecho }
 *   botonDerecho: 'menu' | 'config' | 'back' | null
 *   onConfig: función a llamar al pulsar ⚙
 *   onBack: href destino del botón ←
 */
function renderHeader({ titulo = 'Escuela de Pádel', subtitulo = '', icono = 'icons/inicio.png',
                         botonDerecho = 'menu', onConfig = null, onBack = null } = {}) {
  const el = document.getElementById('header-container');
  if (!el) return;
  // Usar logo guardado si existe (desde cualquier módulo)
  const escuelaId = typeof Store !== 'undefined' ? Store.escuelaId : null;
  const logoGuardado = escuelaId ? localStorage.getItem('escuela_logo_' + escuelaId) : null;
  if (logoGuardado) icono = logoGuardado;
  // Usar nombre guardado si no se pasa uno específico
  const nombreGuardado = escuelaId ? localStorage.getItem('escuela_nombre_' + escuelaId) : null;
  if (nombreGuardado && titulo === 'Escuela de Pádel') titulo = nombreGuardado;

  let boton = '';
  if (botonDerecho === 'config') {
    boton = `<button class="btn-icon" onclick="(${onConfig})()" title="Configuración" style="background:#eff6ff;border:2px solid #bfdbfe;color:#2563eb;font-size:18px;width:40px;height:40px;border-radius:12px">⚙</button>`;
  } else if (botonDerecho === 'back') {
    boton = `<a class="btn-icon" href="${onBack}" style="background:#eff6ff;border:2px solid #bfdbfe;color:#2563eb;font-size:20px;font-weight:900;width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;text-decoration:none">←</a>`;
  } else if (botonDerecho === 'menu') {
    boton = `<button class="btn-icon" id="btn-menu-3puntos" onclick="UI.menuUsuario(this)">⋮</button>`;
  }

  el.innerHTML = `
    <div class="header">
      <div class="hlogo"><img src="${icono}" alt="${titulo}"></div>
      <div class="htext">
        <div class="htitle">${titulo}</div>
        ${subtitulo ? `<div class="hsub">${subtitulo}</div>` : ''}
      </div>
      ${boton}
    </div>
    <div class="sep"></div>`;
}

// ── Filtros ───────────────────────────────────

/**
 * Activa el botón de filtro pulsado y desactiva los hermanos.
 * Llama a onChange(valor) con el value del botón.
 */
function initFiltros(containerSelector, onChange) {
  const btns = document.querySelectorAll(`${containerSelector} .fbtn`);
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (onChange) onChange(btn.dataset.value || '');
    });
  });
}

// ── Bottom Sheets ─────────────────────────────

function openSheet(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add('open');
  // Bloquear scroll del fondo
  document.body.style.overflow = 'hidden';
  // Interceptar botón atrás del móvil
  history.pushState({ sheet: id }, '');
}

function closeSheet(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('open');
  // Restaurar scroll
  const anyOpen = document.querySelector('.overlay.open');
  if (!anyOpen) document.body.style.overflow = '';
}

// Botón atrás del móvil: cerrar sheet en lugar de navegar
window.addEventListener('popstate', e => {
  const open = document.querySelector('.overlay.open');
  if (open) {
    open.classList.remove('open');
    document.body.style.overflow = '';
    // Reanclar para seguir interceptando futuros "atrás"
    history.pushState({ sheet: null }, '');
  } else if (e.state && e.state.page) {
    // Estamos en una página anclada: reanclar para no salir
    history.pushState(e.state, '');
  }
});

// Cerrar sheet al pulsar el overlay
document.addEventListener('click', e => {
  if (e.target.classList.contains('overlay')) {
    e.target.classList.remove('open');
    const anyOpen = document.querySelector('.overlay.open');
    if (!anyOpen) document.body.style.overflow = '';
  }
});

// ── Cards expandibles ─────────────────────────

function toggleCard(id) {
  const exp = document.getElementById('exp-' + id);
  const chev = document.getElementById('chev-' + id);
  const card = document.getElementById('card-' + id);
  if (!exp) return;
  const abierta = exp.classList.toggle('open');
  if (chev) chev.classList.toggle('open', abierta);
  if (card) card.classList.toggle('card-open', abierta);
}

// ── Toast ─────────────────────────────────────

function toast(msg, tipo = 'ok') {
  const t = document.createElement('div');
  t.className = `toast toast-${tipo}`;
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('visible'));
  setTimeout(() => {
    t.classList.remove('visible');
    setTimeout(() => t.remove(), 300);
  }, 2800);
}

// ── Loading ───────────────────────────────────

function showLoading(containerId) {
  const el = document.getElementById(containerId);
  if (el) el.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
}

function showEmpty(containerId, msg = 'Sin datos aún') {
  const el = document.getElementById(containerId);
  if (el) el.innerHTML = `<div class="empty-state">${msg}</div>`;
}

function showError(containerId, msg = 'Error al cargar') {
  const el = document.getElementById(containerId);
  if (el) el.innerHTML = `<div class="empty-state error">${msg}</div>`;
}

// ── Avatares ──────────────────────────────────

const COLORES_AV = ['#2563eb','#16a34a','#f59e0b','#e05a5a','#7c3aed','#0891b2','#be185d','#b45309'];

function iniciales(nombre = '') {
  const partes = nombre.trim().split(' ');
  if (partes.length >= 2) return (partes[0][0] + partes[1][0]).toUpperCase();
  return nombre.slice(0, 2).toUpperCase();
}

function colorAvatar(nombre = '') {
  let hash = 0;
  for (let i = 0; i < nombre.length; i++) hash = nombre.charCodeAt(i) + ((hash << 5) - hash);
  return COLORES_AV[Math.abs(hash) % COLORES_AV.length];
}

function avatarHTML(nombre, claseExtra = '') {
  return `<div class="av ${claseExtra}" style="background:${colorAvatar(nombre)}">${iniciales(nombre)}</div>`;
}

// ── Chips de nivel ────────────────────────────

// ── Paleta de chips ───────────────────────────
// 12 pares fondo/texto — se asignan por posición en lista o hash del string
const _CHIP_PALETA = [
  { bg:'#dbeafe', tx:'#1e40af' }, // azul
  { bg:'#dcfce7', tx:'#15803d' }, // verde
  { bg:'#ffedd5', tx:'#c2410c' }, // naranja
  { bg:'#f3e8ff', tx:'#7c3aed' }, // morado
  { bg:'#fce7f3', tx:'#be185d' }, // rosa
  { bg:'#ccfbf1', tx:'#0f766e' }, // teal
  { bg:'#fef9c3', tx:'#92400e' }, // amarillo
  { bg:'#e0e7ff', tx:'#3730a3' }, // índigo
  { bg:'#fee2e2', tx:'#b91c1c' }, // rojo suave
  { bg:'#d1fae5', tx:'#065f46' }, // esmeralda
  { bg:'#fdf4ff', tx:'#86198f' }, // fucsia
  { bg:'#e0f2fe', tx:'#0369a1' }, // celeste
];

// _chipListas: registro de listas conocidas para asignar color por posición
const _chipListas = {};

function chipRegistrarLista(clave, lista) {
  _chipListas[clave] = lista;
}

function chipColor(valor, clave) {
  if (!valor) return _CHIP_PALETA[0];
  // Si hay lista registrada para esta clave, usar posición
  if (clave && _chipListas[clave]) {
    const idx = _chipListas[clave].indexOf(valor);
    if (idx >= 0) return _CHIP_PALETA[idx % _CHIP_PALETA.length];
  }
  // Fallback: hash del string
  let h = 0;
  for (let i = 0; i < valor.length; i++) h = valor.charCodeAt(i) + ((h << 5) - h);
  return _CHIP_PALETA[Math.abs(h) % _CHIP_PALETA.length];
}

function chipNivel(nivel) {
  if (!nivel) return '';
  const c = chipColor(nivel, 'niveles');
  return `<span class="chip" style="background:${c.bg};color:${c.tx}">${nivel}</span>`;
}

function chipPista(pista) {
  if (!pista) return '';
  const c = chipColor(pista, 'pistas');
  return `<span class="chip" style="background:${c.bg};color:${c.tx}">${pista}</span>`;
}

function chipMonitor(monitor) {
  if (!monitor) return '';
  const c = chipColor(monitor, 'monitores');
  return `<span class="chip" style="background:${c.bg};color:${c.tx}">👤 ${monitor}</span>`;
}

// ── Formato de fecha ──────────────────────────

function formatFecha(isoStr) {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  const dias = ['dom','lun','mar','mié','jue','vie','sáb'];
  const meses = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  return `${dias[d.getDay()]}, ${d.getDate()} ${meses[d.getMonth()]}`;
}

function formatAnio(isoStr) {
  if (!isoStr) return '';
  return new Date(isoStr).getFullYear();
}

// ── Confirmación ──────────────────────────────

function confirmar(mensaje, onOk) {
  const overlay = document.getElementById('confirm-overlay');
  const texto   = document.getElementById('confirm-texto');
  const btnOk   = document.getElementById('confirm-ok');
  if (!overlay) return;
  texto.textContent = mensaje;
  overlay.classList.add('open');
  btnOk.onclick = () => { overlay.classList.remove('open'); onOk(); };
}

// ── UI namespace (para llamar desde HTML inline) ──
const UI = {
  openSheet,
  closeSheet,
  toggleCard,
  toast,
  confirmar,
  menuUsuario: (btnEl) => {
    // Cerrar si ya está abierto
    const existing = document.getElementById('menu-dropdown');
    if (existing) { existing.remove(); return; }

    // Crear dropdown compacto
    const dd = document.createElement('div');
    dd.id = 'menu-dropdown';

    // Posicionar bajo el botón ⋮
    const rect = btnEl ? btnEl.getBoundingClientRect() : { right: window.innerWidth - 8, top: 48 };
    const rightOffset = window.innerWidth - rect.right;

    dd.innerHTML = `
      <style>
        #menu-dropdown {
          position:fixed; top:${rect.bottom + 6}px; right:${rightOffset}px;
          background:#fff; border-radius:14px; padding:6px;
          box-shadow:0 8px 32px rgba(15,23,42,.18), 0 2px 8px rgba(15,23,42,.08);
          z-index:500; min-width:200px; border:1px solid #e2e8f0;
          animation: ddIn .15s ease;
        }
        @keyframes ddIn { from { opacity:0; transform:translateY(-6px) scale(.97); } to { opacity:1; transform:none; } }
        .dd-item { display:flex;align-items:center;gap:9px;padding:10px 10px;border-radius:9px;cursor:pointer;transition:background .1s; }
        .dd-item:hover { background:#f1f5f9; }
        .dd-ico { width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0; }
        .dd-lbl { font-size:13px;font-weight:800;color:#1e293b; }
        .dd-sep { height:1px;background:#f1f5f9;margin:3px 0; }
        .dd-item.danger .dd-lbl { color:#e05a5a; }
        .dd-item.disabled { opacity:.45;pointer-events:none; }
      </style>
      <div class="dd-item" onclick="UI._abrirAcercaDe()">
        <div class="dd-ico" style="background:#eff6ff">ℹ️</div>
        <div class="dd-lbl">Acerca de</div>
      </div>
      <div class="dd-item" onclick="UI._abrirConfig()">
        <div class="dd-ico" style="background:#eff6ff">⚙️</div>
        <div class="dd-lbl">Configurar escuela</div>
      </div>
      <div class="dd-item" onclick="UI._abrirGenerarCobros()">
        <div class="dd-ico" style="background:#f0fdf4">⚡</div>
        <div class="dd-lbl">Generar cobros del mes</div>
      </div>
      <div class="dd-item dd-item disabled" onclick="">
        <div class="dd-ico" style="background:#f0fdf4">📖</div>
        <div class="dd-lbl" style="color:#94a3b8">Tutorial <span style="font-size:10px;font-weight:700;color:#94a3b8">(próximamente)</span></div>
      </div>
      <div class="dd-sep"></div>
      <div class="dd-item danger" onclick="UI._cerrarSesion()">
        <div class="dd-ico" style="background:#fee2e2">🚪</div>
        <div class="dd-lbl">Cerrar sesión</div>
      </div>`;

    document.body.appendChild(dd);

    // Cerrar al clicar fuera
    setTimeout(() => {
      document.addEventListener('click', function cerrar(e) {
        if (!dd.contains(e.target)) { dd.remove(); document.removeEventListener('click', cerrar); }
      });
    }, 50);
  },

  _abrirConfig: () => {
    const existing = document.getElementById('menu-dropdown');
    if (existing) existing.remove();
    // Crear sheet de configuración
    if (!document.getElementById('cfg-overlay')) {
      const el = document.createElement('div');
      el.id = 'cfg-overlay';
      el.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,.45);z-index:400;display:flex;align-items:flex-end';
      el.innerHTML = `
        <style>
          #cfg-sheet { background:#fff;border-radius:20px 20px 0 0;padding:16px 15px 32px;width:100%;max-width:480px;margin:0 auto }
          #cfg-sheet .csh { display:flex;align-items:center;gap:9px;margin-bottom:14px }
          #cfg-sheet .cst { font-size:15px;font-weight:900;color:#1e293b;flex:1 }
          #cfg-sheet .csc { width:28px;height:28px;background:#f1f5f9;border:none;border-radius:7px;font-size:14px;font-weight:900;color:#64748b;cursor:pointer }
          #cfg-logo-wrap { display:flex;flex-direction:column;align-items:center;gap:6px;margin-bottom:16px;cursor:pointer }
          #cfg-logo-preview { width:72px;height:72px;border-radius:16px;object-fit:contain;border:2px solid #e2e8f0;background:#f8fafc }
          #cfg-logo-hint { font-size:11px;color:#94a3b8;font-weight:600 }
          #cfg-logo-input { display:none }
          #cfg-nombre-escuela { width:100%;background:#eff6ff;border:2px solid #bfdbfe;border-radius:12px;padding:10px 12px;font-family:Nunito,sans-serif;font-size:13px;font-weight:700;color:#1e3a8a;outline:none;box-sizing:border-box;margin-top:4px }
          #cfg-nombre-escuela:focus { border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.1) }
          .btn-guardar-esc { width:100%;padding:11px;background:#2563eb;color:#fff;border:none;border-radius:12px;font-family:Nunito,sans-serif;font-size:13px;font-weight:900;cursor:pointer;margin-top:10px;box-shadow:0 4px 12px rgba(37,99,235,.25) }
        </style>
        <div id="cfg-sheet">
          <div class="csh">
            <div class="cst">⚙️ Configurar escuela</div>
            <button class="csc" onclick="document.getElementById('cfg-overlay').remove();document.body.style.overflow=''">✕</button>
          </div>
          <div style="font-size:10px;font-weight:900;color:#2563eb;text-transform:uppercase;letter-spacing:.4px;margin-bottom:6px">LOGO</div>
          <div id="cfg-logo-wrap" onclick="document.getElementById('cfg-logo-input').click()">
            <img id="cfg-logo-preview" src="icons/inicio.png" alt="Logo">
            <span id="cfg-logo-hint">Toca para cambiar el logo</span>
          </div>
          <input type="file" id="cfg-logo-input" accept="image/*" onchange="UI._onCfgLogoChange(event)">
          <div style="font-size:10px;font-weight:900;color:#2563eb;text-transform:uppercase;letter-spacing:.4px;margin-bottom:3px">NOMBRE DE LA ESCUELA</div>
          <input id="cfg-nombre-escuela" placeholder="Nombre de tu escuela">
          <button class="btn-guardar-esc" onclick="UI._guardarEscuela()">✓ Guardar</button>
        </div>`;
      el.addEventListener('click', e => { if (e.target === el) { el.remove(); document.body.style.overflow=''; } });
      document.body.appendChild(el);
      document.body.style.overflow = 'hidden';
      // Cargar logo y nombre actuales
      const logoActual = Store.escuelaId ? (localStorage.getItem('escuela_logo_' + Store.escuelaId) || 'icons/inicio.png') : 'icons/inicio.png';
      document.getElementById('cfg-logo-preview').src = logoActual;
      UI._cfgLogoBase64 = null;
      (async () => {
        try {
          const { data } = await _sb.from('escuelas').select('nombre').eq('id', Store.escuelaId).single();
          if (data) document.getElementById('cfg-nombre-escuela').value = data.nombre || '';
        } catch(e) {}
      })();
    } else {
      document.getElementById('cfg-overlay').style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  },

  _cfgLogoBase64: null,

  _onCfgLogoChange: (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      UI._cfgLogoBase64 = ev.target.result;
      document.getElementById('cfg-logo-preview').src = UI._cfgLogoBase64;
    };
    reader.readAsDataURL(file);
  },

  _guardarEscuela: async () => {
    const nombre = document.getElementById('cfg-nombre-escuela').value.trim();
    if (!nombre) { toast('Escribe el nombre de la escuela', 'warn'); return; }
    try {
      await _sb.from('escuelas').update({ nombre }).eq('id', Store.escuelaId);
      // Guardar logo si se cambió
      if (UI._cfgLogoBase64 && Store.escuelaId) {
        localStorage.setItem('escuela_logo_' + Store.escuelaId, UI._cfgLogoBase64);
      }
      // Guardar nombre en localStorage para que renderHeader lo use en todos los módulos
      if (Store.escuelaId) localStorage.setItem('escuela_nombre_' + Store.escuelaId, nombre);
      // Cerrar sheet
      const overlay = document.getElementById('cfg-overlay');
      if (overlay) { overlay.remove(); document.body.style.overflow = ''; }
      toast('Escuela guardada ✓', 'ok');
      // Actualizar header en vivo
      const logoSrc = UI._cfgLogoBase64 || (Store.escuelaId ? localStorage.getItem('escuela_logo_' + Store.escuelaId) : null) || 'icons/inicio.png';
      const hlogoImg = document.querySelector('.hlogo img');
      if (hlogoImg) hlogoImg.src = logoSrc;
      const htitle = document.querySelector('.htitle');
      if (htitle) htitle.textContent = nombre;
    } catch(e) { toast('Error al guardar', 'err'); }
  },

  _abrirAcercaDe: () => {
    const existing = document.getElementById('menu-dropdown');
    if (existing) existing.remove();
    const prev = document.getElementById('acercade-overlay');
    if (prev) { prev.style.display = 'flex'; return; }
    const el = document.createElement('div');
    el.id = 'acercade-overlay';
    el.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,.45);z-index:600;display:flex;align-items:flex-end;justify-content:center';
    el.innerHTML = `
      <div style="background:#fff;border-radius:20px 20px 0 0;width:100%;max-width:480px;padding:0 0 32px">
        <div style="width:36px;height:4px;background:#e2e8f0;border-radius:2px;margin:12px auto 0"></div>
        <div style="padding:0 16px">
          <div style="text-align:center;padding:20px 0 16px;border-bottom:1px solid #f1f5f9;margin-bottom:16px">
            <img src="data:image/png;base64,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" style="width:64px;height:64px;object-fit:contain;border-radius:16px;margin-bottom:10px;display:block;margin-left:auto;margin-right:auto">
            <div style="font-size:18px;font-weight:900;color:#1e293b">App Escuela de Pádel</div>
            <div style="display:inline-block;margin-top:6px;background:#eff6ff;color:#2563eb;border-radius:8px;padding:2px 12px;font-size:11px;font-weight:900">v1.21 · Abril 2026</div>
          </div>
          <div style="display:flex;align-items:center;gap:11px;padding:11px 0;border-bottom:1px solid #f8fafc">
            <img src="data:image/png;base64,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" style="width:48px;height:48px;border-radius:12px;object-fit:contain;flex-shrink:0">
            <div>
              <div style="font-size:10px;font-weight:900;color:#94a3b8;text-transform:uppercase;letter-spacing:.4px">Creado por</div>
              <div style="font-size:13px;font-weight:800;color:#1e293b">Chema — Monitor de pádel</div>
              <div style="font-size:11px;font-weight:600;color:#64748b;margin-top:2px">Tomares · Sevilla</div>
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:11px;padding:11px 0;border-bottom:1px solid #f8fafc">
            <div style="width:34px;height:34px;border-radius:9px;background:#fefce8;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0">📅</div>
            <div>
              <div style="font-size:10px;font-weight:900;color:#94a3b8;text-transform:uppercase;letter-spacing:.4px">Personalizando desde</div>
              <div style="font-size:13px;font-weight:800;color:#1e293b">Enero 2026 — en constante mejora</div>
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:11px;padding:11px 0">
            <div style="width:34px;height:34px;border-radius:9px;background:#f5f3ff;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0">🛠</div>
            <div>
              <div style="font-size:10px;font-weight:900;color:#94a3b8;text-transform:uppercase;letter-spacing:.4px">Stack técnico</div>
              <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:4px">
                <span style="background:#f1f5f9;border-radius:7px;padding:3px 9px;font-size:11px;font-weight:800;color:#475569">Vanilla JS</span>
                <span style="background:#f1f5f9;border-radius:7px;padding:3px 9px;font-size:11px;font-weight:800;color:#475569">HTML/CSS</span>
                <span style="background:#f1f5f9;border-radius:7px;padding:3px 9px;font-size:11px;font-weight:800;color:#475569">Supabase</span>
                <span style="background:#f1f5f9;border-radius:7px;padding:3px 9px;font-size:11px;font-weight:800;color:#475569">GitHub Pages</span>
              </div>
            </div>
          </div>
          <button onclick="document.getElementById('acercade-overlay').style.display='none'" style="width:100%;padding:12px;margin-top:16px;background:#2563eb;color:#fff;border:none;border-radius:12px;font-family:Nunito,sans-serif;font-size:13px;font-weight:900;cursor:pointer">Cerrar</button>
        </div>
      </div>`;
    el.addEventListener('click', e => { if (e.target === el) el.style.display = 'none'; });
    document.body.appendChild(el);
  },

    _cerrarSesion: async () => {
    if (confirm('¿Cerrar sesión?')) logout();
  },

  _abrirGenerarCobros: () => {
    const existing = document.getElementById('menu-dropdown');
    if (existing) existing.remove();

    // Crear sheet global de generar cobros
    const prev = document.getElementById('gencobros-overlay');
    if (prev) { prev.style.display='flex'; _gcInicializar(); return; }

    const el = document.createElement('div');
    el.id = 'gencobros-overlay';
    el.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:600;display:flex;align-items:flex-end;justify-content:center';
    el.innerHTML = `
      <div style="background:#fff;border-radius:20px 20px 0 0;width:100%;max-width:480px;padding:16px 15px 32px;max-height:85vh;overflow-y:auto">
        <div style="width:36px;height:4px;background:#e2e8f0;border-radius:2px;margin:0 auto 14px"></div>
        <div style="font-size:17px;font-weight:900;color:#1e293b;margin-bottom:14px">⚡ Generar cobros del mes</div>
        <style>
          .gc-sel-wrap{position:relative;flex:1}
          .gc-sel-trigger{display:flex;align-items:center;justify-content:space-between;background:#eff6ff;border:2px solid #bfdbfe;border-radius:12px;padding:10px 12px;font-size:13px;font-weight:700;color:#1e3a8a;cursor:pointer;-webkit-tap-highlight-color:transparent}
          .gc-sel-trigger.open{border-color:#2563eb}
          .gc-sel-arrow{font-size:12px;color:#2563eb;font-weight:900}
          .gc-sel-drop{position:absolute;top:calc(100% + 4px);left:0;min-width:100%;width:max-content;z-index:700;background:#fff;border:2px solid #2563eb;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,.13);max-height:200px;overflow-y:auto;display:none}
          .gc-sel-drop.open{display:block}
          .gc-sel-opt{padding:10px 14px;font-size:13px;font-weight:700;color:#1e293b;cursor:pointer}
          .gc-sel-opt.sel{color:#2563eb;background:#eff6ff}
        </style>
        <div style="display:flex;gap:8px;margin-bottom:12px">
          <div class="gc-sel-wrap">
            <div style="font-size:10px;font-weight:900;color:#2563eb;text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px">Mes</div>
            <div class="gc-sel-trigger" id="gc-mes-trig" onclick="gcSelToggle('gc-mes')">
              <span id="gc-mes-lbl">—</span><span class="gc-sel-arrow">∨</span>
            </div>
            <div class="gc-sel-drop" id="gc-mes-drop">
              ${['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'].map((m,i)=>`<div class="gc-sel-opt" data-v="${m}" onclick="gcSelPick('gc-mes','${m}')">${m}</div>`).join('')}
            </div>
          </div>
          <div class="gc-sel-wrap">
            <div style="font-size:10px;font-weight:900;color:#2563eb;text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px">Año</div>
            <div class="gc-sel-trigger" id="gc-anio-trig" onclick="gcSelToggle('gc-anio')">
              <span id="gc-anio-lbl">—</span><span class="gc-sel-arrow">∨</span>
            </div>
            <div class="gc-sel-drop" id="gc-anio-drop"></div>
          </div>
        </div>
        <div id="gc-preview-btn">
          <button onclick="UI._gcCalcular()" style="width:100%;padding:12px;border-radius:12px;background:#2563eb;color:#fff;border:none;font-size:13px;font-weight:800;cursor:pointer;font-family:Nunito,sans-serif">🔍 Calcular preview</button>
        </div>
        <div id="gc-resultado" style="display:none">
          <div id="gc-preview-box" style="background:#f8fafc;border:1.5px solid #e2e8f0;border-radius:12px;padding:12px 14px;margin-bottom:10px;max-height:35vh;overflow-y:auto"></div>
          <div style="display:flex;gap:8px">
            <button onclick="document.getElementById('gencobros-overlay').style.display='none'" style="flex:1;padding:12px;border-radius:12px;border:1.5px solid #e2e8f0;background:#fff;font-size:13px;font-weight:800;cursor:pointer;font-family:Nunito,sans-serif;color:#475569">Cancelar</button>
            <button id="gc-btn-confirmar" onclick="UI._gcConfirmar()" style="flex:2;padding:12px;border-radius:12px;background:#16a34a;color:#fff;border:none;font-size:13px;font-weight:800;cursor:pointer;font-family:Nunito,sans-serif">✓ Generar</button>
          </div>
        </div>
        <button onclick="document.getElementById('gencobros-overlay').style.display='none'" style="width:100%;margin-top:8px;padding:10px;border-radius:10px;border:none;background:#f1f5f9;font-size:13px;font-weight:800;color:#475569;cursor:pointer;font-family:Nunito,sans-serif">Cerrar</button>
      </div>`;
    el.addEventListener('click', e => { if(e.target===el) el.style.display='none'; });
    document.body.appendChild(el);
    _gcInicializar();
  }
};

// ── Gestionar opciones de config (eliminar con ✕) ─────────────────────────
function abrirGestionOpciones(clave, titulo, listaActual, onGuardar) {
  // listaActual: array de strings
  // onGuardar(nuevaLista): callback cuando se confirma
  const existing = document.getElementById('gesopc-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'gesopc-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,.4);z-index:600;display:flex;align-items:flex-end';

  function renderChips(lista) {
    return lista.map((v,i) => `
      <div style="display:inline-flex;align-items:center;gap:5px;background:#eff6ff;border:1.5px solid #bfdbfe;border-radius:20px;padding:5px 10px;font-size:12px;font-weight:800;color:#1e3a8a;margin:3px">
        <span>${v}</span>
        <button onclick="gesopcEliminar(${i})" style="background:none;border:none;color:#e05a5a;font-size:14px;font-weight:900;cursor:pointer;padding:0;line-height:1">×</button>
      </div>`).join('');
  }

  let lista = [...listaActual];

  overlay.innerHTML = `
    <div style="background:#fff;border-radius:20px 20px 0 0;padding:18px 16px 32px;width:100%;max-width:480px;margin:0 auto">
      <div style="display:flex;align-items:center;margin-bottom:14px">
        <div style="flex:1;font-size:15px;font-weight:900;color:#1e293b">Gestionar: ${titulo}</div>
        <button onclick="document.getElementById('gesopc-overlay').remove();document.body.style.overflow=''" style="background:#f1f5f9;border:none;border-radius:8px;width:28px;height:28px;font-size:14px;font-weight:900;color:#64748b;cursor:pointer">✕</button>
      </div>
      <div style="font-size:10px;font-weight:900;color:#2563eb;text-transform:uppercase;letter-spacing:.4px;margin-bottom:8px">Opciones actuales</div>
      <div id="gesopc-chips" style="margin-bottom:12px">${renderChips(lista)}</div>
      <div style="font-size:10px;font-weight:700;color:#94a3b8;margin-bottom:16px">Los registros que usen una opción eliminada conservarán su valor actual.</div>
      <button onclick="gesopcGuardar()" style="width:100%;padding:12px;background:#2563eb;color:#fff;border:none;border-radius:12px;font-family:Nunito,sans-serif;font-size:13px;font-weight:900;cursor:pointer;box-shadow:0 4px 12px rgba(37,99,235,.25)">✓ Guardar cambios</button>
    </div>`;

  window._gesopcLista = lista;
  window._gesopcOnGuardar = onGuardar;
  window.gesopcEliminar = (i) => {
    window._gesopcLista.splice(i, 1);
    document.getElementById('gesopc-chips').innerHTML = renderChips(window._gesopcLista);
  };
  window.gesopcGuardar = () => {
    overlay.remove();
    document.body.style.overflow = '';
    onGuardar(window._gesopcLista);
  };

  overlay.addEventListener('click', e => { if (e.target === overlay) { overlay.remove(); document.body.style.overflow=''; } });
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';
}


// ── Generar cobros del mes — lógica global ────
let _gcPreviewData = null;

function _gcInicializar() {
  const anio = new Date().getFullYear();
  const mesNombre = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'][new Date().getMonth()];

  // Poblar año
  const drop = document.getElementById('gc-anio-drop');
  if (drop) {
    drop.innerHTML = [anio-1, anio, anio+1].map(a=>`<div class="gc-sel-opt${a===anio?' sel':''}" data-v="${a}" onclick="gcSelPick('gc-anio',${a})">${a}</div>`).join('');
  }
  const lblA = document.getElementById('gc-anio-lbl');
  if (lblA) lblA.textContent = anio;

  // Mes actual
  const lblM = document.getElementById('gc-mes-lbl');
  if (lblM) lblM.textContent = mesNombre;
  const mesOpts = document.querySelectorAll('#gc-mes-drop .gc-sel-opt');
  mesOpts.forEach(o => o.classList.toggle('sel', o.dataset.v === mesNombre));

  document.getElementById('gc-resultado').style.display = 'none';
  document.getElementById('gc-preview-btn').style.display = 'block';
  _gcPreviewData = null;
}

function gcSelToggle(id) {
  const drop = document.getElementById(id + '-drop');
  const trig = document.getElementById(id + '-trig');
  if (!drop) return;
  const open = drop.classList.contains('open');
  // Cerrar todos
  document.querySelectorAll('.gc-sel-drop').forEach(d => d.classList.remove('open'));
  document.querySelectorAll('.gc-sel-trigger').forEach(t => t.classList.remove('open'));
  if (!open) {
    drop.classList.add('open'); trig.classList.add('open');
    setTimeout(() => { const s = drop.querySelector('.sel'); if (s) s.scrollIntoView({block:'center'}); }, 20);
  }
}
function gcSelPick(id, val) {
  const lbl = document.getElementById(id + '-lbl');
  const drop = document.getElementById(id + '-drop');
  const trig = document.getElementById(id + '-trig');
  if (lbl) lbl.textContent = val;
  if (drop) { drop.querySelectorAll('.gc-sel-opt').forEach(o => o.classList.toggle('sel', String(o.dataset.v) === String(val))); drop.classList.remove('open'); }
  if (trig) trig.classList.remove('open');
}

async function _gcCalcular() {
  const mes  = document.getElementById('gc-mes-lbl')?.textContent || '';
  const anio = +(document.getElementById('gc-anio-lbl')?.textContent || new Date().getFullYear());
  document.getElementById('gc-preview-btn').innerHTML = '<div style="text-align:center;padding:10px"><div style="width:20px;height:20px;border:2px solid #2563eb;border-top-color:transparent;border-radius:50%;animation:spin .6s linear infinite;display:inline-block"></div></div>';

  try {
    const grupos = await getGruposConImporte();
    if (!grupos.length) {
      document.getElementById('gc-preview-btn').innerHTML =
        '<div style="background:#fef9c3;border:1.5px solid #fde68a;border-radius:12px;padding:12px 14px;font-size:13px;font-weight:700;color:#92400e;margin-bottom:8px">' +
        '⚠️ Ningún grupo tiene importe mensual configurado.<br>' +
        '<span style="font-size:11px;color:#b45309">Ve a <strong>Grupos → Editar</strong> y añade un importe mensual.</span>' +
        '</div>' +
        '<button onclick="UI._gcCalcular()" style="width:100%;padding:12px;border-radius:12px;background:#2563eb;color:#fff;border:none;font-size:13px;font-weight:800;cursor:pointer;font-family:Nunito,sans-serif">🔍 Calcular preview</button>';
      return;
    }
    const grupoIds = grupos.map(g => g.id);
    // La relación alumno↔grupo es N:M a través de alumno_grupos
    const { data: relaciones } = await _sb
      .from('alumno_grupos')
      .select('alumno_id, grupo_id, alumnos(id, nombre)')
      .in('grupo_id', grupoIds);
    const yaExisten = await getCobrosExistentesSet(mes, anio);

    const aGenerar = [], omitidos = [];
    (relaciones||[]).forEach(r => {
      const alumno = r.alumnos;
      if (!alumno) return;
      const g = grupos.find(x => x.id === r.grupo_id);
      if (!g) return;
      if (yaExisten.has(alumno.id)) omitidos.push({...alumno, grupo: g});
      else aGenerar.push({ alumno_id: alumno.id, nombre: alumno.nombre, grupo: g, importe: g.importe_mensual });
    });
    _gcPreviewData = { aGenerar, mes, anio };

    const totalImporte = aGenerar.reduce((s,r) => s + r.importe, 0);
    document.getElementById('gc-preview-box').innerHTML = `
      <div style="font-size:13px;font-weight:900;color:#1e293b;margin-bottom:8px">📋 ${mes} ${anio}</div>
      <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:9px;padding:8px 11px;margin-bottom:8px;font-size:12px;font-weight:800;color:#15803d">
        ✓ <strong>${aGenerar.length} cobros</strong> · <strong>${totalImporte.toFixed(2)} €</strong> total
      </div>
      ${aGenerar.map(r=>`
        <div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid #f1f5f9">
          <div style="flex:1">
            <div style="font-size:12px;font-weight:700;color:#1e293b">${r.nombre}</div>
            <div style="font-size:10px;color:#94a3b8;font-weight:600">${r.grupo.nombre}</div>
          </div>
          <div style="font-size:13px;font-weight:900;color:#16a34a">${r.importe.toFixed(2)}€</div>
        </div>`).join('')}
      ${omitidos.length ? `<div style="margin-top:8px;font-size:10px;font-weight:700;color:#f59e0b">⏭ ${omitidos.length} ya cobrado${omitidos.length!==1?'s':''}: ${omitidos.map(a=>a.nombre).join(', ')}</div>` : ''}`;

    const btn = document.getElementById('gc-btn-confirmar');
    btn.disabled = !aGenerar.length;
    btn.textContent = aGenerar.length ? `✓ Generar ${aGenerar.length} cobros` : 'Sin cobros nuevos';
    document.getElementById('gc-resultado').style.display = 'block';
    document.getElementById('gc-preview-btn').style.display = 'none';
  } catch(e) {
    toast('Error al calcular', 'err'); console.error(e);
    document.getElementById('gc-preview-btn').innerHTML = '<button onclick="UI._gcCalcular()" style="width:100%;padding:12px;border-radius:12px;background:#2563eb;color:#fff;border:none;font-size:13px;font-weight:800;cursor:pointer;font-family:Nunito,sans-serif">🔍 Calcular preview</button>';
  }
}

async function _gcConfirmar() {
  const { aGenerar, mes, anio } = _gcPreviewData || {};
  if (!aGenerar?.length) { toast('Nada que generar', 'warn'); return; }
  const btn = document.getElementById('gc-btn-confirmar');
  btn.disabled = true; btn.textContent = 'Generando…';
  try {
    const hoy = new Date().toISOString().slice(0,10);
    await saveCobrosLote(aGenerar.map(r => ({
      alumno_id: r.alumno_id, tipo: 'Mensual', importe: r.importe,
      fecha: hoy, mes, forma_pago: 'Efectivo',
    })));
    document.getElementById('gencobros-overlay').style.display = 'none';
    toast(`✓ ${aGenerar.length} cobros generados`, 'ok');
  } catch(e) {
    toast('Error al generar', 'err'); console.error(e);
    btn.disabled = false; btn.textContent = `✓ Generar ${aGenerar.length} cobros`;
  }
}

// ── Selector custom con ✕ integrado (csel) ─────
function cselRender(containerId, opciones, seleccionada, noBorrar, onChange, onDelete, onAdd, placeholder) {
  const wrap = document.getElementById(containerId);
  if (!wrap) return;
  const inpId = containerId + '-inp';
  wrap.innerHTML = `
    <div class="csel-trigger" onclick="cselToggle('${containerId}')">
      <div class="csel-trigger-label" id="${containerId}-tlabel">—</div>
      <div class="csel-trigger-arrow" id="${containerId}-arrow">▼</div>
    </div>
    <div class="csel-dropdown" id="${containerId}-drop" style="display:none">
      <div id="${containerId}-lista"></div>
      ${onAdd ? `<div class="csel-add">
        <input class="csel-add-inp" id="${inpId}" placeholder="${placeholder || '+ Añadir…'}"
          onkeydown="if(event.key==='Enter'){event.preventDefault();cselAdd('${containerId}');}">
        <button class="csel-add-btn" onclick="cselAdd('${containerId}')">+</button>
      </div>` : ''}
    </div>`;
  wrap._cselState = { opciones: [...opciones], seleccionada, noBorrar, onChange, onDelete, onAdd, placeholder, open: false };
  cselRefresh(containerId);
}

function cselToggle(containerId) {
  const wrap = document.getElementById(containerId);
  if (!wrap?._cselState) return;
  wrap._cselState.open = !wrap._cselState.open;
  document.getElementById(containerId + '-drop').style.display = wrap._cselState.open ? 'block' : 'none';
  document.getElementById(containerId + '-arrow').style.transform = wrap._cselState.open ? 'rotate(180deg)' : '';
}

function cselRefresh(containerId) {
  const wrap = document.getElementById(containerId);
  if (!wrap?._cselState) return;
  const { opciones, seleccionada, noBorrar, onDelete } = wrap._cselState;
  const tlabel = document.getElementById(containerId + '-tlabel');
  if (tlabel) tlabel.textContent = seleccionada || '—';
  const lista = document.getElementById(containerId + '-lista');
  if (!lista) return;
  lista.innerHTML = opciones.map(op => {
    const sel = seleccionada === op;
    const puedeEliminar = onDelete && op !== noBorrar;
    return `<div class="csel-item${sel ? ' selected' : ''}" onclick="cselSelect('${containerId}','${op.replace(/'/g, "\'")}')">
      <div class="csel-radio"></div>
      <div class="csel-label">${op}</div>
      ${puedeEliminar ? `<button class="csel-del" onclick="event.stopPropagation();cselDelete('${containerId}','${op.replace(/'/g, "\'")}')">✕</button>` : ''}
    </div>`;
  }).join('');
}

function cselSelect(containerId, val) {
  const wrap = document.getElementById(containerId);
  if (!wrap?._cselState) return;
  wrap._cselState.seleccionada = val;
  wrap._cselState.open = false;
  document.getElementById(containerId + '-drop').style.display = 'none';
  document.getElementById(containerId + '-arrow').style.transform = '';
  cselRefresh(containerId);
  if (wrap._cselState.onChange) wrap._cselState.onChange(val);
}

function cselDelete(containerId, val) {
  const wrap = document.getElementById(containerId);
  if (!wrap?._cselState) return;
  const s = wrap._cselState;
  s.opciones = s.opciones.filter(o => o !== val);
  if (s.seleccionada === val) s.seleccionada = s.opciones[0] || '';
  cselRefresh(containerId);
  if (s.onDelete) s.onDelete(val, s.opciones, s.seleccionada);
}

function cselAdd(containerId) {
  const wrap = document.getElementById(containerId);
  if (!wrap?._cselState) return;
  const inp = document.getElementById(containerId + '-inp');
  if (!inp) return;
  const val = inp.value.trim();
  if (!val) { inp.focus(); return; }
  const s = wrap._cselState;
  if (!s.opciones.includes(val)) s.opciones.push(val);
  s.seleccionada = val;
  inp.value = '';
  cselRefresh(containerId);
  if (s.onAdd) s.onAdd(val, s.opciones);
  inp.focus();
}

function cselGetValue(containerId) {
  return document.getElementById(containerId)?._cselState?.seleccionada ?? '';
}

function cselSetValue(containerId, val) {
  const wrap = document.getElementById(containerId);
  if (!wrap?._cselState) return;
  wrap._cselState.seleccionada = val;
  cselRefresh(containerId);
}

// Cerrar todos los csel al pulsar fuera
document.addEventListener('click', e => {
  if (!e.target.closest('.csel-wrap')) {
    document.querySelectorAll('.csel-wrap').forEach(wrap => {
      if (wrap._cselState?.open) {
        wrap._cselState.open = false;
        const drop = wrap.querySelector('.csel-dropdown');
        const arrow = wrap.querySelector('.csel-trigger-arrow');
        if (drop)  drop.style.display = 'none';
        if (arrow) arrow.style.transform = '';
      }
    });
  }
});

// ══════════════════════════════════════════════════════════════
//  NSEL — Select nativo estilado como csel
//  Uso: nselInit('id-del-select')
//  El <select> original queda oculto como fuente de verdad.
//  Cuando el <select> cambia su innerHTML, llamar nselSync('id').
// ══════════════════════════════════════════════════════════════

function nselInit(selId) {
  const sel = document.getElementById(selId);
  if (!sel || sel._nselDone) return;
  sel._nselDone = true;

  // Ocultar el select nativo
  sel.style.display = 'none';

  // Crear el wrapper si no existe ya
  let wrap = document.getElementById(selId + '-nsel');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.id = selId + '-nsel';
    wrap.className = 'nsel-wrap';
    sel.parentNode.insertBefore(wrap, sel);
  }

  _nselBuild(selId);

  // Observer: cuando el select cambie su options, re-sincronizar
  const obs = new MutationObserver(() => _nselBuild(selId));
  obs.observe(sel, { childList: true, subtree: true, characterData: true });

  // También escuchar cambios de value programáticos
  const origDesc = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
  if (origDesc) {
    try {
      Object.defineProperty(sel, 'value', {
        get() { return origDesc.get.call(this); },
        set(v) {
          origDesc.set.call(this, v);
          setTimeout(() => _nselBuild(selId), 0);
        },
        configurable: true
      });
    } catch(e) {}
  }
}

function _nselBuild(selId) {
  const sel  = document.getElementById(selId);
  const wrap = document.getElementById(selId + '-nsel');
  if (!sel || !wrap) return;

  const opts       = Array.from(sel.options);
  const curVal     = sel.value;
  const curTxt     = opts.find(o => o.value === curVal)?.text || opts[0]?.text || '—';
  const isDisabled = sel.disabled;

  // Reflejar estado disabled en el wrapper
  wrap.classList.toggle('nsel-disabled', isDisabled);

  wrap.innerHTML = `
    <div class="nsel-trigger" onclick="nselToggle('${selId}')" style="${isDisabled ? 'opacity:.5;pointer-events:none' : ''}">
      <div class="nsel-label" id="${selId}-nsel-lbl">${curTxt}</div>
      <div class="nsel-arrow" id="${selId}-nsel-arrow">▼</div>
    </div>
    <div class="nsel-drop" id="${selId}-nsel-drop" style="display:none">
      ${opts.map(o => `
        <div class="nsel-item${o.value === curVal ? ' nsel-sel' : ''}"
             onclick="nselPick('${selId}','${o.value.replace(/'/g,"\'")}',this)">
          <div class="nsel-radio"></div>
          <div class="nsel-lbl">${o.text}</div>
        </div>`).join('')}
    </div>`;
}

function nselToggle(selId) {
  const drop    = document.getElementById(selId + '-nsel-drop');
  const arrow   = document.getElementById(selId + '-nsel-arrow');
  const trigger = document.getElementById(selId + '-nsel')?.querySelector('.nsel-trigger');
  if (!drop) return;
  const open = drop.style.display === 'none';
  // Cerrar todos los demás nsel abiertos
  document.querySelectorAll('.nsel-drop').forEach(d => {
    if (d !== drop) {
      d.style.display = 'none';
      const otherId = d.id.replace('-nsel-drop','');
      const otherArrow = document.getElementById(otherId + '-nsel-arrow');
      if (otherArrow) otherArrow.style.transform = '';
    }
  });
  if (open && trigger) {
    // Posicionar con fixed usando las coordenadas del trigger
    const rect = trigger.getBoundingClientRect();
    const maxW = window.innerWidth - 24;
    const dropW = Math.min(Math.max(rect.width, 160), maxW);
    // Intentar alinear a la izquierda del trigger; si se sale, alinear a la derecha
    let left = rect.left;
    if (left + dropW > window.innerWidth - 12) left = window.innerWidth - dropW - 12;
    if (left < 12) left = 12;
    drop.style.left  = left + 'px';
    drop.style.top   = (rect.bottom + 4) + 'px';
    drop.style.width = dropW + 'px';
  }
  drop.style.display = open ? 'block' : 'none';
  if (arrow) arrow.style.transform = open ? 'rotate(180deg)' : '';
}

function nselPick(selId, val, itemEl) {
  const sel  = document.getElementById(selId);
  const drop = document.getElementById(selId + '-nsel-drop');
  const lbl  = document.getElementById(selId + '-nsel-lbl');
  const arrow = document.getElementById(selId + '-nsel-arrow');
  if (!sel) return;

  // Update native select value
  sel.value = val;

  // Update label
  const opts = Array.from(sel.options);
  const txt = opts.find(o => o.value === val)?.text || '—';
  if (lbl) lbl.textContent = txt;

  // Update selected state
  drop.querySelectorAll('.nsel-item').forEach(i => i.classList.remove('nsel-sel'));
  if (itemEl) itemEl.classList.add('nsel-sel');

  // Close
  drop.style.display = 'none';
  if (arrow) arrow.style.transform = '';

  // Fire change event so existing onchange handlers work
  sel.dispatchEvent(new Event('change', { bubbles: true }));
}

// Cerrar nsel al pulsar fuera
document.addEventListener('click', e => {
  if (!e.target.closest('.nsel-wrap')) {
    document.querySelectorAll('.nsel-drop').forEach(d => {
      d.style.display = 'none';
      const otherId = d.id.replace('-nsel-drop','');
      const otherArrow = document.getElementById(otherId + '-nsel-arrow');
      if (otherArrow) otherArrow.style.transform = '';
    });
  }
});

// nselSync: llamar tras cambiar innerHTML de un select para re-renderizar
function nselSync(selId) {
  setTimeout(() => _nselBuild(selId), 0);
}
