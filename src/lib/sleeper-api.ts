import OpenAI from 'openai';

const LEAGUE_ID = '1124820424132165632';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function getDraftResults() {
  const response = await fetch(`https://api.sleeper.app/v1/league/${LEAGUE_ID}`);
  const leagueData = await response.json();
  const draftId = leagueData.draft_id;

  const draftResponse = await fetch(`https://api.sleeper.app/v1/draft/${draftId}/picks`);
  const draftPicks = await draftResponse.json();

  const teamDrafts = groupPicksByTeam(draftPicks);
  const evaluatedDrafts = await evaluateDrafts(teamDrafts);

  return evaluatedDrafts;
}

function groupPicksByTeam(draftPicks: any) {
  const teamDrafts: Record<string, any[]> = {};
  draftPicks.forEach((pick: any) => {
    if (!teamDrafts[pick.picked_by]) {
      teamDrafts[pick.picked_by] = [];
    }
    teamDrafts[pick.picked_by].push(pick);
  });
  return teamDrafts;
}

async function evaluateDrafts(teamDrafts: Record<string, any[]>) {
  const evaluatedDrafts = [];
  for (const [teamId, picks] of Object.entries(teamDrafts)) {
    const draftSummary = picks.map(pick => `Round ${pick.round}: ${pick.metadata.first_name} ${pick.metadata.last_name} (${pick.metadata.position} - ${pick.metadata.team})`).join('\n');
    
    const prompt = `Evaluate the following fantasy football draft for a team:

${draftSummary}

Provide a brief analysis including:
1. Overall grade (A, B, C, D, or F)
2. Two key strengths
3. Two key weaknesses
4. A short comment (max 50 words) on the draft strategy`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const analysis = completion.choices[0].message.content;
    if (analysis) {
      const [grade, ...rest] = analysis.split('\n');
      const strengths = rest.find((line: string) => line.startsWith('Strengths:'))?.split(':')[1]?.split(',').map((s: string) => s.trim()) ?? [];
      const weaknesses = rest.find((line: string) => line.startsWith('Weaknesses:'))?.split(':')[1]?.split(',').map((s: string) => s.trim()) ?? [];
      const comment = rest.find((line: string) => line.startsWith('Comment:'))?.split(':')[1]?.trim() ?? '';

      evaluatedDrafts.push({
        name: `Team ${teamId}`, // You might want to fetch actual team names if available
        grade: grade.split(':')[1].trim(),
        strengths,
        weaknesses,
        comment,
      });
    } else {
      console.error('No analysis received from OpenAI');
      // You might want to return a default or error state here
    }
  }
  return evaluatedDrafts;
}

export async function getBeltHolder() {
  const response = await fetch(`https://api.sleeper.app/v1/league/${LEAGUE_ID}/matchups/1`)
  const matchups = await response.json()

  // Implement logic to determine the current belt holder
  // This is a simplified example
  return {
    name: 'Team Awesome',
    weekAcquired: 1
  }
}

export async function getPowerRankings() {
  const response = await fetch(`https://api.sleeper.app/v1/league/${LEAGUE_ID}/rosters`)
  const rosters = await response.json()

  // Implement logic to calculate power rankings
  // This is a simplified example
  return rosters.map((roster: any) => ({
    name: roster.owner_id,
    score: Math.random() * 100,
    comment: 'Looking strong this week!'
  })).sort((a: any, b: any) => b.score - a.score)
}

export async function getWeeklyAwards() {
  const response = await fetch(`https://api.sleeper.app/v1/league/${LEAGUE_ID}/matchups/1`)
  const matchups = await response.json()

  // Implement logic to determine weekly awards
  // This is a simplified example
  return {
    'Most Points Scored': 'Team Awesome',
    'Least Points Scored': 'Team Underdog',
    'Closest Match': 'Team Lucky vs Team Unlucky'
  }
}