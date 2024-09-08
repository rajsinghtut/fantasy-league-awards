import { mockPastWeeklyRankings } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from 'next/image';
import Link from 'next/link';

export default function PastRankingsPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-3xl font-bold mb-6">Past Rankings</h1>
      
      {mockPastWeeklyRankings.map((weeklyRanking) => (
        <div key={weeklyRanking.week} className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Week {weeklyRanking.week}</h2>
          
          <div className="grid gap-6">
            {weeklyRanking.rankings.map((ranking) => (
              <Card key={ranking.team.id}>
                <CardHeader className="flex flex-row items-center space-x-4">
                  <div className="w-12 h-12 relative">
                    <Image
                      src={`https://sleepercdn.com/avatars/${ranking.team.avatar}`}
                      alt={`${ranking.team.name} avatar`}
                      layout="fill"
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <CardTitle>{ranking.team.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Rank: {ranking.rank} 
                      {ranking.rank !== ranking.previousRank && (
                        <span className={ranking.rank < ranking.previousRank ? "text-green-500" : "text-red-500"}>
                          {ranking.rank < ranking.previousRank ? " ↑" : " ↓"}
                          {Math.abs(ranking.rank - ranking.previousRank)}
                        </span>
                      )}
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>Record: {ranking.team.wins}-{ranking.team.losses}</p>
                  <p>Points Scored: {ranking.team.pointsScored}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <h3 className="text-xl font-bold mt-8 mb-4">Fun Metrics</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(weeklyRanking.funMetrics).map(([key, value]) => (
              <Card key={key}>
                <CardHeader>
                  <CardTitle className="text-lg">{key.split(/(?=[A-Z])/).join(" ")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{JSON.stringify(value)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      <div className="mt-12">
        <Link href="/power-rankings" className="text-blue-500 hover:underline">
          View Current Rankings
        </Link>
      </div>
    </div>
  );
}