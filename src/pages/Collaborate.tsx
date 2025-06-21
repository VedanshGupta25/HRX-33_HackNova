
import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { StreakDisplay } from '@/components/StreakDisplay';
import { useStreak } from '@/hooks/useStreak';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, MessageSquare, UserPlus, Video } from 'lucide-react';

const Collaborate = () => {
  const { streakData } = useStreak();
  const [joinCode, setJoinCode] = useState('');

  const mockStudyGroups = [
    {
      id: 1,
      name: "JavaScript Fundamentals",
      members: 12,
      activity: "Active now",
      description: "Learning the basics of JavaScript together"
    },
    {
      id: 2,
      name: "React Mastery",
      members: 8,
      activity: "2 hours ago",
      description: "Building modern web applications with React"
    },
    {
      id: 3,
      name: "Data Science Study Group",
      members: 15,
      activity: "1 day ago",
      description: "Exploring data analysis and machine learning"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <StreakDisplay 
            currentStreak={streakData.currentStreak}
            longestStreak={streakData.longestStreak}
            totalTasksCompleted={streakData.totalTasksCompleted}
          />

          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Collaborative Learning
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join study groups and learn together with peers
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-blue-600" />
                  Create Study Group
                </CardTitle>
                <CardDescription>
                  Start a new study group and invite friends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                  Create Group
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  Join Study Group
                </CardTitle>
                <CardDescription>
                  Enter a group code to join an existing study group
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Enter group code"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                />
                <Button className="w-full" variant="outline">
                  Join Group
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Active Study Groups</CardTitle>
              <CardDescription>
                Discover and join public study groups
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockStudyGroups.map((group) => (
                  <div key={group.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{group.name}</h3>
                        <p className="text-gray-600 mb-2">{group.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {group.members} members
                          </span>
                          <Badge variant="outline">{group.activity}</Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Video className="h-4 w-4" />
                        </Button>
                        <Button size="sm">Join</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Collaborate;
