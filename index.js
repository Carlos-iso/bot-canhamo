const fs = require("fs");
const wppconnect = require("@wppconnect-team/wppconnect");
const actions = require("./src/js/actions.js");
const banList = "./banList.json";
const ownerNumber = "556596636751";
const textsMsg = require("./src/js/texts.js");
// const ttt = require("./src/js/botConfig.js");
const replies = require("./src/js/replies.js");

wppconnect
  .create({
    session: "sessionName",
    emitOwnMessages: true,
    catchQR: (base64Qr, asciiQR) => {
      console.log(asciiQR);
      var matches = base64Qr.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return new Error("Invalid input string");
      }

      const response = {
        type: matches[1],
        data: Buffer.from(matches[2], "base64"),
      };

      fs.writeFile("out.png", response.data, "binary", (err) => {
        if (err) console.log(err);
      });
    },
    logQR: false,
  })
  .then((client) => start(client))
  .catch((error) => console.log(error));

function start(client) {
  client.onAnyMessage(async (message) => {
    // Ignora mensagens sem texto ou com formato inesperado
    if (!message.body || typeof message.body !== "string") {
      return; // Ignora mensagens sem texto ou com formato inesperado
    }

    // Verifica se a mensagem veio de um grupo
    const chat = await client.getChatById(message.from);
    if (!chat.isGroup) {
      return; // Ignora mensagens que não são de grupos
    }
    // Bloqueia comando para não ADMs
    // const chat = await client.getChatById(message.from);
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

    if (message.body === "/banir") {
      try {
        const chats = await client.listChats();
        //Busca integrantes dos grupos
        for (let group of chats) {
          if (group.isGroup) {
            let participantNumbers = [];
            const participants = await client.getGroupMembers(group.id);
            console.log("Participantes do grupo:", participants); // Para verificar o formato dos dados
            if (Array.isArray(participants)) {
              participantNumbers = participants.map((participant) => {
                // Verifica se id é um objeto ou string
                if (participant.id && typeof participant.id.user === "string") {
                  return participant.id.user; // Extrai diretamente o número
                } else if (typeof participant.id === "string") {
                  return participant.id.split("@")[0]; // Fallback para string
                } else {
                  return "Desconhecido"; // Caso o formato não seja esperado
                }
              });
            }
            //Busca numeros da lista
            const list = await actions.getNunbersBanList(banList);
            const bannedNumbers = new Set(list.bannedNumbers);
            const toBeRemoved = participantNumbers.filter((number) =>
              bannedNumbers.has(number)
            );
            //Remove participantes da lista
            for (let number of toBeRemoved) {
              try {
                await client.removeParticipant(group.id, `${number}@c.us`);
                await client.sendText(
                  group.id,
                  `O número ${number} foi removido do grupo por quebrar regras.`
                );
              } catch (error) {
                client.sendText(
                  group.id,
                  `Erro ao remover o participante ${number} do grupo ${
                    group.name || group.subject
                  }:`
                );
                console.error(
                  `Erro ao remover o participante ${number} do grupo ${
                    group.name || group.subject
                  }:`,
                  error
                );
              }
            }
            //Mensagem Retorno
            // await client.sendText(
            //   message.from,
            //   `Grupo: ${
            //     group.name || group.subject
            //   }\nParticipantes:\n${participantNumbers.join("\n")}
            //   Lista Banidos: ${banList.bannedNumbers}`
            // );
            console.log(`Grupo: ${group.name || group.subject}`);
            console.log("Participantes:", participantNumbers);
          }
        }
      } catch (error) {
        console.error("Erro ao listar grupos e participantes:", error);
        // await client.sendText(
        //   group.id,
        //   "Erro ao listar grupos e participantes."
        // );
      }
    }
    if (message.body === "/list") {
      try {
        const numbersBan = await actions.getNumbersPhone();
        const listNumbers = numbersBan
          .map((numero) => `- ${numero.phoneNumber}`)
          .join("\n");
        await client.sendText(message.from, `Números banidos:\n${listNumbers}`);
      } catch (error) {
        await client.sendText(
          message.from,
          "Erro ao obter lista de números banidos."
        );
      }
    }
    // Comando personalizado
    replies.messageInit(message, client, "Coeeeeeeeé🐊", textsMsg.rulesMsg)
    // messageInit(message, client, "Coeeeeeeeé🐊", textsMsg.rulesMsg);
  });
}
