interface ScannerImage {
      src: string;
      getBase64NoPrefix?: () => string;
}

interface ScannedImage {
      id: string;
      src: string;
      base64: string | null;
}

interface ScannerOptions {
      use_asprise_dialog?: boolean;
      show_scanner_ui?: boolean;
      twain_cap_setting?: Record<string, string | number | boolean>;
      output_settings?: Array<{
            type: string;
            format: string;
      }>;
}

type ScannerResponseCallback = (
      successful: boolean,
      mesg?: string,
      response?: unknown
) => void;

interface ScannerWindow {
      scan: (
            callback: ScannerResponseCallback,
            options: ScannerOptions
      ) => void;

      getScannedImages: (
            response: unknown,
            returnBase64: boolean,
            keepOriginal: boolean
      ) => ScannerImage[];
}

interface Window {
      scanner?: ScannerWindow;
}