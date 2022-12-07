import dataTribunais from "./dataTribunais.json" assert { type: "json" };

const tribunais = dataTribunais.filter((tribunal) => {
  if (
    tribunal.SEQ_TIPO_ORGAO === 11300 ||
    tribunal.SEQ_TIPO_ORGAO === 11200 ||
    tribunal.SEQ_TIPO_ORGAO === 11450
  ) {
    return tribunal.NOM_ORGAO;
  }
});

const nomeDosTribunais = tribunais.map((i) => i.NOM_ORGAO )

console.log(nomeDosTribunais);
