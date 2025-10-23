import { useUser } from '@/contexts/UserContext';
import { Text, View } from 'react-native';

export function UserProfile() {
  const { user, loading } = useUser();

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!user) {
    return <Text>Not logged in</Text>;
  }

  return (
    <View>
      <Text>Welcome, {user.email}</Text>
      <Text>User ID: {user.uid}</Text>
      {user.displayName && <Text>Name: {user.displayName}</Text>}
      {user.photoURL && <Text>Photo URL: {user.photoURL}</Text>}
    </View>
  );
}