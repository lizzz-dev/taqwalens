import { AuditResponse, MadhhabProfile } from "./types";

export function getApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL !== undefined) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
    return "";
  }
  return "http://localhost:8000";
}

const API_BASE_URL = getApiBaseUrl();
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Pre-processes and downsamples an image file to max 1024x1024 using an HTML5 Canvas.
 * Minimizes network transfer and ensures fast processing.
 */
export async function compressImage(file: File, maxDim: number = 1024): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        const scale = Math.min(maxDim / Math.max(width, height), 1.0);
        width = Math.round(width * scale);
        height = Math.round(height * scale);

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file); // fallback to original file
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else resolve(file);
          },
          "image/jpeg",
          0.85
        );
      };
      img.onerror = () => reject(new Error("Unable to parse image file."));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Unable to read image file."));
    reader.readAsDataURL(file);
  });
}

/**
 * Submits packaging image to the backend compliance audit API.
 */
export async function auditProductImage(
  imageFile: File | Blob,
  filename: string = "package.jpg",
  madhhab: MadhhabProfile = "standard"
): Promise<AuditResponse> {
  if (imageFile.size > MAX_FILE_SIZE) {
    throw new Error("File size exceeds the 10MB limit. Please provide a smaller image.");
  }

  // Auto-compress before transmission if File
  let uploadBlob: Blob = imageFile;
  if (imageFile instanceof File && imageFile.size > 200 * 1024) {
    try {
      uploadBlob = await compressImage(imageFile);
    } catch {
      uploadBlob = imageFile;
    }
  }

  const formData = new FormData();
  formData.append("file", uploadBlob, filename);
  formData.append("madhhab", madhhab);

  const response = await fetch(`${API_BASE_URL}/api/audit`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    let errorDetail = "Failed to audit product image.";
    try {
      const errorJson = await response.json();
      errorDetail = errorJson.detail || errorJson.error || errorDetail;
    } catch {
      errorDetail = `Server returned HTTP ${response.status}: ${response.statusText}`;
    }
    throw new Error(errorDetail);
  }

  return response.json();
}

/**
 * Direct barcode lookup fallback against OpenFoodFacts API + Fiqh engine.
 */
export async function auditProductBarcode(
  barcode: string,
  madhhab: MadhhabProfile = "standard"
): Promise<AuditResponse> {
  const cleanBarcode = barcode.trim().replace(/[-\s]/g, "");
  if (!cleanBarcode || !/^\d{6,14}$/.test(cleanBarcode)) {
    throw new Error("Invalid barcode format. Please enter a 6 to 14 digit numeric UPC or EAN code.");
  }

  const url = `${API_BASE_URL}/api/barcode/${encodeURIComponent(cleanBarcode)}?madhhab=${encodeURIComponent(madhhab)}`;
  const response = await fetch(url);

  if (!response.ok) {
    let errorDetail = "Barcode lookup failed.";
    try {
      const errorJson = await response.json();
      errorDetail = errorJson.detail || errorJson.error || errorDetail;
    } catch {
      errorDetail = `Server returned HTTP ${response.status}: ${response.statusText}`;
    }
    throw new Error(errorDetail);
  }

  return response.json();
}

/**
 * Checks backend health and connectivity.
 */
export async function checkBackendHealth(): Promise<{
  status: string;
  groq_configured: boolean;
  gemini_configured: boolean;
  total_additives_indexed: number;
}> {
  const response = await fetch(`${API_BASE_URL}/health`);
  if (!response.ok) {
    throw new Error(`Health check failed with status: ${response.status}`);
  }
  return response.json();
}
