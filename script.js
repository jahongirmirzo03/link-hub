/**
 * SHAXSIY LINKLAR MARKAZI (LINK HUB)
 * JavaScript Logikasi va Interaktivlik
 * Muallif: Mirzaliyev Jahongirmirzo
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Joriy yilni footerda avtomatik yangilash
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // 2. Ulashish (Share / Copy Link) funksionalligi
  const shareBtn = document.getElementById('shareBtn');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  let toastTimeout = null;

  /**
   * Toast xabarnomasini ekranda ko'rsatish
   * @param {string} message - Ko'rsatiladigan matn
   * @param {number} duration - Ko'rinish davomiyligi (ms)
   */
  function showToast(message = "Havola nusxalandi!", duration = 3000) {
    if (!toast) return;

    if (toastMessage) {
      toastMessage.textContent = message;
    }

    toast.classList.add('show');

    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }

    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }

  /**
   * Sahifa havolasini nusxalash yoki ulashish
   */
  async function handleShare() {
    const shareData = {
      title: "Mirzaliyev Jahongirmirzo | Link Hub",
      text: "Mirzaliyev Jahongirmirzo — Informatika fani o'qituvchisi va Teach for Uzbekistan Fellow shaxsiy sahifasi",
      url: window.location.href
    };

    // Agar brauzer Web Share API ni qo'llab-quvvatlasa (masalan, smartfonlarda)
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        showToast("Muvaffaqiyatli ulashildi! ✨");
        return;
      } catch (err) {
        // Foydalanuvchi ulashishni bekor qilganda xato chiqarmaslik
        if (err.name !== 'AbortError') {
          copyToClipboard(window.location.href);
        }
      }
    } else {
      // Kompyuter yoki qo'llab-quvvatlamaydigan brauzerlar uchun havolani nusxalash
      copyToClipboard(window.location.href);
    }
  }

  /**
   * Matnni vaqtinchalik xotiraga (Clipboard) nusxalash
   * @param {string} text 
   */
  async function copyToClipboard(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Eski brauzerlar yoki no-HTTPS muhitlar uchun fallback
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      showToast("Havola vaqtinchalik xotiraga nusxalandi! 📋");
    } catch (err) {
      showToast("Havolani nusxalashda xatolik yuz berdi ⚠️");
      console.error("Nusxalash xatosi:", err);
    }
  }

  if (shareBtn) {
    shareBtn.addEventListener('click', handleShare);
  }

  // 3. Link tugmalariga yumshoq bosilish effekti (Active click animation)
  const allCards = document.querySelectorAll('.link-card, .action-btn, .social-link');
  allCards.forEach(element => {
    element.addEventListener('touchstart', () => {
      element.style.transform = 'scale(0.97)';
    }, { passive: true });

    element.addEventListener('touchend', () => {
      element.style.transform = '';
    }, { passive: true });
  });

  // Konsolda chiroyli mualliflik yozuvi
  console.log(
    `%c🚀 Mirzaliyev Jahongirmirzo | Link Hub %c\nInformatika fani o'qituvchisi & Teach for Uzbekistan Fellow`,
    'background: #6366f1; color: #fff; font-size: 14px; font-weight: bold; padding: 4px 10px; border-radius: 4px;',
    'color: #94a3b8; font-size: 12px; margin-top: 4px;'
  );
});
