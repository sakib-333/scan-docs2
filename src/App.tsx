import React, { useState } from 'react';

const App: React.FC = () => {
      const [scannedImages, setScannedImages] = useState<ScannedImage[]>([]);
      const [isScanning, setIsScanning] = useState<boolean>(false);
      const [errorMessage, setErrorMessage] = useState<string>('');

      const handleScanResponse: ScannerResponseCallback = (
            successful,
            mesg,
            response
      ) => {
            setIsScanning(false);

            if (!successful) {
                  console.error('Scan failed:', mesg);
                  setErrorMessage(mesg || 'Scan failed. Please try again.');
                  return;
            }

            if (
                  mesg &&
                  mesg.toLowerCase().includes('user cancel')
            ) {
                  console.info('User cancelled scanning.');
                  setErrorMessage('');
                  return;
            }

            if (!window.scanner) {
                  setErrorMessage('Scanner library is not loaded.');
                  return;
            }

            const images = window.scanner.getScannedImages(
                  response,
                  true,
                  false
            );

            console.log('Scanned images:', images);

            if (!Array.isArray(images) || images.length === 0) {
                  setErrorMessage('No scanned image found.');
                  return;
            }

            const formattedImages = images.map((image, index) => {
                  return {
                        id: `${Date.now()}-${index}`,
                        src: image.src,
                        base64: image.getBase64NoPrefix
                              ? image.getBase64NoPrefix()
                              : null,
                  };
            });

            setScannedImages(formattedImages);
            setErrorMessage('');
      };

      const handleScanDocument = () => {
            if (!window.scanner) {
                  setErrorMessage(
                        'Scanner is not ready. Please make sure scanner.js is loaded and the scanner software is installed.'
                  );
                  return;
            }

            setIsScanning(true);
            setErrorMessage('');

            window.scanner.scan(handleScanResponse, {
                  use_asprise_dialog: true,
                  show_scanner_ui: true,

                  twain_cap_setting: {
                        ICAP_PIXELTYPE: 'TWPT_RGB',
                  },

                  output_settings: [
                        {
                              type: 'return-base64',
                              format: 'jpg',
                        },
                  ],
            });
      };

      const handleClearImages = () => {
            setScannedImages([]);
            setErrorMessage('');
      };

      return (
            <div style={styles.container}>
                  <h2 style={styles.title}>Document Scanner</h2>

                  <p style={styles.description}>
                        Connect your printer/scanner, then click the button below to scan a document.
                  </p>

                  <div style={styles.buttonRow}>
                        <button
                              onClick={handleScanDocument}
                              disabled={isScanning}
                              style={{
                                    ...styles.button,
                                    opacity: isScanning ? 0.6 : 1,
                                    cursor: isScanning ? 'not-allowed' : 'pointer',
                              }}
                        >
                              {isScanning ? 'Scanning...' : 'Scan Document'}
                        </button>

                        {scannedImages.length > 0 ? (
                              <button
                                    onClick={handleClearImages}
                                    style={styles.clearButton}
                              >
                                    Clear Preview
                              </button>
                        ) : null}
                  </div>

                  {errorMessage ? (
                        <div style={styles.errorBox}>
                              {errorMessage}
                        </div>
                  ) : null}

                  <div style={styles.previewSection}>
                        <h3 style={styles.previewTitle}>Scanned Preview</h3>

                        {scannedImages.length === 0 ? (
                              <div style={styles.emptyPreview}>
                                    No scanned document yet.
                              </div>
                        ) : (
                              <div style={styles.imageGrid}>
                                    {scannedImages.map((image, index) => (
                                          <div
                                                key={image.id}
                                                style={styles.imageCard}
                                          >
                                                <img
                                                      src={image.src}
                                                      alt={`Scanned document ${index + 1}`}
                                                      style={styles.scannedImage}
                                                />

                                                <p style={styles.imageLabel}>
                                                      Page {index + 1}
                                                </p>
                                          </div>
                                    ))}
                              </div>
                        )}
                  </div>
            </div>
      );
};

const styles: Record<string, React.CSSProperties> = {
      container: {
            padding: 24,
            maxWidth: 900,
            margin: '0 auto',
            fontFamily: 'Arial, sans-serif',
      },

      title: {
            marginBottom: 8,
            fontSize: 28,
      },

      description: {
            color: '#555',
            marginBottom: 20,
      },

      buttonRow: {
            display: 'flex',
            gap: 12,
            marginBottom: 20,
      },

      button: {
            padding: '12px 20px',
            backgroundColor: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontSize: 16,
            fontWeight: 600,
      },

      clearButton: {
            padding: '12px 20px',
            backgroundColor: '#ef4444',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontSize: 16,
            fontWeight: 600,
            cursor: 'pointer',
      },

      errorBox: {
            padding: 12,
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            borderRadius: 8,
            marginBottom: 20,
      },

      previewSection: {
            marginTop: 24,
      },

      previewTitle: {
            marginBottom: 12,
            fontSize: 20,
      },

      emptyPreview: {
            padding: 40,
            border: '2px dashed #d1d5db',
            borderRadius: 12,
            textAlign: 'center',
            color: '#6b7280',
      },

      imageGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 16,
      },

      imageCard: {
            border: '1px solid #e5e7eb',
            borderRadius: 12,
            padding: 12,
            backgroundColor: '#fff',
      },

      scannedImage: {
            width: '100%',
            height: 260,
            objectFit: 'contain',
            borderRadius: 8,
            backgroundColor: '#f9fafb',
      },

      imageLabel: {
            marginTop: 8,
            marginBottom: 0,
            textAlign: 'center',
            color: '#374151',
            fontWeight: 500,
      },
};

export default App;