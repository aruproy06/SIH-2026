/**
 * VisionWare AI - Main Dashboard Application Controller
 */

// Global State
const appState = {
  currentInvoice: 'INV-2026-001',
  currentScenario: 'perfect_cement_steel',
  invoiceData: null,
  detectionData: null,
  verificationSummary: null,
  activeAlerts: [],
  language: 'en'
};

// Sound Synthesizer using Web Audio API (No external sound files required)
class SoundSynthesizer {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) this.ctx = new AudioContext();
    }
  }

  playSuccess() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, this.ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.15); // A5
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.4);
  }

  playAlertBuzzer() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc.frequency.setValueAtTime(180, this.ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.35);
  }
}

const audioSynth = new SoundSynthesizer();
let canvasRenderer = null;
let voiceAssistant = null;
let barcodeScanner = null;

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', async () => {
  console.log("🚀 VisionWare AI Dashboard Initializing...");

  // 1. Initialize Canvas Renderer
  canvasRenderer = new DetectionCanvasRenderer('cameraCanvas');

  // 2. Initialize Voice Assistant
  voiceAssistant = new VoiceAIAssistant({
    onResult: (data, transcript) => {
      document.getElementById('voiceUserText').innerText = `"${transcript}"`;
      document.getElementById('voiceAiResponse').innerText = data.spoken_reply;
      
      if (data.ui_action === 'TRIGGER_VERIFY') {
        const inv = data.action_data?.invoice_number || 'INV-2026-001';
        selectInvoice(inv);
      } else if (data.ui_action === 'NAVIGATE_REPORTS') {
        if (appState.verificationSummary) {
          DispatchReportGenerator.openCertificateModal(appState.verificationSummary, appState.invoiceData);
        }
      }
    },
    onStateChange: (isListening) => {
      const btn = document.getElementById('voiceTriggerBtn');
      const modal = document.getElementById('voiceAssistantModal');
      if (isListening) {
        btn.classList.add('listening');
        modal.style.display = 'block';
      } else {
        btn.classList.remove('listening');
      }
    }
  });

  // 3. Initialize Barcode Scanner
  barcodeScanner = new BarcodeScannerModule({
    onScanComplete: (res) => {
      const statusEl = document.getElementById('barcodeResult');
      if (statusEl) {
        statusEl.innerHTML = `
          <div style="padding: 10px; border-radius: 6px; font-size: 12px; margin-top: 8px; background: ${res.is_valid && res.invoice_mapped ? 'rgba(0,255,136,0.15)' : 'rgba(255,0,85,0.15)'}; border: 1px solid ${res.is_valid && res.invoice_mapped ? '#00ff88' : '#ff0055'};">
            <strong>${res.is_valid && res.invoice_mapped ? '✅ VALID MATCH' : '🚨 MISMATCH'}</strong>: ${res.status_message}
          </div>
        `;
      }
    }
  });

  // 4. Load initial Invoice and Run AI Pipeline
  await selectInvoice('INV-2026-001', 'perfect_cement_steel');

  // 5. Load Analytics & Hourly Trends Chart
  renderHourlyTrendsChart();
});

// Select and load invoice
async function selectInvoice(invoiceCode, overrideScenario) {
  appState.currentInvoice = invoiceCode;
  
  // Highlight active button
  document.querySelectorAll('.preset-chip').forEach(el => el.classList.remove('active'));
  const activeBtn = document.querySelector(`[data-invoice="${invoiceCode}"]`);
  if (activeBtn) activeBtn.classList.add('active');

  // 1. Fetch OCR extracted invoice data
  try {
    const invRes = await fetch(`/api/invoices/${invoiceCode}`);
    appState.invoiceData = await invRes.json();
    renderInvoiceDetails(appState.invoiceData);
  } catch (e) {
    console.error("Error fetching invoice:", e);
  }

  // 2. Determine corresponding camera detection scenario
  let scenario = overrideScenario;
  if (!scenario) {
    if (invoiceCode === 'INV-2026-001') scenario = 'perfect_cement_steel';
    else if (invoiceCode === 'INV-2026-002') scenario = 'missing_paint_mismatch';
    else if (invoiceCode === 'INV-2026-003') scenario = 'extra_boxes_and_wrong_meds';
    else if (invoiceCode === 'INV-2026-004') scenario = 'pipes_and_cement';
  }
  appState.currentScenario = scenario;

  // 3. Trigger YOLO detection & verification
  await runVerification(invoiceCode, scenario);
}

