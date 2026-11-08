const form = document.querySelector('#storyForm');
const emptyState = document.querySelector('#emptyState');
const loading = document.querySelector('#loading');
const story = document.querySelector('#story');
let latestStory = null;

const samples = [
  'A chuva desenhava caminhos prateados sobre as janelas quando {hero} encontrou o mapa. Não era papel: as linhas respiravam, como se soubessem que haviam esperado por aquela mão. Do outro lado da sala, uma voz conhecida quebrou o silêncio. A missão começaria antes do amanhecer, mas a primeira escolha precisava ser feita agora.',
  'A cidade parecia adormecida, embora cada luz escondesse um segredo. {hero} avançou pela praça e sentiu o ar mudar. O plano era simples até que o impossível surgiu diante do grupo: uma porta onde antes existia apenas pedra. Ao atravessá-la, todos entenderam que voltar não seria tão fácil quanto entrar.',
  'O último sinal veio das montanhas, curto e urgente. {hero} guardou o medo entre uma respiração e outra e seguiu em frente. Havia promessas demais naquela jornada para desistir. Quando o horizonte brilhou, a verdadeira dimensão do conflito finalmente se revelou.'
];

function wait(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

form.addEventListener('submit', async event => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  emptyState.classList.add('hidden');
  story.classList.add('hidden');
  loading.classList.remove('hidden');
  await wait(850);
  const hero = data.characters.trim() || 'a protagonista';
  const total = Math.min(Number(data.chapters) || 1, 3);
  latestStory = {
    title: `Ecos de ${data.fandom}`,
    synopsis: `${data.premise.trim()} Uma demonstração em tom ${data.tone.toLowerCase()}, no gênero ${data.genre.toLowerCase()}.`,
    chapters: Array.from({ length: total }, (_, index) => ({
      number: index + 1,
      title: ['O chamado', 'Além do limiar', 'A escolha'][index],
      content: samples[index].replaceAll('{hero}', hero)
    }))
  };
  renderStory();
  loading.classList.add('hidden');
});

function renderStory() {
  document.querySelector('#storyTitle').textContent = latestStory.title;
  document.querySelector('#storySynopsis').textContent = latestStory.synopsis;
  const chapters = document.querySelector('#chapters');
  chapters.replaceChildren();
  latestStory.chapters.forEach(chapter => {
    const section = document.createElement('section');
    section.className = 'chapter';
    const title = document.createElement('h3');
    title.textContent = `${String(chapter.number).padStart(2, '0')} · ${chapter.title}`;
    const content = document.createElement('p');
    content.textContent = chapter.content;
    section.append(title, content);
    chapters.append(section);
  });
  story.classList.remove('hidden');
}

document.querySelector('#continueButton').addEventListener('click', async event => {
  if (!latestStory || latestStory.chapters.length >= 3) {
    alert('A demonstração está limitada a três capítulos.');
    return;
  }
  const button = event.currentTarget;
  button.disabled = true;
  button.textContent = 'Simulando…';
  await wait(650);
  const index = latestStory.chapters.length;
  latestStory.chapters.push({ number: index + 1, title: ['O chamado', 'Além do limiar', 'A escolha'][index], content: samples[index].replaceAll('{hero}', 'a protagonista') });
  renderStory();
  button.disabled = false;
  button.textContent = 'Continuar +1 capítulo';
});

document.querySelector('#downloadButton').addEventListener('click', () => {
  if (!latestStory) return;
  const text = [latestStory.title, latestStory.synopsis, ...latestStory.chapters.flatMap(c => [`\nCAPÍTULO ${c.number} — ${c.title}\n`, c.content]), '\nGerado na demonstração estática do Fiction.'].join('\n');
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'fiction-demonstracao.txt';
  link.click();
  URL.revokeObjectURL(link.href);
});

const labCases = ['Fantasia épica', 'Romance contemporâneo', 'Mistério', 'Aventura espacial', 'Drama'];
document.querySelector('#labStartButton').addEventListener('click', async event => {
  const button = event.currentTarget;
  const progress = document.querySelector('#labProgress');
  const bar = document.querySelector('#labProgressBar');
  const title = document.querySelector('#labProgressTitle');
  const text = document.querySelector('#labProgressText');
  button.disabled = true;
  document.querySelector('#labEmpty').classList.add('hidden');
  document.querySelector('#labReport').classList.add('hidden');
  progress.classList.remove('hidden');
  for (let i = 0; i < 5; i += 1) {
    title.textContent = `Simulando caso ${i + 1} de 5…`;
    await wait(350);
    bar.style.width = `${(i + 1) * 20}%`;
    text.textContent = `${i + 1} de 5 casos concluídos`;
  }
  title.textContent = 'Simulação concluída';
  const results = document.querySelector('#labResults');
  results.replaceChildren(...labCases.map((name, index) => createLabResult(name, index)));
  document.querySelector('#labReport').classList.remove('hidden');
  button.disabled = false;
  button.textContent = 'Executar novamente';
});

function createLabResult(name, index) {
  const details = document.createElement('details');
  details.className = 'lab-result';
  const summary = document.createElement('summary');
  const title = document.createElement('span');
  title.className = 'lab-result-title';
  title.textContent = `${String(index + 1).padStart(2, '0')} · ${name}`;
  const metrics = document.createElement('span');
  metrics.className = 'lab-result-metrics';
  ['Concluído', `${15 + index * 2}s`, `${398 + index * 2}/400 palavras`, index === 3 ? '1 repetição' : '0 repetições'].forEach((value, pillIndex) => {
    const pill = document.createElement('span');
    pill.className = `lab-pill ${pillIndex === 0 ? 'success' : ''}`;
    pill.textContent = value;
    metrics.append(pill);
  });
  summary.append(title, metrics);
  const body = document.createElement('div');
  body.className = 'lab-result-body';
  body.innerHTML = '<h4>Resultado demonstrativo</h4><p>Este é um dado fictício usado apenas para apresentar a interface do Fiction Lab.</p>';
  details.append(summary, body);
  return details;
}
