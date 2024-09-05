import { getDraftResults } from '@/lib/sleeper-api'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function DraftReportCard() {
  const draftResults = await getDraftResults()

  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-3xl font-bold mb-6">Draft Report Card</h1>
      <div className="grid gap-6">
        {draftResults.map((team, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{team.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">Grade: {team.grade}</p>
              <p className="mt-2"><strong>Strengths:</strong> {team.strengths.join(', ')}</p>
              <p><strong>Weaknesses:</strong> {team.weaknesses.join(', ')}</p>
              <p className="mt-2"><strong>Comment:</strong> {team.comment}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}