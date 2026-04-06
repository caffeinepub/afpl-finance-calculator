export function shareViaWhatsApp(message: string): void {
  const encodedMessage = encodeURIComponent(message);

  // Try Web Share API first (better for mobile)
  if (navigator.share) {
    navigator
      .share({
        text: message,
      })
      .catch((error) => {
        // If Web Share fails, fall back to WhatsApp URL
        console.log("Web Share failed, using WhatsApp URL:", error);
        openWhatsAppUrl(encodedMessage);
      });
  } else {
    // Fall back to WhatsApp URL
    openWhatsAppUrl(encodedMessage);
  }
}

function openWhatsAppUrl(encodedMessage: string): void {
  const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
  window.open(whatsappUrl, "_blank");
}
