// ==UserScript==
// @name        Copy GitHub PR Markdown Link
// @icon        data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAgMTZDMCA3LjE2IDcuMTYgMCAxNiAwQzI0Ljg0IDAgMzIgNy4xNiAzMiAxNkMzMiAxNi4zMzU4IDMxLjk4OTYgMTYuNjY5MyAzMS45NjkyIDE3SDI2LjExMjFDMjYuMTk1NyAxNi40NCAyNi4yNCAxNS44MjgzIDI2LjI0IDE1LjE2QzI2LjI0IDEzLjQgMjUuNjIgMTEuOTggMjQuNiAxMC44NkMyNC43NiAxMC40NiAyNS4zMiA4LjgyIDI0LjQ0IDYuNjJDMjQuNDQgNi42MiAyMy4xIDYuMTggMjAuMDQgOC4yNkMxOC43NiA3LjkgMTcuNCA3LjcyIDE2LjA0IDcuNzJDMTQuNjggNy43MiAxMy4zMiA3LjkgMTIuMDQgOC4yNkM4Ljk4IDYuMiA3LjY0IDYuNjIgNy42NCA2LjYyQzYuNzYgOC44MiA3LjMyIDEwLjQ2IDcuNDggMTAuODZDNi40NiAxMS45OCA1Ljg0IDEzLjQyIDUuODQgMTUuMTZDNS44NCAyMC42Mzg3IDguODIxMTkgMjIuMzE4NyAxMiAyMi44OTc2VjI1LjI0NDJDMTEuMDIyNCAyNS42NjMyIDguODMwMzUgMjYuMjE2NiA3LjQ0IDIzLjg4QzcuMTQgMjMuNCA2LjI0IDIyLjIyIDQuOTggMjIuMjRDMy42NCAyMi4yNiA0LjQ0IDIzIDUgMjMuM0M1LjY4IDIzLjY4IDYuNDYgMjUuMSA2LjY0IDI1LjU2QzYuOTU5NDcgMjYuNDU4NSA3Ljk5NjU1IDI4LjE3NDMgMTIgMjcuNDQzN1YzMC42ODE0QzExLjg5NTEgMzEuMDExNiAxMS41NzUxIDMxLjI5MTEgMTAuOTQgMzEuMThDNC41OCAyOS4wNiAwIDIzLjA4IDAgMTZaIiBmaWxsPSJ3aGl0ZSIvPgo8Y2lyY2xlIGN4PSIyNiIgY3k9IjI2IiByPSI1IiBmaWxsPSIjRjlDNTEzIi8+Cjwvc3ZnPgo=
// @version     1.0.0
//
// @author      https://github.com/lukethacoder
// @description Copies the current Pull Request as a markdown URL using Cmd/Ctrl + C or by clicking the PR title
//
// @match       https://github.com/*
// @grant       GM_registerMenuCommand
// @grant       GM_setClipboard
// @noframes
// ==/UserScript==

(() => {
  let toast;
  let toastTimer;

  function showToast(message) {
    toast?.remove();
    clearTimeout(toastTimer);

    toast = document.createElement('div');
    toast.setAttribute('role', 'status');

    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('aria-hidden', 'true');
    icon.setAttribute('focusable', 'false');
    icon.setAttribute('viewBox', '0 0 16 16');
    icon.setAttribute('width', '16');
    icon.setAttribute('height', '16');
    icon.setAttribute('fill', 'currentColor');
    icon.style.flexShrink = '0';
    icon.style.color = 'var(--fgColor-success,var(--color-success-fg))';

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute(
      'd',
      'M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z',
    );
    icon.append(path);

    const text = document.createElement('span');
    text.textContent = message;
    toast.append(icon, text);

    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      display: flex;
      align-items: center;
      gap: 6px;
      right: 24px;
      z-index: 2147483647;
      max-width: calc(100vw - 48px);
      padding: 12px 16px;
      border: 1px solid var(--borderColor-muted);
      border-radius: 8px;
      background: var(--bgColor-muted);
      color: var(--fgColor-default, var(--color-fg-default));
      box-shadow: 0 8px 24px rgba(0, 0, 0, .2);
      font: 14px/1.5 system-ui, sans-serif;
      pointer-events: none;
    `;

    document.body.append(toast);

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      toast.animate(
        [
          { opacity: 0, translate: '0 8px' },
          { opacity: 1, translate: '0 0' },
        ],
        {
          duration: 180,
          easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        },
      );
    }

    const currentToast = toast;

    toastTimer = setTimeout(async () => {
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        await currentToast.animate(
          [
            { opacity: 1, translate: '0 0' },
            { opacity: 0, translate: '0 8px' },
          ],
          {
            duration: 150,
            easing: 'ease-in',
            fill: 'forwards',
          },
        ).finished;
      }

      currentToast.remove();
    }, 5000);
  }

  function getMarkdownLink() {
    if (!/^\/[^/]+\/[^/]+\/pull\/\d+(\/|$)/.test(location.pathname)) {
      return null;
    }

    const title = document
      .querySelector('.js-issue-title, .markdown-title')
      ?.textContent.trim();

    if (!title) return null;

    const escapedTitle = title.replace(/[\\[\]]/g, '\\$&');
    return `[${escapedTitle}](${location.href})`;
  }

  function copyLink(link) {
    GM_setClipboard(link, 'text/plain');
    showToast('PR Markdown link copied');
  }

  GM_registerMenuCommand('Copy PR Markdown link', () => {
    const link = getMarkdownLink();
    if (link) copyLink(link);
    else showToast('Open a PR with a visible title first');
  });

  document.addEventListener('keydown', (event) => {
    if (
      event.defaultPrevented ||
      event.repeat ||
      event.isComposing ||
      !(event.ctrlKey || event.metaKey) ||
      event.altKey ||
      event.shiftKey ||
      event.key.toLowerCase() !== 'c'
    ) return;

    const editing = event.composedPath().some((element) =>
      element instanceof HTMLElement &&
      (element.matches('input, textarea, select, [role="textbox"]') ||
        element.isContentEditable)
    );

    if (editing || window.getSelection()?.toString()) return;

    const link = getMarkdownLink();
    if (!link) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    copyLink(link);
  }, true);

  document.addEventListener('click', (event) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.ctrlKey ||
      event.metaKey ||
      event.altKey ||
      event.shiftKey ||
      window.getSelection()?.toString()
    ) return;

    const title = event.target instanceof Element
      ? event.target.closest('.js-issue-title, .markdown-title')
      : null;

    if (!title || title.isContentEditable) return;
    if (event.target.closest('a, button, input, textarea')) return;

    const link = getMarkdownLink();
    if (!link) return;

    event.preventDefault();
    copyLink(link);
  });

  const style = document.createElement('style');
  style.textContent = `
    :is(.js-issue-title, .markdown-title):not([contenteditable="true"]):hover {
      cursor: pointer;
      text-decoration: underline;
      text-underline-offset: 3px;
    }
  `;
  document.head.append(style);
})();
