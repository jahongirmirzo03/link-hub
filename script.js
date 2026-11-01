/**
 * ==============================================================================
 * SHADCN / UI LINK HUB - INTERACTIVE SCRIPTS
 * Author: Mirzaliyev Jahongirmirzo
 * Design: shadcn/ui (Zinc Theme, Radix-style Command, Dialog, Tabs, Sonner Toast)
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // ----------------------------------------------------------------------------
  // 1. Current Year in Footer
  // ----------------------------------------------------------------------------
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // ----------------------------------------------------------------------------
  // 2. Dark / Light Theme Controller (shadcn/ui zinc theme)
  // ----------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIconSun = document.getElementById('themeIconSun');
  const themeIconMoon = document.getElementById('themeIconMoon');

  function getPreferredTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      if (themeIconSun) themeIconSun.style.display = 'none';
      if (themeIconMoon) themeIconMoon.style.display = 'block';
    } else {
      document.documentElement.classList.remove('dark');
      if (themeIconSun) themeIconSun.style.display = 'block';
      if (themeIconMoon) themeIconMoon.style.display = 'none';
    }
    localStorage.setItem('theme', theme);
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    showToast(
      nextTheme === 'dark' ? "Qorong'i rejim faollashtirildi" : "Yorug' rejim faollashtirildi",
      `Sayt uslubi ${nextTheme} rejimiga o'zgartirildi.`
    );
  }

  // Initial theme setup
  applyTheme(getPreferredTheme());

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }

  // Listen to OS theme changes if user hasn't explicitly set preference
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  // ----------------------------------------------------------------------------
  // 3. Sonner Toast System (shadcn/ui Sonner)
  // ----------------------------------------------------------------------------
  const sonnerToast = document.getElementById('sonnerToast');
  const toastTitle = document.getElementById('toastTitle');
  const toastDescription = document.getElementById('toastDescription');
  const closeToastBtn = document.getElementById('closeToastBtn');
  let toastTimeout = null;

  function showToast(title = 'Muvaffaqiyatli!', description = 'Amal bajarildi.', duration = 3200) {
    if (!sonnerToast) return;

    if (toastTitle) toastTitle.textContent = title;
    if (toastDescription) toastDescription.textContent = description;

    sonnerToast.classList.add('show');

    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }

    toastTimeout = setTimeout(() => {
      sonnerToast.classList.remove('show');
    }, duration);
  }

  if (closeToastBtn) {
    closeToastBtn.addEventListener('click', () => {
      if (sonnerToast) sonnerToast.classList.remove('show');
    });
  }

  // ----------------------------------------------------------------------------
  // 4. Clipboard Copy Utility
  // ----------------------------------------------------------------------------
  async function copyToClipboard(text, customMessage = null) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      showToast(
        customMessage ? customMessage.title : 'Havola nusxalandi!',
        customMessage ? customMessage.desc : 'Vaqtinchalik xotiraga muvaffaqiyatli saqlandi.'
      );
    } catch (err) {
      console.error('Nusxalashda xatolik:', err);
      showToast('Nusxalashda xatolik', 'Havolani qo\'lda nusxalab oling.');
    }
  }

  // ----------------------------------------------------------------------------
  // 5. Search and Category Filter (shadcn Tabs & Input)
  // ----------------------------------------------------------------------------
  const searchInput = document.getElementById('searchInput');
  const searchClearBtn = document.getElementById('searchClearBtn');
  const tabButtons = document.querySelectorAll('.tabs-trigger');
  const cards = document.querySelectorAll('.shadcn-card');
  const linksCountBadge = document.getElementById('linksCountBadge');
  const emptyState = document.getElementById('emptyState');
  const resetSearchBtn = document.getElementById('resetSearchBtn');

  let currentCategory = 'all';
  let searchQuery = '';

  function filterCards() {
    let visibleCount = 0;
    const query = searchQuery.trim().toLowerCase();

    cards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      const cardKeywords = (card.getAttribute('data-keywords') || '').toLowerCase();
      const cardTitle = (card.querySelector('.card-title')?.textContent || '').toLowerCase();
      const cardDesc = (card.querySelector('.card-desc')?.textContent || '').toLowerCase();

      const matchesCategory = (currentCategory === 'all' || cardCategory === currentCategory);
      const matchesSearch = !query || 
        cardTitle.includes(query) || 
        cardDesc.includes(query) || 
        cardKeywords.includes(query);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Update count badge
    if (linksCountBadge) {
      linksCountBadge.textContent = `${visibleCount} ta havola`;
    }

    // Toggle Empty State
    if (emptyState) {
      if (visibleCount === 0) {
        emptyState.classList.add('active');
      } else {
        emptyState.classList.remove('active');
      }
    }

    // Toggle Clear button in search input
    if (searchClearBtn) {
      if (query.length > 0) {
        searchClearBtn.classList.add('active');
      } else {
        searchClearBtn.classList.remove('active');
      }
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      filterCards();
    });
  }

  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        searchQuery = '';
        filterCards();
        searchInput.focus();
      }
    });
  }

  if (resetSearchBtn) {
    resetSearchBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      searchQuery = '';
      currentCategory = 'all';
      tabButtons.forEach(b => b.classList.toggle('active', b.getAttribute('data-category') === 'all'));
      filterCards();
    });
  }

  tabButtons.forEach(tab => {
    tab.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      tab.classList.add('active');
      currentCategory = tab.getAttribute('data-category') || 'all';
      filterCards();
    });
  });

  // ----------------------------------------------------------------------------
  // 6. Direct Card Copy Buttons
  // ----------------------------------------------------------------------------
  const cardCopyBtns = document.querySelectorAll('.card-copy-btn');
  cardCopyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const copyTarget = btn.getAttribute('data-copy');
      const targetUrl = (copyTarget && copyTarget !== '#') ? copyTarget : window.location.href;
      const cardTitle = btn.closest('.shadcn-card')?.querySelector('.card-title')?.textContent || 'Havola';

      copyToClipboard(targetUrl, {
        title: `${cardTitle} nusxalandi!`,
        desc: targetUrl
      });
    });
  });

  // Hero Quick Copy Button
  const quickCopyBtn = document.getElementById('quickCopyBtn');
  if (quickCopyBtn) {
    quickCopyBtn.addEventListener('click', () => {
      copyToClipboard(window.location.href, {
        title: 'Sahifa havolasi nusxalandi!',
        desc: window.location.href
      });
    });
  }

  // ----------------------------------------------------------------------------
  // 7. QR Code & Share Modal (shadcn/ui Dialog)
  // ----------------------------------------------------------------------------
  const shareDialog = document.getElementById('shareDialog');
  const shareDialogBtn = document.getElementById('shareDialogBtn');
  const openQrBtn = document.getElementById('openQrBtn');
  const closeShareDialogBtn = document.getElementById('closeShareDialogBtn');
  const qrCodeImg = document.getElementById('qrCodeImg');
  const shareUrlInput = document.getElementById('shareUrlInput');
  const copyModalUrlBtn = document.getElementById('copyModalUrlBtn');

  function openShareDialog() {
    const currentUrl = window.location.href;
    if (shareUrlInput) {
      shareUrlInput.value = currentUrl;
    }

    if (qrCodeImg) {
      // High-resolution vector/PNG QR code generation
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=4&data=${encodeURIComponent(currentUrl)}`;
      qrCodeImg.onerror = () => {
        // Offline vector SVG QR fallback
        qrCodeImg.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='%2309090b'><rect width='100' height='100' fill='white'/><rect x='10' y='10' width='30' height='30' fill='none' stroke='%2309090b' stroke-width='6'/><rect x='20' y='20' width='10' height='10'/><rect x='60' y='10' width='30' height='30' fill='none' stroke='%2309090b' stroke-width='6'/><rect x='70' y='20' width='10' height='10'/><rect x='10' y='60' width='30' height='30' fill='none' stroke='%2309090b' stroke-width='6'/><rect x='20' y='70' width='10' height='10'/><rect x='48' y='15' width='6' height='15'/><rect x='48' y='45' width='6' height='10'/><rect x='15' y='48' width='25' height='6'/><rect x='55' y='55' width='30' height='6'/><rect x='55' y='70' width='12' height='15'/><rect x='75' y='75' width='15' height='15'/></svg>";
      };
      qrCodeImg.src = qrApiUrl;
    }

    if (shareDialog) {
      shareDialog.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeShareDialog() {
    if (shareDialog) {
      shareDialog.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (shareDialogBtn) shareDialogBtn.addEventListener('click', openShareDialog);
  if (openQrBtn) openQrBtn.addEventListener('click', openShareDialog);
  if (closeShareDialogBtn) closeShareDialogBtn.addEventListener('click', closeShareDialog);

  if (copyModalUrlBtn) {
    copyModalUrlBtn.addEventListener('click', () => {
      const url = shareUrlInput?.value || window.location.href;
      copyToClipboard(url, {
        title: 'Havola nusxalandi!',
        desc: 'Do\'stlaringiz va hamkasblaringizga yuborishingiz mumkin.'
      });
    });
  }

  if (shareDialog) {
    shareDialog.addEventListener('click', (e) => {
      if (e.target === shareDialog) {
        closeShareDialog();
      }
    });
  }

  // ----------------------------------------------------------------------------
  // 8. Command Palette Dialog (shadcn/ui cmdk ⌘K)
  // ----------------------------------------------------------------------------
  const commandDialog = document.getElementById('commandDialog');
  const openCommandBtn = document.getElementById('openCommandBtn');
  const commandInput = document.getElementById('commandInput');
  const commandList = document.getElementById('commandList');
  const cmdToggleTheme = document.getElementById('cmdToggleTheme');
  const cmdCopyLink = document.getElementById('cmdCopyLink');
  const cmdOpenQr = document.getElementById('cmdOpenQr');

  function openCommandDialog() {
    if (commandDialog) {
      commandDialog.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (commandInput) {
        commandInput.value = '';
        commandInput.focus();
        filterCommandItems('');
      }
    }
  }

  function closeCommandDialog() {
    if (commandDialog) {
      commandDialog.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  function filterCommandItems(query) {
    if (!commandList) return;
    const cleanQuery = query.trim().toLowerCase();
    const items = commandList.querySelectorAll('.command-item');
    const headings = commandList.querySelectorAll('.command-group-heading');

    items.forEach(item => {
      const label = (item.querySelector('.command-item-label')?.textContent || '').toLowerCase();
      const titleAttr = (item.getAttribute('data-command-title') || '').toLowerCase();
      const match = !cleanQuery || label.includes(cleanQuery) || titleAttr.includes(cleanQuery);
      item.style.display = match ? 'flex' : 'none';
    });

    // Hide headings if all following items are hidden
    headings.forEach(heading => {
      let next = heading.nextElementSibling;
      let hasVisibleChild = false;
      while (next && !next.classList.contains('command-group-heading')) {
        if (next.style.display !== 'none') {
          hasVisibleChild = true;
          break;
        }
        next = next.nextElementSibling;
      }
      heading.style.display = hasVisibleChild ? 'block' : 'none';
    });
  }

  if (openCommandBtn) {
    openCommandBtn.addEventListener('click', openCommandDialog);
  }

  if (commandInput) {
    commandInput.addEventListener('input', (e) => {
      filterCommandItems(e.target.value);
    });
  }

  if (commandDialog) {
    commandDialog.addEventListener('click', (e) => {
      if (e.target === commandDialog) {
        closeCommandDialog();
      }
    });
  }

  // Command Actions
  if (cmdToggleTheme) {
    cmdToggleTheme.addEventListener('click', () => {
      closeCommandDialog();
      toggleTheme();
    });
  }

  if (cmdCopyLink) {
    cmdCopyLink.addEventListener('click', () => {
      closeCommandDialog();
      copyToClipboard(window.location.href);
    });
  }

  if (cmdOpenQr) {
    cmdOpenQr.addEventListener('click', () => {
      closeCommandDialog();
      openShareDialog();
    });
  }

  // Detect OS for shortcut indicator (Ctrl+K on Windows, ⌘K on macOS)
  const isMac = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform || navigator.userAgent);
  const kbdLabels = document.querySelectorAll('.kbd-shortcut-label');
  kbdLabels.forEach(el => {
    el.textContent = isMac ? '⌘K' : 'Ctrl K';
  });

  // ----------------------------------------------------------------------------
  // 9. Global Keyboard Shortcuts & Command Palette Navigation
  // ----------------------------------------------------------------------------
  let selectedCommandIndex = 0;

  function updateSelectedCommandItem() {
    if (!commandList) return;
    const visibleItems = Array.from(commandList.querySelectorAll('.command-item')).filter(
      item => item.style.display !== 'none'
    );
    visibleItems.forEach((item, index) => {
      item.classList.toggle('selected', index === selectedCommandIndex);
      if (index === selectedCommandIndex) {
        item.scrollIntoView({ block: 'nearest' });
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    // Open/Close Command palette with Ctrl+K or Cmd+K
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (commandDialog?.classList.contains('open')) {
        closeCommandDialog();
      } else {
        openCommandDialog();
        selectedCommandIndex = 0;
        updateSelectedCommandItem();
      }
      return;
    }

    // Escape closes any open dialog
    if (e.key === 'Escape') {
      if (commandDialog?.classList.contains('open')) {
        closeCommandDialog();
      }
      if (shareDialog?.classList.contains('open')) {
        closeShareDialog();
      }
      return;
    }

    // Arrow navigation inside command palette
    if (commandDialog?.classList.contains('open')) {
      const visibleItems = Array.from(commandList.querySelectorAll('.command-item')).filter(
        item => item.style.display !== 'none'
      );
      if (visibleItems.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedCommandIndex = (selectedCommandIndex + 1) % visibleItems.length;
        updateSelectedCommandItem();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedCommandIndex = (selectedCommandIndex - 1 + visibleItems.length) % visibleItems.length;
        updateSelectedCommandItem();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const activeItem = visibleItems[selectedCommandIndex];
        if (activeItem) {
          activeItem.click();
        }
      }
    }
  });

  // Console Welcome Badge (shadcn/ui style)
  console.log(
    '%c shadcn/ui %c Mirzaliyev Jahongirmirzo Link Hub %c v2.0 ',
    'background: #18181b; color: #fafafa; font-weight: bold; padding: 3px 6px; border-radius: 4px 0 0 4px;',
    'background: #27272a; color: #fafafa; padding: 3px 8px;',
    'background: #10b981; color: #000; font-weight: bold; padding: 3px 6px; border-radius: 0 4px 4px 0;'
  );
});
