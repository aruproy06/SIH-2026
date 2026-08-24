/**
 * VisionWare AI - Barcode & QR Code Package Scanner (Feature 6)
 */

class BarcodeScannerModule {
  constructor(options = {}) {
    this.activeInvoiceId = options.activeInvoiceId || 'INV-2026-001';
    this.onScanComplete = options.onScanComplete || null;
  }

  async verifyCode(scannedCode, invoiceId) {
    const inv = invoiceId || this.activeInvoiceId;
    try {
      const response = await fetch('/api/verify-barcode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scanned_code: scannedCode,
          invoice_id: inv
        })
      });
      const data = await response.json();
      if (this.onScanComplete) {
        this.onScanComplete(data);
      }
      return data;
    } catch (err) {
      console.error("Barcode verification error:", err);
      return {
        is_valid: false,
        status_message: "Network error during barcode check."
      };
    }
  }
}
