import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">Fantasy League Awards</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/draft-report-card" className="no-underline">
              <Card>
                <CardHeader>
                  <CardTitle>Draft Report Card</CardTitle>
                  <CardDescription>View the draft report card for each team.</CardDescription>
                </CardHeader>
              </Card>
            </Link>
            <Link href="/pass-the-belt" className="no-underline">
              <Card>
                <CardHeader>
                  <CardTitle>Pass the Belt</CardTitle>
                  <CardDescription>Track the weekly belt holder.</CardDescription>
                </CardHeader>
              </Card>
            </Link>
            <Link href="/power-rankings" className="no-underline">
              <Card>
                <CardHeader>
                  <CardTitle>Power Rankings</CardTitle>
                  <CardDescription>View weekly power rankings based on roster strength.</CardDescription>
                </CardHeader>
              </Card>
            </Link>
            <Link href="/weekly-awards" className="no-underline">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Awards</CardTitle>
                  <CardDescription>Check out fun weekly awards and statistics.</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}