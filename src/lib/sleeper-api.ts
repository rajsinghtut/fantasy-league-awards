import OpenAI from 'openai';
import { PrismaClient } from '@prisma/client';
// Removed unused imports: LeagueSettings, RosterSettings, User

const LEAGUE_ID = '1124820424132165632';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const prisma = new PrismaClient();

async function getTeamInfo() {
  const existingTeams = await prisma.team.findMany();
  
  if (existingTeams.length > 0) {
    console.log('Using existing team info from database');
    return existingTeams;
  }

  console.log('Fetching new team info');
  const usersResponse = await fetch(`https://api.sleeper.app/v1/league/${LEAGUE_ID}/users`);
  const users = await usersResponse.json();

  const rostersResponse = await fetch(`https://api.sleeper.app/v1/league/${LEAGUE_ID}/rosters`);
  const rosters = await rostersResponse.json();

  const teams = users
    .filter((user: any) => user.user_id !== '466784050778992640')
    .map((user: any) => {
      const roster = rosters.find((r: any) => r.owner_id === user.user_id);
      return {
        id: user.user_id,
        name: user.display_name,
        avatar: user.avatar,
        roster_id: roster ? roster.roster_id.toString() : null,
      };
    });

  await prisma.team.createMany({
    data: teams,
  });

  return teams;
}

export async function getDraftResults() {
  // Check if we already have draft results in the database
  const existingPicks = await prisma.draftPick.findMany();
  const teams = await getTeamInfo();
  
  if (existingPicks.length > 0) {
    console.log('Using existing draft results from database');
    const teamDrafts = groupPicksByTeam(existingPicks);
    const evaluations = await getEvaluations(teamDrafts, teams);
    return evaluations.map((evaluation: any) => {
      const team = teams.find((t: any) => t.id === evaluation.teamId);
      return {
        ...evaluation,
        avatar: team?.avatar || null // Ensure avatar is null if not found
      };
    });
  }

  console.log('Fetching new draft results');
  const response = await fetch(`https://api.sleeper.app/v1/league/${LEAGUE_ID}`);
  const leagueData = await response.json();
  const draftId = leagueData.draft_id;

  const draftResponse = await fetch(`https://api.sleeper.app/v1/draft/${draftId}/picks`);
  const draftPicks = await draftResponse.json();

  // Save draft picks to database
  await prisma.draftPick.createMany({
    data: draftPicks.map((pick: any) => ({
      pickNumber: pick.pick_no,
      playerId: pick.player_id,
      playerName: `${pick.metadata.first_name} ${pick.metadata.last_name}`,
      position: pick.metadata.position,
      team: pick.metadata.team,
      draftedBy: pick.picked_by,
      round: pick.round,
    })),
  });

  const teamDrafts = groupPicksByTeam(draftPicks);
  const evaluations = await evaluateDrafts(teamDrafts, teams);
  return evaluations.map((evaluation: any) => {
    const team = teams.find((t: any) => t.id === evaluation.teamId);
    return {
      ...evaluation,
      avatar: team?.avatar || null // Ensure avatar is null if not found
    };
  });
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

async function evaluateDrafts(teamDrafts: Record<string, any[]>, teams: any[]) {
  const existingEvaluations = await prisma.draftEvaluation.findMany();
  
  if (existingEvaluations.length > 0) {
    console.log('Using existing evaluations from database');
    return existingEvaluations;
  }

  console.log('Generating new evaluations');
  const evaluatedDrafts = [];
  for (const [teamId, picks] of Object.entries(teamDrafts)) {
    const team = teams.find(t => t.id === teamId);
    const teamName = team ? team.name : `Team ${teamId}`;
    const draftSummary = picks.map(pick => `Round ${pick.round}: ${pick.metadata.first_name} ${pick.metadata.last_name} (${pick.metadata.position} - ${pick.metadata.team})`).join('\n')
    const prompt = `Evaluate the following fantasy football draft for ${teamName}:

${draftSummary}

The draft occurred in the 2024 season and you may have outdated information. Assume the data in this request is the most current. Provide a brief analysis in the following JSON format. It must always be in this format. Do not include a key at the beginning of the JSON:
{
  "grade": "A, B, C, D, or F",
  "strengths": ["Give an elaborate explanation of strength 1", "Give an elaborate explanation of strength 2"],
  "weaknesses": ["Give an elaborate explanation of weakness 1", "Give an elaborate explanation of weakness 2"],
  "comment": "A short comment (max 100 words) on the draft strategy."
}`;

    console.log("Here is the prompt: ", prompt);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
    });

    const analysis = completion.choices[0].message.content;
    console.log("here is the output from openai: ", analysis);
    if (analysis) {
      try {
        const response = JSON.parse(analysis);
        const { grade, strengths, weaknesses, comment } = response;
        const evaluation = await prisma.draftEvaluation.create({
          data: {
            teamId,
            teamName,
            grade,
            strengths: strengths.join(', '),
            weaknesses: weaknesses.join(', '),
            comment,
          },
        });
        evaluatedDrafts.push(evaluation);
      } catch (error) {
        console.error('Error parsing OpenAI response:', error);
      }
    } else {
      console.error('No analysis received from OpenAI');
    }
  }
  return evaluatedDrafts;
}

async function getEvaluations(teamDrafts: Record<string, any[]>, teams: any[]) {
  const evaluations = await prisma.draftEvaluation.findMany();
  return evaluations.map((evaluation: any) => ({
    ...evaluation,
    strengths: evaluation.strengths.split(', '),
    weaknesses: evaluation.weaknesses.split(', '),
  }));
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

// Add new function to fetch power rankings data
export async function fetchPowerRankingsData(leagueId: string): Promise<any> {
  try {
    const users = await fetchUsers(leagueId);
    const rosters = await fetchRosters(leagueId);
    const leagueInfo = await fetchLeagueInfo(leagueId);

    // Combine user and roster data
    const powerRankingsData = rosters.map(roster => {
      const user = users.find(u => u.user_id === roster.owner_id);
      return {
        userId: user?.user_id || '',
        username: user?.display_name || 'Unknown',
        avatar: user?.avatar || '',
        wins: roster.settings.wins,
        losses: roster.settings.losses,
        ties: roster.settings.ties,
        points: roster.settings.fpts + (roster.settings.fpts_decimal / 100),
      };
    });

    return {
      rankings: powerRankingsData,
      leagueInfo: {
        name: leagueInfo.name,
        season: leagueInfo.season,
      },
    };
  } catch (error) {
    console.error('Error fetching power rankings data:', error);
    throw error;
  }
}

async function fetchUsers(leagueId: string): Promise<any[]> {
  const response = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/users`);
  return response.json();
}

async function fetchRosters(leagueId: string): Promise<any[]> {
  const response = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/rosters`);
  return response.json();
}

async function fetchLeagueInfo(leagueId: string): Promise<any> {
  const response = await fetch(`https://api.sleeper.app/v1/league/${leagueId}`);
  return response.json();
}
