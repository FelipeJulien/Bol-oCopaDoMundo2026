export default async function handler(req, res) {
  try {
    const response = await fetch('https://worldcup26.ir/get/games');
    
    if (!response.ok) {
      return res.status(response.status).json({ error: 'API upstream retornou ' + response.status });
    }
    
    const data = await response.json();
    
    // Cache por 60 segundos para não sobrecarregar a API
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('Erro ao buscar API WorldCup26:', error);
    return res.status(500).json({ error: 'Falha ao buscar dados da API' });
  }
}
