import { useRouter } from 'expo-router';
import HomeScreen from '../screens/HomeScreen';

export default function HomeRoute() {
  const router = useRouter();

  return (
    <HomeScreen
      onNavigateToTasks={() => {
        router.push('/tasks');
      }}
      onNavigateToProfile={() => {
        router.replace('/profile');
      }}
    />
  );
}
