import { PrismaClient } from '@prisma/client';

const LEAGUE_ID = '1124820424132165632';
const prisma = new PrismaClient();

interface BeltHolder {
    id: number;
    teamId: string;
    teamName: string;
    weekAcquired: number;
    currentStreak: number;
    createdAt: Date;
  }
  
  interface LongestStreak {
    teamId: string;
    teamName: string;
    streak: number;
  }
  
  async function getCurrentWeek(): Promise<number> {
    const response = await fetch('https://api.sleeper.app/v1/state/nfl');
    const state = await response.json();
    return state.week;
  }
  
  async function updateBeltHolder(currentWeek: number): Promise<BeltHolder | null> {
    const previousWeek = currentWeek - 1;
    const response = await fetch(`https://api.sleeper.app/v1/league/${LEAGUE_ID}/matchups/${previousWeek}`);
    const matchups = await response.json();
  
    const previousBeltHolder = await prisma.beltHolder.findFirst({
      orderBy: { weekAcquired: 'desc' },
    });
  
    if (!previousBeltHolder) {
      // If there's no previous belt holder, assign it to the highest scorer of the week
      return assignInitialBeltHolder(matchups, currentWeek);
    }
  
    const beltHolderMatchup = matchups.find((matchup: any) => 
      matchup.roster_id.toString() === previousBeltHolder.teamId
    );
  
    if (!beltHolderMatchup) {
      console.error("Couldn't find the belt holder's matchup");
      return previousBeltHolder;
    }
  
    const opponent = matchups.find((matchup: any) => 
      matchup.matchup_id === beltHolderMatchup.matchup_id && 
      matchup.roster_id.toString() !== previousBeltHolder.teamId
    );
  
    if (!opponent) {
      console.error("Couldn't find the belt holder's opponent");
      return previousBeltHolder;
    }
  
    if (opponent.points > beltHolderMatchup.points) {
      // The belt holder was defeated, pass the belt
      const team = await prisma.team.findUnique({ where: { id: opponent.roster_id.toString() } });
      const newBeltHolder: Omit<BeltHolder, 'id' | 'createdAt'> = {
        teamId: opponent.roster_id.toString(),
        teamName: team?.name || 'Unknown Team',
        weekAcquired: currentWeek,
        currentStreak: 1,
      };

      return prisma.beltHolder.create({ data: newBeltHolder });
    } else {
      // The belt holder retained the belt
      const updatedBeltHolder: Omit<BeltHolder, 'id' | 'createdAt'> = {
        teamId: previousBeltHolder.teamId,
        teamName: previousBeltHolder.teamName,
        weekAcquired: previousBeltHolder.weekAcquired,
        currentStreak: previousBeltHolder.currentStreak + 1,
      };

      return prisma.beltHolder.create({ data: updatedBeltHolder });
    }
  }
  
  async function assignInitialBeltHolder(matchups: any[], currentWeek: number): Promise<BeltHolder> {
    const teamScores = matchups.reduce((acc: Record<string, number>, matchup: any) => {
      acc[matchup.roster_id] = matchup.points;
      return acc;
    }, {});

    const highestScoringTeamId = Object.entries(teamScores).reduce((a, b) => teamScores[a[0]] > teamScores[b[0]] ? a : b)[0];

    const team = await prisma.team.findUnique({ where: { id: highestScoringTeamId } });
    const initialBeltHolder: Omit<BeltHolder, 'id' | 'createdAt'> = {
      teamId: highestScoringTeamId,
      teamName: team?.name || 'Unknown Team',
      weekAcquired: currentWeek,
      currentStreak: 1,
    };

    const createdBeltHolder = await prisma.beltHolder.create({ data: initialBeltHolder });
    await updateLongestStreak(createdBeltHolder);

    return createdBeltHolder;
  }
  
  async function updateLongestStreak(currentBeltHolder: BeltHolder): Promise<void> {
    const longestStreak = await prisma.longestStreak.findFirst();
  
    if (!longestStreak || currentBeltHolder.currentStreak > longestStreak.streak) {
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
    const currentWeek = await getCurrentWeek();
    let beltHolder = await prisma.beltHolder.findFirst({
      orderBy: { weekAcquired: 'desc' },
    });
  
    if (!beltHolder || beltHolder.weekAcquired < currentWeek) {
      beltHolder = await updateBeltHolder(currentWeek);
    }
  
    return beltHolder;
  }
  
  export async function getLongestStreak(): Promise<LongestStreak | null> {
    return prisma.longestStreak.findFirst();
  }