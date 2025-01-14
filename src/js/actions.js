const axios = require("axios");
const fs = require("fs").promises;

exports.getNumbersPhone = async () => {
  try {
    const response = await axios.get(`https://back-4d99.onrender.com/ban/list`);
    return response.data;
  } catch (error) {
    console.error("Erro ao obter números banidos:", error);
    return ["Erro: Array vazio"];
  }
};

// async function getNumbersPhone() {
//   try {
//     const response = await axios.get(`https://back-4d99.onrender.com/ban/list`);
//     return response.data;
//   } catch (error) {
//     console.error("Erro ao obter números banidos:", error);
//     return ["Erro: Array vazio"];
//   }
// }

exports.getNunbersBanList = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, "utf-8"); // Lê o arquivo .txt
    const jsonContent = JSON.parse(data); // Converte o JSON em um objeto ou array
    console.log("Valores carregados do JSON:", jsonContent); // Exibe os valores carregados
    return jsonContent; // Retorna os valores
  } catch (error) {
    console.error(`Erro ao ler o JSON: ${error.message}`);
    return ["Erro: Array vazio"]; // Retorna um array vazio em caso de erro
  }
};

// async function getNunbersBanList(filePath) {
//   try {
//     const data = await fs.readFile(filePath, "utf-8"); // Lê o arquivo .txt
//     const jsonContent = JSON.parse(data); // Converte o JSON em um objeto ou array
//     console.log("Valores carregados do JSON:", jsonContent); // Exibe os valores carregados
//     return jsonContent; // Retorna os valores
//   } catch (error) {
//     console.error(`Erro ao ler o JSON: ${error.message}`);
//     return ["Erro: Array vazio"]; // Retorna um array vazio em caso de erro
//   }
// }

// export default {
//   getNumbersPhone,
//   getNunbersBanList,
// };
