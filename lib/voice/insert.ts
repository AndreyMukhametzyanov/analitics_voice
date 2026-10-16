export function insertRecognizedText(
  currentText: string,
  cursorPosition: number,
  recognizedText: string,
): { text: string; cursor: number } {
  const safePosition = Math.min(Math.max(cursorPosition, 0), currentText.length);
  const before = currentText.substring(0, safePosition);
  const after = currentText.substring(safePosition);
  const sticksToPrevious = /^[\n,.;:!?]/.test(recognizedText);
  const sticksToNext = /[\n]$/.test(recognizedText) || /^[\n,.;:!?]/.test(after);
  const leadingSpace = before.length > 0 && !/[\s]$/.test(before) && !sticksToPrevious ? ' ' : '';
  const trailingSpace = after.length > 0 && !/^[\s]/.test(after) && !sticksToNext ? ' ' : '';
  const text = `${before}${leadingSpace}${recognizedText}${trailingSpace}${after}`;
  const cursor = before.length + leadingSpace.length + recognizedText.length + trailingSpace.length;

  return { text, cursor };
}
