export default async function handler(req, res) {
  try {
    const response = await fetch('https://api.football-data.org/v4/competitions/2000/matches', {
      headers: {
        'X-Auth-Token': '84ddf4ccf92e4297a24b3b138f69aa45'
      }
    });
    
    if (!response.ok) {
      return res.status(response.status).json({ error: 'API upstream retornou ' + response.status });
    }
    
    const data = await response.json();
    
    // Converte formato Football-Data para formato compatível com nosso app (antigo worldcup26.ir)
    const games = data.matches.map(match => {
      let homeName = match.homeTeam.name;
      let awayName = match.awayTeam.name;

      // Compatibiliza nomes de times
      if (homeName === 'Bosnia-Herzegovina') homeName = 'Bosnia and Herzegovina';
      if (awayName === 'Bosnia-Herzegovina') awayName = 'Bosnia and Herzegovina';
      if (homeName === 'Congo DR') homeName = 'Democratic Republic of the Congo';
      if (awayName === 'Congo DR') awayName = 'Democratic Republic of the Congo';
      // (USA "United States" e outros já coincidem)

      return {
        type: match.stage === 'GROUP_STAGE' ? 'group' : 'knockout',
        finished: match.status === 'FINISHED' ? 'TRUE' : 'FALSE',
        time_elapsed: (match.status === 'IN_PLAY' || match.status === 'PAUSED') ? 'live' : 'notstarted',
        home_team_name_en: homeName,
        away_team_name_en: awayName,
        home_score: match.score.fullTime.home !== null ? match.score.fullTime.home.toString() : '0',
        away_score: match.score.fullTime.away !== null ? match.score.fullTime.away.toString() : '0'
      };
    });

    // Cache por 30 segundos (mantém chamadas seguras dentro do limite de 10/min)
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=10');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    return res.status(200).json({ games });
  } catch (error) {
    console.error('Erro ao buscar API Football-Data:', error);
    return res.status(500).json({ error: 'Falha ao buscar dados da API' });
  }
}