// Run Dispatch Verification Engine
async function runVerification(invoiceCode, scenario) {
  try {
    // Call verification endpoint
    const res = await fetch('/api/verify-dispatch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        invoice_code: invoiceCode,
        scenario: scenario,
        verified_by: 'USR-001'
      })
    });
    const summary = await res.json();
    appState.verificationSummary = summary;

    // Also fetch detection boxes for HUD
    const detRes = await fetch('/api/detect-products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `scenario=${encodeURIComponent(scenario)}`
    });
    const detectionOutput = await detRes.json();
    appState.detectionData = detectionOutput;

    // Update Canvas Bounding Boxes
    if (canvasRenderer) {
      canvasRenderer.setBoxes(detectionOutput.annotated_boxes, scenario);
    }

    // Play feedback sound
    if (summary.dispatch_status === 'APPROVED') {
      audioSynth.playSuccess();
    } else {
      audioSynth.playAlertBuzzer();
    }

    // Render Verification Matrix & Verdict Banner
    renderVerificationMatrix(summary);
    updateKpis(summary);
    renderAlertsList(summary.alerts_generated);
  } catch (err) {
    console.error("Verification execution error:", err);
  }
}

// Render Extracted Invoice Items
function renderInvoiceDetails(inv) {
  document.getElementById('ocrInvoiceNumber').innerText = inv.invoice_number;
  document.getElementById('ocrCustomer').innerText = inv.customer_name;
  document.getElementById('ocrDate').innerText = inv.dispatch_date;
  document.getElementById('ocrVehicle').innerText = inv.truck_number;
  document.getElementById('ocrTotalQty').innerText = `${inv.total_quantity} units`;
  document.getElementById('ocrConfidence').innerText = `${Math.round(inv.ocr_confidence * 100)}%`;

  const itemsContainer = document.getElementById('ocrItemsList');
  itemsContainer.innerHTML = inv.items.map(item => `
    <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); border-radius: 6px; padding: 8px 12px; margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center; font-size: 13px;">
      <div>
        <div style="font-weight: 600; color: #fff;">${item.product_name}</div>
        <div style="font-size: 11px; color: var(--text-dim); font-family: monospace;">Batch: ${item.batch_id}</div>
      </div>
      <div style="text-align: right;">
        <span style="font-weight: 700; color: var(--cyan); font-size: 14px;">${item.expected_quantity}</span>
        <span style="font-size: 11px; color: var(--text-muted);">${item.unit}</span>
      </div>
    </div>
  `).join('');
}

// Render Verification Matrix Table
function renderVerificationMatrix(summary) {
  const tbody = document.getElementById('matrixTableBody');
  if (!tbody) return;

  tbody.innerHTML = summary.item_breakdown.map(item => {
    let tagClass = 'tag-match';
    if (item.status === 'MISSING') tagClass = 'tag-missing';
    else if (item.status === 'EXTRA') tagClass = 'tag-extra';
    else if (item.status === 'WRONG_ITEM') tagClass = 'tag-wrong';

    return `
      <tr>
        <td style="font-weight: 600; color: #fff;">${item.product_name}</td>
        <td style="text-align: center; color: var(--text-muted);">${item.expected_qty}</td>
        <td style="text-align: center; font-weight: 700; color: ${item.variance === 0 ? 'var(--emerald)' : 'var(--rose)'};">${item.detected_qty}</td>
        <td style="text-align: center; font-weight: 700; color: ${item.variance === 0 ? 'var(--emerald)' : 'var(--rose)'};">${item.variance > 0 ? '+' + item.variance : item.variance}</td>
        <td style="text-align: right;"><span class="status-tag ${tagClass}">${item.status}</span></td>
      </tr>
    `;
  }).join('');

  // Update Verdict Banner
  const verdictBanner = document.getElementById('verdictBanner');
  const verdictText = document.getElementById('verdictText');
  const verdictSub = document.getElementById('verdictSub');
  const verdictActionBtn = document.getElementById('verdictActionBtn');

  if (summary.dispatch_status === 'APPROVED') {
    verdictBanner.className = 'verdict-banner verdict-approved';
    verdictText.innerText = '✅ DISPATCH APPROVED';
    verdictSub.innerText = `All ${summary.total_expected_units} units verified. Gate pass authorized.`;
    verdictActionBtn.className = 'action-btn-primary';
    verdictActionBtn.innerHTML = '📄 Generate Dispatch Gate Pass';
    verdictActionBtn.onclick = () => DispatchReportGenerator.openCertificateModal(summary, appState.invoiceData);
  } else {
    verdictBanner.className = 'verdict-banner verdict-rejected';
    verdictText.innerText = '🚨 RED ALERT: MISMATCH DETECTED';
    verdictSub.innerText = `${summary.discrepancy_count} discrepancy found. Loading halted.`;
    verdictActionBtn.className = 'action-btn-danger';
    verdictActionBtn.innerHTML = '⚠️ View Discrepancy Certificate';
    verdictActionBtn.onclick = () => DispatchReportGenerator.openCertificateModal(summary, appState.invoiceData);
  }
}

