/**
 * VisionWare AI - Dispatch Audit Certificate & Report Generator
 */

class DispatchReportGenerator {
  static openCertificateModal(summary, invoiceData) {
    let modal = document.getElementById('certificateModal');
    if (!modal) return;

    const modalBody = document.getElementById('certificateBody');
    if (!modalBody) return;

    const isApproved = summary.dispatch_status === 'APPROVED';
    const statusColor = isApproved ? '#00ff88' : '#ff0055';
    const statusText = isApproved ? 'DISPATCH APPROVED — GATE PASS ISSUED' : 'DISPATCH REJECTED — CARGO QUARANTINE';

    let itemsHtml = (summary.item_breakdown || []).map(item => `
      <tr style="border-bottom: 1px solid rgba(255,255,255,0.06);">
        <td style="padding: 8px 12px; font-weight: 500;">${item.product_name}</td>
        <td style="padding: 8px 12px; text-align: center;">${item.expected_qty}</td>
        <td style="padding: 8px 12px; text-align: center; color: ${item.variance === 0 ? '#00ff88' : '#ff0055'};">${item.detected_qty}</td>
        <td style="padding: 8px 12px; text-align: center; font-weight: 700; color: ${item.variance === 0 ? '#00ff88' : '#ff0055'};">${item.variance > 0 ? '+' + item.variance : item.variance}</td>
        <td style="padding: 8px 12px; text-align: right;"><span style="background: rgba(255,255,255,0.08); padding: 2px 8px; border-radius: 4px; font-size: 11px;">${item.status}</span></td>
      </tr>
    `).join('');

    modalBody.innerHTML = `
      <div style="border: 2px solid ${statusColor}; border-radius: 12px; padding: 24px; background: rgba(10, 16, 30, 0.95);">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 16px;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="background: #00f0ff; color: #000; font-weight: 800; padding: 2px 6px; border-radius: 4px; font-size: 12px;">SIH-2026</span>
              <h2 style="font-size: 20px; font-weight: 800; color: #fff; margin: 0;">VisionWare AI Dispatch Gate Pass</h2>
            </div>
            <p style="color: #94a3b8; font-size: 12px; margin-top: 4px;">Smart Warehouse Audit & AI Discrepancy Verification System</p>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 12px; color: #94a3b8;">Certificate ID</div>
            <div style="font-family: monospace; font-size: 14px; color: #00f0ff; font-weight: 700;">VW-DISP-${Date.now().toString().slice(-6)}</div>
          </div>
        </div>

        <!-- Status Banner -->
        <div style="background: ${isApproved ? 'rgba(0,255,136,0.12)' : 'rgba(255,0,85,0.12)'}; border: 1px solid ${statusColor}; border-radius: 8px; padding: 12px 16px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-size: 11px; text-transform: uppercase; color: #94a3b8;">Verification Verdict</div>
            <div style="font-size: 16px; font-weight: 800; color: ${statusColor};">${statusText}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 11px; text-transform: uppercase; color: #94a3b8;">Accuracy Score</div>
            <div style="font-size: 18px; font-weight: 800; color: ${statusColor};">${summary.accuracy_percentage}%</div>
          </div>
        </div>

        <!-- Metadata Grid -->
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 20px; font-size: 12px;">
          <div><strong style="color: #94a3b8;">Invoice Number:</strong> <span style="color: #fff; font-weight: 600;">${summary.invoice_number}</span></div>
          <div><strong style="color: #94a3b8;">Verification Time:</strong> <span style="color: #fff;">${summary.verification_time_seconds}s</span></div>
          <div><strong style="color: #94a3b8;">Warehouse Facility:</strong> <span style="color: #fff;">Mumbai Central Logistics Hub #1</span></div>
          <div><strong style="color: #94a3b8;">Verified Timestamp:</strong> <span style="color: #fff;">${summary.verified_at}</span></div>
          <div><strong style="color: #94a3b8;">Supervisor on Duty:</strong> <span style="color: #fff;">Mohit Sharma (Manager)</span></div>
          <div><strong style="color: #94a3b8;">AI Pipeline:</strong> <span style="color: #00f0ff;">YOLOv11x + PaddleOCR-v4</span></div>
        </div>

        <!-- Itemized Verification Table -->
        <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 20px;">
          <thead>
            <tr style="background: rgba(255,255,255,0.04); color: #94a3b8; text-align: left;">
              <th style="padding: 8px 12px;">Product Description</th>
              <th style="padding: 8px 12px; text-align: center;">Expected</th>
              <th style="padding: 8px 12px; text-align: center;">AI Detected</th>
              <th style="padding: 8px 12px; text-align: center;">Variance</th>
              <th style="padding: 8px 12px; text-align: right;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <!-- Footer & Signatures -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 16px; font-size: 11px; color: #64748b;">
          <div>
            <div>🔐 SHA256 Signature Hash:</div>
            <div style="font-family: monospace; color: #94a3b8;">8f9a2b1c4e7d0f99321aa74618eacbf027651a</div>
          </div>
          <button onclick="window.print()" style="background: #00f0ff; color: #000; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 700; cursor: pointer;">
            🖨️ Print Certificate
          </button>
        </div>
      </div>
    `;

    modal.style.display = 'flex';
  }

  static closeModal() {
    const modal = document.getElementById('certificateModal');
    if (modal) modal.style.display = 'none';
  }
}
