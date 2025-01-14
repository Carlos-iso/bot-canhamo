exports.messageInit = async (message, client, msgBody, callbackMsg) => {
  if (message.body === msgBody) {
    await client.sendText(
      message.from,
      "Atenção: Conteúdo restrito a maiores de 18 anos. Para prosseguir, confirme sua idade digitando: *[Sim], [Não]*"
    );
  } else if (message.body === "Sim") {
    await client.sendText(message.from, callbackMsg);
  }
}
// async function messageInit(message, client, msgBody, callbackMsg) {
//   if (message.body === msgBody) {
//     await client.sendText(
//       message.from,
//       "Atenção: Conteúdo restrito a maiores de 18 anos. Para prosseguir, confirme sua idade digitando: *[Sim], [Não]*"
//     );
//   } else if (message.body === "Sim") {
//     await client.sendText(message.from, callbackMsg);
//   }
// }

// export default messageInit;