// Update KPI cards
function updateKpis(summary) {
  const accEl = document.getElementById('kpiAccuracy');
  if (accEl) accEl.innerText = `${summary.accuracy_percentage}%`;
  const alertEl = document.getElementById('kpiAlertCount');
  if (alertEl) alertEl.innerText = summary.alerts_generated.length;
  const timeEl = document.getElementById('kpiVerifyTime');
  if (timeEl) timeEl.innerText = `${summary.verification_time_seconds}s`;
}

// Render active alerts feed
function renderAlertsList(alerts) {
  const container = document.getElementById('alertsStream');
  if (!container) return;

  if (!alerts || alerts.length === 0) {
    container.innerHTML = `
      <div style="padding: 12px; border-radius: 6px; background: rgba(0,255,136,0.06); border: 1px solid rgba(0,255,136,0.2); color: var(--emerald); font-size: 12px; display: flex; align-items: center; gap: 8px;">
        <span>✅</span> No active discrepancies for current pallet.
      </div>
    `;
    return;
  }

  container.innerHTML = alerts.map(a => `
    <div style="padding: 10px 14px; border-radius: 6px; background: ${a.severity === 'CRITICAL' ? 'rgba(255,0,85,0.15)' : 'rgba(255,184,0,0.15)'}; border: 1px solid ${a.severity === 'CRITICAL' ? 'var(--rose)' : 'var(--amber)'}; margin-bottom: 8px;">
      <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 11px; color: ${a.severity === 'CRITICAL' ? 'var(--rose)' : 'var(--amber)'}; text-transform: uppercase;">
        <span>${a.alert_type}</span>
        <span>${a.severity}</span>
      </div>
      <div style="color: #fff; font-size: 12px; margin-top: 4px;">${a.message}</div>
    </div>
  `).join('');
}

// Test Barcode
function testBarcode(code) {
  if (barcodeScanner) {
    barcodeScanner.verifyCode(code, appState.currentInvoice);
  }
}

// Change Voice Language
function changeLanguage(lang) {
  appState.language = lang;
  if (voiceAssistant) {
    voiceAssistant.setLanguage(lang);
  }
}

// Render Canvas Trends Chart
function renderHourlyTrendsChart() {
  const canvas = document.getElementById('trendsChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width = 480;
  const h = canvas.height = 140;

  const data = [4, 8, 12, 18, 24, 28, 32];
  const labels = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];
  const maxVal = 36;

  ctx.clearRect(0, 0, w, h);

  // Gradient area
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, 'rgba(0, 240, 255, 0.35)');
  grad.addColorStop(1, 'rgba(0, 240, 255, 0.0)');

  ctx.beginPath();
  ctx.moveTo(30, h - 30);
  data.forEach((val, i) => {
    const x = 30 + (i * (w - 60) / (data.length - 1));
    const y = h - 30 - ((val / maxVal) * (h - 50));
    ctx.lineTo(x, y);
  });
  ctx.lineTo(w - 30, h - 30);
  ctx.fillStyle = grad;
  ctx.fill();

  // Line
  ctx.beginPath();
  data.forEach((val, i) => {
    const x = 30 + (i * (w - 60) / (data.length - 1));
    const y = h - 30 - ((val / maxVal) * (h - 50));
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Dots & Labels
  data.forEach((val, i) => {
    const x = 30 + (i * (w - 60) / (data.length - 1));
    const y = h - 30 - ((val / maxVal) * (h - 50));
    ctx.fillStyle = '#00f0ff';
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#64748b';
    ctx.font = '10px Inter, sans-serif';
    ctx.fillText(labels[i], x - 12, h - 10);
  });
}
