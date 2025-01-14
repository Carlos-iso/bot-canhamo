const axios = require('axios');
const { Client, Message } = require('whatsapp-web.js');

// Configurações
const token = 'SEU_TOKEN_AQUI';
const idGrupo = 'ID_GRUPO_AQUI';
const cliente = new Client('SEU_NOME_SESSAO_AQUI');
const bancoDados = 'SEU_BANCO_DADOS_AQUI';

// Função para verificar contatos no grupo
async function verificarContatos() {
  try {
    // Obter números de telefone do banco de dados
    const numerosTelefone = await obterNumerosTelefone(bancoDados);

    // Verificar se cada número está no grupo
    for (const numero of numerosTelefone) {
      const contato = await cliente.getContactById(numero);
      if (contato && contato.groups.includes(idGrupo)) {
        // Remover contato do grupo
        await removerContatoDoGrupo(contato);
      }
    }
  } catch (erro) {
    console.error(`Erro ao verificar contatos: ${erro.message}`);
  }
}

// Função para obter números de telefone do banco de dados
async function obterNumerosTelefone(bancoDados) {
  // Implemente sua lógica de banco de dados aqui
  // Exemplo:
  const resposta = await axios.get(`http://${bancoDados}/numeros-telefone`);
  return resposta.data;
}

// Função para remover contato do grupo
async function removerContatoDoGrupo(contato) {
  try {
    await cliente.removeParticipant(idGrupo, (link));
    console.log(`Contato ${contato.name} removido do grupo!`);
  } catch (erro) {
    console.error(`Erro ao remover contato: ${erro.message}`);
  }
}




    if (message.body === "/banir") {
      let participantNumbers = []
      try {
        // const listNumbers = await actions.getNumbersPhone();
        const chats = await client.listChats();
        for (let group of chats) {
          if (group.isGroup) {
            const participants = await client.getGroupMembers(group.id);
            if (Array.isArray(participants)) {
              participantNumbers = await participants.map((participant) => {
                // Obtém o número removendo '@c.us'
                return participant.id ? participant.id.split("@")[0] : undefined;
              });
            }
            await client.sendText(
              message.from,
              `Grupo: ${
                group.name
              }\nParticipantes:\n${participantNumbers.join("\n")}`
            );
            console.log(`Participantes: ${JSON.stringify(participantNumbers, null, 2)}`);
          }
        }

        // for (const group of groups) {
        //   if (group.isGroup) {
        //     await client.sendText(message.from, `Grupos:\n ${group.name}`);
        //     // for (const numero of numerosBanidos) {
        //     //     await client.removeParticipant((link), numero.phoneNumber);
        //     //   console.log(`Número ${numero.phoneNumber} banido do grupo ${grupo.name}`);
        //     //   }
        //   }
        // }
        // await client.sendText(message.from, "Números banidos com sucesso!");
      } catch (error) {
        console.error(error);
        await client.sendText(message.from, "Erro ao banir números.");
      }
    }
