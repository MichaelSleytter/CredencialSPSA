/* ============================================================
   AUTOMATIZACIÓN DE CUESTIONARIOS · 2026
   app.js — Lógica principal
   Estrategia Patrimonial: pre-relleno del form, el usuario
   solo da Siguiente → Enviar para que Google procese la nota.
   ============================================================ */

let tipo = '';   // 'sst' | 'pat'

/* ── Respuestas correctas precargadas ── */

const RESPUESTAS_SST = {
  'entry.1124923738': 'Situación o característica intrínseca de algo capaz de ocasionar daños a las personas, equipos, procesos y ambiente',
  'entry.1323824480': 'Probabilidad de que un peligro se materialice en determinadas condiciones y genere daños a las personas, equipos y al ambiente.',
  'entry.2029309025': 'Es toda acción o práctica incorrecta ejecutada por un trabajador que puede causar un accidente.',
  'entry.248885907':  'Verdadero',
  'entry.102399180':  'Verdadero',
  'entry.1564329401': 'Verdadero',
  'entry.79132059':   'Verdadero',
  'entry.1706506487': 'Verdadero',
  'entry.431872214':  'Es una situacion física presente en el ambiente de trabajo que aumenta la posibilidad de ocurrencia de un accidente',
  'entry.1182523951': 'Condición Insegura',
  'entry.1656528304': 'Acto Inseguro',
  'entry.617826559':  'Acto Inseguro',
  'entry.415594173':  'Acto Inseguro',
  'entry.1875830438': 'Condición Insegura',
  'entry.682879336':  'Condición Insegura',
  'entry.1063557631': 'Verdadero, es una falta que al incurrirla genera el  Bloqueo Definitivo del transportista',
  'entry.68164334':   'Casco de Seguridad, Zapatos de Seguridad, Chaleco con cintas reflectivas, mascarilla y lentes/protector facial',
  'entry.1949621834': 'Una falta grave que al incurrirla genera el bloqueo definitivo del transportista',
  'entry.21386810':   '10 km/h',
  'entry.1417994366': 'Suceso en relación con el trabajo en el que la persona afectada no sufre lesiones corporales o solo requieren primeros auxilios.',
};

const RESPUESTAS_PAT = {
  'entry.1918864418': 'Proveedor',
  'entry.799175623':  'Sí',
  'entry.1392012498': 'SÍ',
  'entry.1170670351': 'SÍ',
  'entry.2105862400': 'SÍ',
  'entry.1547189358': 'Sí',
  'entry.96601304':   'NO',
  'entry.1722311236': 'NO',
  'entry.6525968':    'Sí',
  'entry.955144209': [
    'Respetar al personal de vigilancia',
    'Cumplir procedimientos en CDs',
    'No cometer actos deshonestos',
    'Conducir con seguridad',
    'Reportar incidentes',
  ],
  'entry.378971421':  'Todas las anteriores',
  'entry.793952268': [
    'Proteger personas',
    'Prevenir pérdidas',
    'Proteger activos',
    'Continuidad operativa',
    'Información confidencial',
  ],
  'entry.1107267410': 'Todas las anteriores',
  'entry.679783505': [
    'Agresiones',
    'Documentos falsos',
    'Dormir en instalaciones',
    'Hurtos',
    'Evadir controles',
    'Vestimenta inadecuada',
    'No declarar objetos',
    'Sobornos',
  ],
  'entry.330753085': [
    'Presentarse en garita peatonal mostrando la documentación regulatoria (foto identificador, carnet de inducción de seguridad patrimonial, carnet de inducción de seguridad y salud en el trabajo).',
    'Declarar productos y objetos autorizados por el área de seguridad patrimonial.',
    'Abrir todos los bolsillos; de contar con mochila, bolso, etc., permitir la revisión del personal de seguridad.',
  ],
  'entry.8403708': [
    'Presentarse en garita peatonal mostrando la documentación regulatoria (foto identificador, carnet de inducción de seguridad patrimonial, carnet de inducción de seguridad y salud en el trabajo).',
    'Declarar productos y objetos autorizados por el área de seguridad patrimonial.',
    'Abrir todos los bolsillos; de contar con mochila, bolso, etc., permitir la revisión del personal de seguridad.',
    'Luego de la revisión por el personal de seguridad, se te asignará el pase de visita y, dada la conformidad, procederás con el ingreso guiado al CDs.',
  ],
  'entry.702430926': [
    'Presentarse en garita peatonal mostrando la documentación regulatoria (foto identificador, carnet de inducción de seguridad patrimonial, carnet de inducción de seguridad y salud en el trabajo).',
    'Presentarse con el uniforme y distintivo de la empresa a la que representas.',
    'Acceder por la garita vehicular 02, 03 o 04, si y solo si el personal de seguridad te habilita el pase.',
    'Luego de la revisión por el personal de seguridad, proceder con el ingreso guiado según las líneas de tránsito establecidas en el CDs.',
    'Si el acceso es a planta, está prohibido ingresar con mochila, bolso, celulares, dispositivos y/o productos.',
  ],
  'entry.915135098':  'Una falta grave que, al incurrirla, genera la restricción de acceso permanente.',
};

