import React, {useEffect} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  Avatar,
  List,
  Divider,
  Snackbar,
} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {RootState, AppDispatch} from '../../store';
import {signOut} from '../../store/slices/authSlice';
import {syncAllData, getPendingSyncCount} from '../../store/slices/syncSlice';

const ProfileScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const {user} = useSelector((state: RootState) => state.auth);
  const {isConnected} = useSelector((state: RootState) => state.network);
  const {isSyncing, lastSyncTime, pendingSyncCount} = useSelector((state: RootState) => state.sync);

  useEffect(() => {
    dispatch(getPendingSyncCount());
  }, [dispatch]);

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Sign Out', style: 'destructive', onPress: () => dispatch(signOut())},
      ]
    );
  };

  const handleSync = async () => {
    if (isConnected) {
      await dispatch(syncAllData());
    } else {
      Alert.alert('No Internet', 'Please check your internet connection and try again.');
    }
  };

  const handleSettings = () => {
    navigation.navigate('Settings' as never);
  };

  const formatLastSync = (syncTime: string | null) => {
    if (!syncTime) return 'Never';
    const date = new Date(syncTime);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return date.toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card style={styles.profileCard}>
          <Card.Content style={styles.profileContent}>
            <Avatar.Text
              size={80}
              label={user?.displayName?.charAt(0) || 'U'}
              style={styles.avatar}
            />
            <Text variant="headlineSmall" style={styles.userName}>
              {user?.displayName || 'User'}
            </Text>
            <Text variant="bodyMedium" style={styles.userEmail}>
              {user?.email}
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.statsCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Sync Status
            </Text>
            
            <List.Item
              title="Connection Status"
              description={isConnected ? 'Connected' : 'Offline'}
              left={(props) => (
                <List.Icon
                  {...props}
                  icon={isConnected ? 'wifi' : 'wifi-off'}
                  color={isConnected ? '#4CAF50' : '#FF6B6B'}
                />
              )}
            />
            
            <List.Item
              title="Last Sync"
              description={formatLastSync(lastSyncTime)}
              left={(props) => (
                <List.Icon {...props} icon="sync" color="#666666" />
              )}
            />
            
            <List.Item
              title="Pending Sync"
              description={`${pendingSyncCount} items`}
              left={(props) => (
                <List.Icon {...props} icon="cloud-upload" color="#FFA726" />
              )}
            />

            <Button
              mode="contained"
              onPress={handleSync}
              loading={isSyncing}
              disabled={isSyncing || !isConnected}
              icon="sync"
              style={styles.syncButton}>
              {isSyncing ? 'Syncing...' : 'Sync Now'}
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.actionsCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Account
            </Text>
            
            <List.Item
              title="Settings"
              description="App preferences and configuration"
              left={(props) => <List.Icon {...props} icon="settings" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={handleSettings}
            />
            
            <Divider style={styles.divider} />
            
            <List.Item
              title="Sign Out"
              description="Sign out of your account"
              left={(props) => <List.Icon {...props} icon="logout" color="#FF6B6B" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={handleSignOut}
            />
          </Card.Content>
        </Card>

        <Card style={styles.infoCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              About
            </Text>
            <Text variant="bodyMedium" style={styles.appInfo}>
              Task Manager v1.0.0
            </Text>
            <Text variant="bodySmall" style={styles.appDescription}>
              A cross-platform task management app with offline support, built with React Native, Firebase, and Redux.
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContainer: {
    padding: 16,
  },
  profileCard: {
    elevation: 2,
    marginBottom: 16,
  },
  profileContent: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatar: {
    backgroundColor: '#6200EE',
    marginBottom: 16,
  },
  userName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    color: '#666666',
  },
  statsCard: {
    elevation: 2,
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  syncButton: {
    marginTop: 16,
  },
  actionsCard: {
    elevation: 2,
    marginBottom: 16,
  },
  divider: {
    marginVertical: 8,
  },
  infoCard: {
    elevation: 2,
  },
  appInfo: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  appDescription: {
    color: '#666666',
    lineHeight: 20,
  },
});

export default ProfileScreen;
