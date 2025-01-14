const botConfig = {
  verifyMessage: async (message) => {
    if (!message.body || typeof message.body !== "string") {
      return; // Ignora mensagens sem texto ou com formato inesperado
    }
  },
  isGroupMessage: async (client, message) => {
    // console.log(client, message);
    const chat = await client.getChatById(message.from);
    if (!chat.isGroup) {
      return; // Ignora mensagens que não são de grupos
    }
  },
  adminVerify: async (client, message, ownerNumber) => {
    const chat = await client.getChatById(message.from);
    // Obtem os administradores do grupo
    const groupAdmins = (await client.getGroupAdmins(chat.id)).map(
      (admin) => admin.user
    );
    // Verifica se o remetente é administrador
    const senderId = await message.sender.id.split("@")[0];
    const isAdmin = await groupAdmins.includes(
      senderId || senderId === ownerNumber
    );
    // Ignora comandos quando não é administrador
    if (message.body.startsWith("/") && !isAdmin) {
      // Responde para não-administradores
      await client.sendText(
        message.from,
        "Você não tem permissão para usar este comando."
      );
      return;
    }
  },
};

export default botConfig;
