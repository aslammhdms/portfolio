/**
 * Copy text to the clipboard from a click handler. The async Clipboard API needs a
 * secure context and can be refused, so the old execCommand path (still supported
 * everywhere for user-initiated copies) is the fallback. Resolves to whether it worked.
 */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (window.isSecureContext && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Refused or unavailable: try the fallback below.
  }

  const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const area = document.createElement('textarea');
  area.value = text;
  area.setAttribute('readonly', '');
  // Off-screen but focusable, so select() works without scrolling the page.
  area.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;';
  document.body.appendChild(area);
  let ok = false;
  try {
    area.select();
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  }
  area.remove();
  previous?.focus({ preventScroll: true });
  return ok;
}
