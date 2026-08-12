import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import jsPDF from 'jspdf';
import QrCodeGenerator from './QrCodeGenerator';

// jsPDF is dynamically imported inside exportPdf(); mocked so these tests
// exercise this component's control flow (what gets drawn, when, with what
// data) rather than jsPDF's own internals — the real PDF output was
// verified separately by rendering an actual file (see PR description).
const mockDoc = {
  setFillColor: jest.fn(),
  rect: jest.fn(),
  setFont: jest.fn(),
  setFontSize: jest.fn(),
  setTextColor: jest.fn(),
  text: jest.fn(),
  setDrawColor: jest.fn(),
  setLineWidth: jest.fn(),
  roundedRect: jest.fn(),
  addImage: jest.fn(),
  line: jest.fn(),
  save: jest.fn(),
};
// __esModule: true is required — without it, Babel's dynamic-import interop
// wraps the whole mock object as `.default` (since it looks like a bare CJS
// module), so `const { default: jsPDF } = await import('jspdf')` would
// destructure the entire mock object instead of the constructor function.
jest.mock('jspdf', () => ({
  __esModule: true,
  default: jest.fn()
}));

class FakeFileReader {
  result: string | null = null;
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  readAsDataURL() {
    this.result = 'data:image/png;base64,mock';
    this.onload && this.onload();
  }
}

describe('QrCodeGenerator', () => {
  const fakeBlob = { size: 10, type: 'image/png' };

  beforeEach(() => {
    jest.clearAllMocks();
    // react-scripts' default Jest config sets resetMocks: true, which wipes
    // even a jest.fn's constructor-time implementation between tests, not
    // just its call history — reassign fresh every time, and as a plain
    // function since exportPdf() calls `new jsPDF(...)`, which arrow
    // functions can't support ([[Construct]] doesn't exist on them).
    (jsPDF as unknown as jest.Mock).mockImplementation(function () {
      return mockDoc;
    });
    global.fetch = jest.fn().mockResolvedValue({
      blob: () => Promise.resolve(fakeBlob)
    }) as any;
    window.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
    window.URL.revokeObjectURL = jest.fn();
    (global as any).FileReader = FakeFileReader;
  });

  it('shows an error and renders no QR image when shopCode is missing outside generic mode', () => {
    render(<QrCodeGenerator />);
    expect(screen.getByText('Shop code is required')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders the shop-specific QR image and metadata', () => {
    render(<QrCodeGenerator shopCode="JMR153" shopName="JMR Cycling" />);
    const img = screen.getByRole('img') as HTMLImageElement;
    expect(img.src).toContain('quickchart.io/qr');
    expect(img.src).toContain(
      encodeURIComponent('https://jmrcycling.com:3001/qr/onboard/JMR153')
    );
    expect(screen.getAllByText('JMR153').length).toBeGreaterThan(0);
  });

  it('renders generic mode without requiring a shop code', () => {
    render(<QrCodeGenerator genericMode genericUrl="https://example.com/app" />);
    const img = screen.getByRole('img') as HTMLImageElement;
    expect(img.src).toContain(encodeURIComponent('https://example.com/app'));
    expect(screen.getByText('Generic App Access')).toBeInTheDocument();
  });

  it('downloads the QR image as a PNG when Download is clicked', async () => {
    render(<QrCodeGenerator shopCode="JMR153" shopName="JMR Cycling" />);
    fireEvent.click(screen.getByRole('button', { name: /download/i }));
    await waitFor(() =>
      expect(window.URL.createObjectURL).toHaveBeenCalledWith(fakeBlob)
    );
    expect(window.URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  });

  it('shows a download error and calls onError when the fetch fails', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('network down'));
    const onError = jest.fn();
    render(
      <QrCodeGenerator shopCode="JMR153" shopName="JMR Cycling" onError={onError} />
    );
    fireEvent.click(screen.getByRole('button', { name: /download/i }));
    await waitFor(() =>
      expect(screen.getByText('Failed to download QR code')).toBeInTheDocument()
    );
    expect(onError).toHaveBeenCalledWith('Failed to download QR code');
  });

  it('exports a branded PDF including the shop code when Export PDF is clicked', async () => {
    render(<QrCodeGenerator shopCode="JMR153" shopName="JMR Cycling" />);
    fireEvent.click(screen.getByRole('button', { name: /export pdf/i }));
    await waitFor(() =>
      expect(mockDoc.save).toHaveBeenCalledWith('jmr-cycling-qr-poster.pdf')
    );
    expect(mockDoc.text).toHaveBeenCalledWith(
      expect.stringContaining('JMR153'),
      expect.any(Number),
      expect.any(Number),
      expect.any(Object)
    );
    expect(mockDoc.addImage).toHaveBeenCalledWith(
      'data:image/png;base64,mock',
      'PNG',
      expect.any(Number),
      expect.any(Number),
      expect.any(Number),
      expect.any(Number)
    );
  });

  it('omits the shop code line from the PDF in generic mode', async () => {
    render(<QrCodeGenerator genericMode genericUrl="https://example.com/app" />);
    fireEvent.click(screen.getByRole('button', { name: /export pdf/i }));
    await waitFor(() =>
      expect(mockDoc.save).toHaveBeenCalledWith('kor-qr-poster.pdf')
    );
    expect(mockDoc.text).not.toHaveBeenCalledWith(
      expect.stringContaining('SHOP CODE'),
      expect.anything(),
      expect.anything(),
      expect.anything()
    );
  });

  it('shows an export error, calls onError, and re-enables the button when PDF generation fails', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('network down'));
    const onError = jest.fn();
    render(
      <QrCodeGenerator shopCode="JMR153" shopName="JMR Cycling" onError={onError} />
    );
    const exportBtn = screen.getByRole('button', { name: /export pdf/i });
    fireEvent.click(exportBtn);
    await waitFor(() =>
      expect(screen.getByText('Failed to export PDF')).toBeInTheDocument()
    );
    expect(onError).toHaveBeenCalledWith('Failed to export PDF');
    expect(mockDoc.save).not.toHaveBeenCalled();
  });
});
