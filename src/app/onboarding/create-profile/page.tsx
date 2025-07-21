
import ProfileCreator from '@/components/app/profile-creator';

export default function OnboardingProfilePage() {
  return (
    <div className="container mx-auto py-8">
      <ProfileCreator isOnboarding={true} />
    </div>
  );
}
