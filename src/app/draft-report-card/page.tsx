import { getDraftResults } from '@/lib/sleeper-api'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function DraftReportCard() {
  const draftResults = await getDraftResults()

  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-3xl font-bold mb-6">Draft Report Card</h1>
      <div className="grid gap-6">
        {draftResults.map((team: any, index: number) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{team.teamName}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">Grade: {team.grade}</p>
              <p className="mt-2">
                <strong>Strengths:</strong> {Array.isArray(team.strengths) ? team.strengths.join(', ') : team.strengths}
              </p>
              <p>
                <strong>Weaknesses:</strong> {Array.isArray(team.weaknesses) ? team.weaknesses.join(', ') : team.weaknesses}
              </p>
              <p className="mt-2"><strong>Comment:</strong> {team.comment}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}