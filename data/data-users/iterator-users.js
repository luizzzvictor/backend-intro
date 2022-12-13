import dataTribunais from "./dataTribunais.json" assert { type: "json" };
import dataPalavrasChave from "../palavras_chave.json" assert { type: "json" }
import dataCasos from "../casos.json" assert { type: "json" }
import * as fs from "fs"

const tribunais = dataTribunais.filter((tribunal) => {
  if (
    tribunal.SEQ_TIPO_ORGAO === 11300 ||
    tribunal.SEQ_TIPO_ORGAO === 11200 ||
    tribunal.SEQ_TIPO_ORGAO === 11450 ||
    tribunal.SEQ_TIPO_ORGAO === 10900 ||
    tribunal.SEQ_TIPO_ORGAO === 11000 ||
    tribunal.SEQ_TIPO_ORGAO === 11250 
  ) {
    return tribunal.NOM_ORGAO;
  }
});

const nomeDosTribunais = tribunais.map((i) => {
  const object = {}

  object.SEQ_ORGAO = i.SEQ_ORGAO;
  object.NOM_ORGAO = i.NOM_ORGAO;
  object.SEQ_MUNICIPIO = i.SEQ_MUNICIPIO

  return object
} )

const municipios = dataTribunais.filter((municipio) => {
  if (municipio.SEQ_TIPO_ORGAO === 12450 && municipio.FLG_ATIVO==="true") {
    return municipio
  }
})

const municipiosFiltrados = municipios.map((municipio) => {
  const object = { }

  object.SEQ_ORGAO = municipio.SEQ_ORGAO;
  object.NOM_ORGAO = municipio.NOM_ORGAO;
  object.SEQ_MUNICIPIO = municipio.SEQ_MUNICIPIO;
  object.UF = municipio.SEQ_ORGAO_PAI;

  return object

})

// console.log(municipios)

  // fs.writeFile(`./data/dataTribunais-filtrado.json`, JSON.stringify(nomeDosTribunais), (err) =>
  //   err ? console.log(err) : null
  // );

  // fs.writeFile(`./data/dataMunicipios2.json`, JSON.stringify(municipiosFiltrados), (err) =>
  //   err ? console.log(err) : null
  // );

// console.log(nomeDosTribunais);

let count = 0
const novasPalavrasChave = dataPalavrasChave.map( (palavra) => {
  const object = { }
  count++

  object.palavra_chave = palavra.palavra_chave;
  object.codigo = count

  return object
})

// console.log(dataPalavrasChave)

  // fs.writeFile(`./data/palavras_chave.json`, JSON.stringify(novasPalavrasChave), (err) =>
  //   err ? console.log(err) : null
  // );

  const casosPalavras = dataCasos.map((i) => {
    const object = {}

    object.caso = i.caso
    object.palavras_chave = i.palavras_chave
    
    return object
  })

    fs.writeFile(`./data/filtroCasosPalavrasChave.json`, JSON.stringify(casosPalavras), (err) =>
    err ? console.log(err) : null
  );
