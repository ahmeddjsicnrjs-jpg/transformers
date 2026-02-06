import { useRouter } from 'expo-router';
import HomeScreen from '../screens/HomeScreen';

export default function HomeRoute() {
  const router = useRouter();

  return (
    <HomeScreen
      onNavigateToTasks={() => {
        // TODO: navigate to /tasks when TaskListScreen is implemented
        console.log('Navigate to tasks');
      }}
      onNavigateToProfile={() => {
        // TODO: navigate to /profile when ProfileScreen is implemented
        console.log('Navigate to profile');
      }}
    />
  );
}
