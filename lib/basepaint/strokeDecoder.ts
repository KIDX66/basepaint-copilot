/**
 * Stroke format, per basepaint.xyz/ai.txt:
 *
 *   Skip the leading 0x, then read in 6-hex-char (3-byte) chunks:
 *     byte 0 = x
 *     byte 1 = y
 *     byte 2 = palette color index
 *
 * Coordinates are 0-based from the top-left. Replaying all strokes for a
 * day in order reconstructs the final artwork.
 */

export type Pixel = { x: number; y: number; colorIndex: number };

export function decodeStroke(data: string): Pixel[] {
  const hex = data.startsWith("0x") ? data.slice(2) : data;
  if (hex.length % 6 !== 0) {
    throw new Error(`Stroke data length ${hex.length} is not a multiple of 6 hex chars`);
  }
  const pixels: Pixel[] = [];
  for (let i = 0; i < hex.length; i += 6) {
    const chunk = hex.slice(i, i + 6);
    pixels.push({
      x: parseInt(chunk.slice(0, 2), 16),
      y: parseInt(chunk.slice(2, 4), 16),
      colorIndex: parseInt(chunk.slice(4, 6), 16),
    });
  }
  return pixels;
}

export function decodeStrokes(strokeDataList: string[]): Pixel[] {
  return strokeDataList.flatMap(decodeStroke);
}