/* ── Navegación entre pantallas ── */

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function selectCarnet(t) {
  tipo = t;
  const isSST = t === 'sst';

  const badge = document.getElementById('badge-tipo');
  badge.className = 'badge-tipo ' + t;
  badge.textContent = isSST ? '🦺 SST - TRANSPORTISTAS' : '🛡️ SEGURIDAD PATRIMONIAL';

  document.getElementById('form-title').textContent = isSST
    ? 'Carnet de Inducción SST — Transportistas 2026'
    : 'Carnet de Inducción Seguridad Patrimonial — 2026';

  document.getElementById('btn-sig').className = 'btn-submit' + (t === 'pat' ? ' pat' : '');
  document.getElementById('prog-fill').className = 'progress-fill ' + t;

  const today = new Date().toISOString().split('T')[0];
  document.getElementById('inp-fecha').value = today;

  showScreen('s-form');
}

function goHome() {
  tipo = '';
  ['inp-nombre', 'inp-dni', 'inp-email', 'inp-empresa', 'inp-cargo', 'inp-fecha']
    .forEach(id => { document.getElementById(id).value = ''; });
  ['f-nombre', 'f-dni', 'f-email', 'f-empresa', 'f-cargo', 'f-fecha']
    .forEach(id => { document.getElementById(id).classList.remove('error'); });

  const btn = document.getElementById('btn-sig');
  btn.disabled = false;
  btn.innerHTML = 'Continuar al cuestionario';

  showScreen('s-home');
}

/* ── Validación de campos ── */

function validate() {
  let ok = true;
  const fields = [
    ['f-nombre',  'inp-nombre',  v => v.trim().length > 3],
    ['f-dni',     'inp-dni',     v => /^\d{8,9}$/.test(v.trim())],
    ['f-email',   'inp-email',   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())],
    ['f-empresa', 'inp-empresa', v => v.trim().length > 1],
    ['f-cargo',   'inp-cargo',   v => v.trim().length > 1],
    ['f-fecha',   'inp-fecha',   v => v.length > 0],
  ];
  fields.forEach(([fid, iid, fn]) => {
    const el  = document.getElementById(fid);
    const val = document.getElementById(iid).value;
    if (!fn(val)) { el.classList.add('error'); ok = false; }
    else            el.classList.remove('error');
  });
  return ok;
}

/* ── Construcción de URL pre-rellenada para Patrimonial ──
   Usamos el endpoint viewform con usp=pp_url para que Google
   abra el form con todos los campos ya completados.
   El usuario solo da Siguiente → Enviar y Google procesa la nota. */

function buildPrefilledUrlPAT(nombre, dni, email, empresa, cargo, yr, mo, dy) {
  const base = 'https://docs.google.com/forms/d/e/1FAIpQLSdLssfpNJej527GrDDdZ6Kqab5yiU5TQ2xQ5ZiNDfWhAryyJA/viewform';

  const params = new URLSearchParams();
  params.set('usp', 'pp_url');

  // ── Datos personales (página 1) ──
  params.set('entry.740887796',        nombre);
  params.set('entry.2054730466',       dni);
  params.set('entry.1020805095',       empresa);
  params.set('entry.1907020576',       cargo);
  params.set('entry.1660932859',       email);
  params.set('entry.1063136076_year',  yr);
  params.set('entry.1063136076_month', String(parseInt(mo)));
  params.set('entry.1063136076_day',   String(parseInt(dy)));
  params.set('entry.689272656',        'CONFORME');

  // ── Respuestas correctas (página 2) ──
  Object.entries(RESPUESTAS_PAT).forEach(([entry, value]) => {
    if (Array.isArray(value)) value.forEach(v => params.append(entry, v));
    else params.set(entry, value);
  });

  return base + '?' + params.toString();
}

/* ── Construcción de URLs iframe para SST (multi-página) ── */

