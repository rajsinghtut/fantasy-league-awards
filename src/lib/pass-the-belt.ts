import { PrismaClient } from '@prisma/client';

// Add these type definitions at the top of the file
type BeltHolder = {
  id: number; // Change id type to number
  teamId: string;
  teamName: string;
  weekAcquired: number;
  currentStreak: number;
  createdAt: Date;
};

type LongestStreak = {
  id: number;
  teamId: string;
  teamName: string;
  streak: number;
};

const LEAGUE_ID = '1124820424132165632';
const prisma = new PrismaClient();

console.log('Initializing pass-the-belt.ts');

async function getCurrentWeek(): Promise<number> {
  console.log('Getting current NFL week');
  const response = await fetch('https://api.sleeper.app/v1/state/nfl');
  const state = await response.json();
  console.log('Current NFL week:', state.week);
  return state.week;
}

async function updateBeltHolder(currentWeek: number): Promise<BeltHolder | null> {
  console.log(`Updating belt holder for week ${currentWeek}`);
  const previousWeek = currentWeek - 1;
  const response = await fetch(`https://api.sleeper.app/v1/league/${LEAGUE_ID}/matchups/${previousWeek}`);
  const matchups = await response.json();
  console.log('Fetched matchups:', matchups);

  const previousBeltHolder = await prisma.beltHolder.findFirst({
    orderBy: { weekAcquired: 'desc' },
  });
  console.log('Previous belt holder:', previousBeltHolder);

  if (!previousBeltHolder) {
    console.log('No previous belt holder, assigning initial belt holder');
    return assignInitialBeltHolder(matchups, currentWeek);
  }

  const beltHolderMatchup = matchups.find((matchup: any) => 
    matchup.roster_id.toString() === previousBeltHolder.teamId
  );
  console.log('Belt holder matchup:', beltHolderMatchup);

  if (!beltHolderMatchup) {
    console.error("Couldn't find the belt holder's matchup");
    return previousBeltHolder;
  }

  const opponent = matchups.find((matchup: any) => 
    matchup.matchup_id === beltHolderMatchup.matchup_id && 
    matchup.roster_id.toString() !== previousBeltHolder.teamId
  );
  console.log('Opponent matchup:', opponent);

  if (!opponent) {
    console.error("Couldn't find the belt holder's opponent");
    return previousBeltHolder;
  }

  if (opponent.points > beltHolderMatchup.points) {
    console.log('Belt holder was defeated, passing the belt to the opponent');
    const team = await prisma.team.findUnique({ where: { id: opponent.roster_id.toString() } });
    const newBeltHolder: Omit<BeltHolder, 'id' | 'createdAt'> = {
      teamId: opponent.roster_id.toString(),
      teamName: team?.name || 'Unknown Team',
      weekAcquired: currentWeek,
      currentStreak: 1,
    };
    console.log('New belt holder:', newBeltHolder);
    return prisma.beltHolder.create({ data: { ...newBeltHolder, id: Number(opponent.roster_id) } }); // Ensure id is a number
  } else {
    console.log('Belt holder retained the belt, updating streak');
    const updatedBeltHolder: Omit<BeltHolder, 'id' | 'createdAt'> = {
      teamId: previousBeltHolder.teamId,
      teamName: previousBeltHolder.teamName,
      weekAcquired: previousBeltHolder.weekAcquired,
      currentStreak: previousBeltHolder.currentStreak + 1,
    };
    console.log('Updated belt holder:', updatedBeltHolder);
    return prisma.beltHolder.create({ data: { ...updatedBeltHolder, id: Number(previousBeltHolder.id) } }); // Ensure id is a number
  }
}

async function assignInitialBeltHolder(matchups: any[], currentWeek: number): Promise<BeltHolder> {
  console.log('Assigning initial belt holder');
  const teamScores = matchups.reduce((acc: Record<string, number>, matchup: any) => {
    acc[matchup.roster_id] = matchup.points;
    return acc;
  }, {});
  console.log('Team scores:', teamScores);

  const highestScoringTeamId = Object.entries(teamScores).reduce((a, b) => teamScores[a[0]] > teamScores[b[0]] ? a : b)[0];
  console.log('Highest scoring team ID:', highestScoringTeamId);

  const team = await prisma.team.findUnique({ where: { id: highestScoringTeamId } });
  const initialBeltHolder: BeltHolder = {
    id: Number(highestScoringTeamId), // Ensure id is a number
    teamId: highestScoringTeamId.toString(), // Ensure teamId is a string
    teamName: team?.name || 'Unknown Team',
    weekAcquired: currentWeek,
    currentStreak: 1,
    createdAt: new Date(),
  };
  console.log('Initial belt holder:', initialBeltHolder);

  const createdBeltHolder = await prisma.beltHolder.create({ data: initialBeltHolder });
  await updateLongestStreak(createdBeltHolder);

  return createdBeltHolder;
}

async function updateLongestStreak(currentBeltHolder: BeltHolder): Promise<void> {
  console.log('Updating longest streak');
  const longestStreak = await prisma.longestStreak.findFirst();
  console.log('Current longest streak:', longestStreak);

  if (!longestStreak || currentBeltHolder.currentStreak > longestStreak.streak) {
    console.log('Updating longest streak record');
    await prisma.longestStreak.upsert({
      where: { id: 1 },
      update: {
        teamId: currentBeltHolder.teamId,
        teamName: currentBeltHolder.teamName,
        streak: currentBeltHolder.currentStreak,
      },
      create: {
        id: 1,
        teamId: currentBeltHolder.teamId,
        teamName: currentBeltHolder.teamName,
        streak: currentBeltHolder.currentStreak,
      },
    });
  }
}

export async function getBeltHolder(): Promise<BeltHolder | null> {
  console.log('Getting current belt holder');
  const currentWeek = await getCurrentWeek();
  let beltHolder = await prisma.beltHolder.findFirst({
    orderBy: { weekAcquired: 'desc' },
  });
  console.log('Current belt holder:', beltHolder);

  if (!beltHolder || beltHolder.weekAcquired < currentWeek) {
    console.log('Updating belt holder');
    beltHolder = await updateBeltHolder(currentWeek);
  }

  return beltHolder;
}

export async function getLongestStreak(): Promise<LongestStreak | null> {
  console.log('Getting longest streak');
  const longestStreak = await prisma.longestStreak.findFirst();
  console.log('Longest streak:', longestStreak);
  return longestStreak;
}