async function buildMessage({ comment, phone, whatsApp, viber, telegram }) {
	let message = `<b>Комментарий:</b> ${comment}\n\n`;
	message += `<b>Телефон:</b> ${phone}\n\n`;
	message += `Как можно связаться:\n`;

	message += (telegram ? `✅` : `❌`) + 'Telegram';
  	message += (viber ? `✅` : `❌`) + 'Viber';
  	message += (whatsApp ? `✅` : `❌`) + 'WhatsApp';

  	return message;
}

module.exports = {
  buildMessage
};
