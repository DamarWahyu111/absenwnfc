/**
 * NFC Utilities for Web NFC API
 * Supports Android Chrome with NFC capability
 */

export interface NFCReadResult {
  uid: string
  message?: string
}

/**
 * Check if Web NFC API is supported
 */
export function isNFCSupported(): boolean {
  return typeof window !== 'undefined' && 'NDEFReader' in window
}

/**
 * Request NFC permission and start scanning
 */
export async function startNFCScan(): Promise<NFCReadResult> {
  return new Promise((resolve, reject) => {
    if (!isNFCSupported()) {
      reject(new Error('NFC tidak didukung pada perangkat ini'))
      return
    }

    try {
      const ndef = new (window as any).NDEFReader()

      const handleReading = (event: any) => {
        const uid = event.serialNumber
        ndef.onreading = null
        ndef.onreadingerror = null
        resolve({ uid })
      }

      const handleError = (error: any) => {
        ndef.onreading = null
        ndef.onreadingerror = null

        if (error.name === 'NotAllowedError') {
          reject(new Error('Izin NFC ditolak'))
        } else if (error.name === 'NotSupportedError') {
          reject(new Error('NFC tidak didukung'))
        } else {
          reject(new Error('Gagal membaca NFC'))
        }
      }

      ndef.onreading = handleReading
      ndef.onreadingerror = handleError

      ndef.scan().catch((err: any) => {
        ndef.onreading = null
        ndef.onreadingerror = null

        if (err.name === 'NotAllowedError') {
          reject(new Error('Izin NFC ditolak'))
        } else if (err.name === 'NotSupportedError') {
          reject(new Error('NFC tidak didukung'))
        } else {
          reject(new Error('Gagal mengakses NFC'))
        }
      })
    } catch (err) {
      reject(err)
    }
  })
}

/**
 * Check NFC device compatibility
 */
export function checkNFCCompatibility(): {
  supported: boolean
  message: string
} {
  if (!isNFCSupported()) {
    return {
      supported: false,
      message: 'Perangkat Anda tidak mendukung NFC. Gunakan Android 7.0+ dengan Chrome.',
    }
  }

  return {
    supported: true,
    message: 'Perangkat mendukung NFC',
  }
}
