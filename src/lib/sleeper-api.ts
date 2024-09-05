import OpenAI from 'openai';

const LEAGUE_ID = '1124820424132165632';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function getDraftResults() {
  const response = await fetch(`https://api.sleeper.app/v1/league/${LEAGUE_ID}`);
  const leagueData = await response.json();
  const draftId = leagueData.draft_id;

  const draftResponse = await fetch(`https://api.sleeper.app/v1/draft/${draftId}/picks`);
  const draftPicks = await draftResponse.json();
  console.log(draftPicks);

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

Provide a brief analysis in the following JSON format:
{
  "grade": "A, B, C, D, or F",
  "strengths": ["Strength 1", "Strength 2"],
  "weaknesses": ["Weakness 1", "Weakness 2"],
  "comment": "A short comment (max 50 words) on the draft strategy"
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
    });

    const analysis = completion.choices[0].message.content;
    if (analysis) {
      try {
        const response = JSON.parse(analysis);
        const { grade, strengths, weaknesses, comment } = response;
        evaluatedDrafts.push({
          name: `Team ${teamId}`, // You might want to fetch actual team names if available
          grade,
          strengths,
          weaknesses,
          comment,
        });
      } catch (error) {
        console.error('Error parsing OpenAI response:', error);
      }
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