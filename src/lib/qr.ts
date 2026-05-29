import QRCode from 'qrcode'

export async function generateQRCode(assetId: string): Promise<string> {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/assets/${assetId}`
  const qrDataUrl = await QRCode.toDataURL(url, {
    width: 300,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
    errorCorrectionLevel: 'H',
  })
  return qrDataUrl
}

export async function generateQRBuffer(assetId: string): Promise<Buffer> {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/assets/${assetId}`
  const buffer = await QRCode.toBuffer(url, {
    width: 300,
    margin: 2,
    errorCorrectionLevel: 'H',
  })
  return buffer
}

