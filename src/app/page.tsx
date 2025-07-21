import ProfileCreator from '@/components/app/profile-creator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="container mx-auto">
      <ProfileCreator />
    </div>
  );
}