function buildUrlsSST(nombre, dni, email, empresa, cargo, yr, mo, dy) {
  const base = 'https://docs.google.com/forms/d/e/1FAIpQLScyGjnk2N9zt4qz4bsvalA-rRc0fkvLkGBnAxmwQvkSeoK4iA/formResponse';

  const p1 = new URLSearchParams({
    'entry.121268642':       nombre,
    'entry.714484152':       email,
    'entry.739251819_year':  yr,
    'entry.739251819_month': String(parseInt(mo)),
    'entry.739251819_day':   String(parseInt(dy)),
    'entry.1071903234':      dni,
    'entry.1990848799':      cargo,
    'entry.2035397087':      'Si Declaro',
    'entry.2073558840':      empresa,
    fvv: '1', pageHistory: '0',
  });

  const p2 = new URLSearchParams({
    ...RESPUESTAS_SST,
    'entry.121268642':  nombre,
    'entry.1071903234': dni,
    'entry.714484152':  email,
    'entry.2073558840': empresa,
    'entry.1990848799': cargo,
    'entry.739251819':  `${yr}-${mo}-${dy}`,
    'entry.2035397087': 'Si Declaro',
    fvv: '1', pageHistory: '0,1',
  });

  return [base + '?' + p1.toString(), base + '?' + p2.toString()];
}

/* ── Envío del formulario ── */

function submitForm() {
  if (!validate()) return;

  const btn = document.getElementById('btn-sig');
  btn.disabled = true;
  btn.innerHTML = '<div class="spinner"></div> Preparando...';

  const nombre  = document.getElementById('inp-nombre').value.trim().toUpperCase();
  const dni     = document.getElementById('inp-dni').value.trim();
  const email   = document.getElementById('inp-email').value.trim();
  const empresa = document.getElementById('inp-empresa').value.trim().toUpperCase();
  const cargo   = document.getElementById('inp-cargo').value.trim().toUpperCase();
  const fecha   = document.getElementById('inp-fecha').value;
  const [yr, mo, dy] = fecha.split('-');

  if (tipo === 'pat') {
    /* ── PATRIMONIAL: abrimos el form pre-rellenado en nueva pestaña ──
       El usuario llega con todo completado y solo da Siguiente → Enviar.
       Google Forms procesa la nota y (si está configurado) envía el carnet. */
    const url = buildPrefilledUrlPAT(nombre, dni, email, empresa, cargo, yr, mo, dy);
    window.open(url, '_blank');
    showSuccess(nombre, email, empresa, cargo, fecha);

  } else {
    /* ── SST: envío silencioso por iframes ── */
    const urls = buildUrlsSST(nombre, dni, email, empresa, cargo, yr, mo, dy);
    let count = 0;
    const total = urls.length;

    function onDone() {
      count++;
      if (count >= total) showSuccess(nombre, email, empresa, cargo, fecha);
    }

    urls.forEach(url => {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.onload  = onDone;
      iframe.onerror = onDone;
      document.body.appendChild(iframe);
      iframe.src = url;
    });

    setTimeout(() => {
      if (count < total) showSuccess(nombre, email, empresa, cargo, fecha);
    }, 5000);
  }
}

/* ── Pantalla de éxito ── */

function showSuccess(nombre, email, empresa, cargo, fecha) {
  const isSST = tipo === 'sst';
  const icon  = document.getElementById('ok-icon');
  icon.className = 'success-icon ' + (isSST ? 'sst' : 'pat');
  icon.textContent = '✓';

  const carnetNombre = isSST
    ? 'Carnet SST - Transportistas 2026'
    : 'Carnet Seguridad Patrimonial 2026';

  // Bloque instructivo solo para Patrimonial
  const notaBlock = !isSST ? `
    <div class="nota-aviso">
      <div class="nota-aviso-titulo">Se abrió el cuestionario en una nueva pestaña</div>
      <div class="nota-aviso-texto">
        Todos tus datos y respuestas ya están completados.<br>
        Solo tienes que dar <strong style="color:var(--txt)">Siguiente</strong> y luego
        <strong style="color:var(--txt)">Enviar</strong> para registrar tu resultado y recibir tu carnet.
      </div>
    </div>
  ` : '';

  document.getElementById('ok-detail').innerHTML = `
    <div class="row"><span class="lbl">Participante</span><span class="val">${nombre}</span></div>
    <div class="row"><span class="lbl">Correo</span><span class="val">${email}</span></div>
    <div class="row"><span class="lbl">Empresa</span><span class="val">${empresa}</span></div>
    <div class="row"><span class="lbl">Cargo</span><span class="val">${cargo}</span></div>
    <div class="row"><span class="lbl">Carnet</span><span class="val">${carnetNombre}</span></div>
    <div class="row"><span class="lbl">Fecha</span><span class="val">${fecha}</span></div>
  `;

  const notaContainer = document.getElementById('ok-nota');
  if (notaContainer) notaContainer.innerHTML = notaBlock;

  showScreen('s-ok');
}