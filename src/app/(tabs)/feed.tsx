import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
  PanResponder,
  StatusBar,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Video } from 'expo-av';
import { useAuth } from '../../context/AuthContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function FeedScreen() {
  const { user, logout } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showingVideo, setShowingVideo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const pan = useRef(new Animated.ValueXY()).current;
  const scale = useRef(new Animated.Value(1)).current;
  const nextCardScale = useRef(new Animated.Value(0.95)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const currentProfile = profiles[currentProfileIndex];
  const nextProfile = profiles[currentProfileIndex + 1];

  // API Functions
  const fetchProfiles = async (skip = 0) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/feed?limit=10&skip=${skip}`, {
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profiles');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching profiles:', error);
      Alert.alert('Error', 'Failed to load profiles. Please try again.');
      return { profiles: [], hasMore: false };
    }
  };

  const recordAction = async (targetUserId, action) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/feed/action`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetUserId,
          action
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to record action');
      }

      const data = await response.json();
      
      if (data.isMatch) {
        Alert.alert('It\'s a Match! 🎉', 'You both liked each other!', [
          { text: 'Keep Swiping', style: 'default' },
          { text: 'Send Message', style: 'default' }
        ]);
      }

      return data;
    } catch (error) {
      console.error('Error recording action:', error);
      return null;
    }
  };

  // Load initial profiles
  useEffect(() => {
    const loadInitialProfiles = async () => {
      setLoading(true);
      const data = await fetchProfiles(0);
      setProfiles(data.profiles || []);
      setHasMore(data.hasMore || false);
      setLoading(false);
    };

    loadInitialProfiles();
  }, []);

  // Load more profiles when running low
  useEffect(() => {
    const loadMoreProfiles = async () => {
      if (profiles.length - currentProfileIndex <= 2 && hasMore && !loadingMore) {
        setLoadingMore(true);
        const data = await fetchProfiles(profiles.length);
        
        if (data.profiles && data.profiles.length > 0) {
          setProfiles(prev => [...prev, ...data.profiles]);
          setHasMore(data.hasMore || false);
        } else {
          setHasMore(false);
        }
        
        setLoadingMore(false);
      }
    };

    loadMoreProfiles();
  }, [currentProfileIndex, profiles.length, hasMore, loadingMore]);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5;
    },
    
    onPanResponderMove: (_, gestureState) => {
      pan.setValue({ x: gestureState.dx, y: gestureState.dy });
      
      const scaleValue = 1 - Math.abs(gestureState.dx) / SCREEN_WIDTH * 0.05;
      
      scale.setValue(scaleValue);
      opacity.setValue(1 - Math.abs(gestureState.dx) / SCREEN_WIDTH * 0.3);
    },
    
    onPanResponderRelease: (_, gestureState) => {
      const swipeThreshold = SCREEN_WIDTH * 0.3;
      
      if (Math.abs(gestureState.dx) > swipeThreshold) {
        const direction = gestureState.dx > 0 ? 1 : -1;
        
        Animated.parallel([
          Animated.timing(pan, {
            toValue: { x: direction * SCREEN_WIDTH * 1.5, y: gestureState.dy },
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.timing(nextCardScale, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
          }),
        ]).start(() => {
          handleSwipe(direction > 0 ? 'like' : 'pass');
        });
      } else if (gestureState.dy < -swipeThreshold) {
        // Super like (swipe up)
        Animated.parallel([
          Animated.timing(pan, {
            toValue: { x: 0, y: -SCREEN_HEIGHT },
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.timing(nextCardScale, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
          }),
        ]).start(() => {
          handleSwipe('superlike');
        });
      } else {
        // Snap back
        Animated.parallel([
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }),
          Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: false,
          }),
          Animated.spring(opacity, {
            toValue: 1,
            useNativeDriver: false,
          }),
        ]).start();
      }
    },
  });

  const handleSwipe = async (action) => {
    if (!currentProfile) return;

    await recordAction(currentProfile.id, action);
    
    // Reset values for next card
    pan.setValue({ x: 0, y: 0 });
    scale.setValue(1);
    opacity.setValue(1);
    nextCardScale.setValue(0.95);
    setCurrentPhotoIndex(0);
    setShowingVideo(false);
    
    // Move to next profile
    setCurrentProfileIndex(prev => prev + 1);
  };

  const handlePhotoTap = (side) => {
    if (!currentProfile) return;

    if (side === 'left' && currentPhotoIndex > 0) {
      setCurrentPhotoIndex(prev => prev - 1);
      setShowingVideo(false);
    } else if (side === 'right' && currentPhotoIndex < (currentProfile.photos?.length || 0) - 1) {
      setCurrentPhotoIndex(prev => prev + 1);
      setShowingVideo(false);
    }
  };

  const toggleVideo = () => {
    if (currentProfile?.video) {
      setShowingVideo(!showingVideo);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text style={styles.loadingText}>Finding amazing people...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (currentProfileIndex >= profiles.length) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.noMoreCards}>
          <Text style={styles.noMoreText}>No more profiles!</Text>
          <Text style={styles.noMoreSubtext}>Check back later for new people</Text>
          {loadingMore && (
            <ActivityIndicator size="small" color="#FF6B6B" style={{ marginTop: 20 }} />
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.headerButton}>👤</Text>
        </TouchableOpacity>
        <Text style={styles.logo}>raydius</Text>
        <TouchableOpacity>
          <Text style={styles.headerButton}>💬</Text>
        </TouchableOpacity>
      </View>

      {/* Card Stack */}
      <View style={styles.cardContainer}>
        {/* Next Card (Background) */}
        {nextProfile && (
          <Animated.View 
            style={[
              styles.card,
              styles.nextCard,
              { transform: [{ scale: nextCardScale }] }
            ]}
          >
            <Image 
              source={{ uri: nextProfile.photos?.[0] || 'https://via.placeholder.com/400' }}
              style={styles.cardImage}
              resizeMode="cover"
            />
          </Animated.View>
        )}

        {/* Current Card */}
        {currentProfile && (
          <Animated.View
            style={[
              styles.card,
              {
                transform: [
                  { translateX: pan.x },
                  { translateY: pan.y },
                  { rotate: pan.x.interpolate({
                    inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
                    outputRange: ['-30deg', '0deg', '30deg'],
                  }) },
                  { scale: scale },
                ],
                opacity: opacity,
              }
            ]}
            {...panResponder.panHandlers}
          >
            {/* Photo/Video Display */}
            <View style={styles.mediaContainer}>
              {showingVideo && currentProfile.video ? (
                <Video
                  source={{ uri: currentProfile.video }}
                  style={styles.cardImage}
                  resizeMode="cover"
                  shouldPlay
                  isLooping
                  isMuted
                />
              ) : (
                <Image 
                  source={{ 
                    uri: currentProfile.photos?.[currentPhotoIndex] || 'https://via.placeholder.com/400'
                  }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
              )}
              
              {/* Photo Navigation Overlay */}
              <View style={styles.photoNavigation}>
                <TouchableOpacity 
                  style={styles.photoNavLeft}
                  onPress={() => handlePhotoTap('left')}
                />
                <TouchableOpacity 
                  style={styles.photoNavRight}
                  onPress={() => handlePhotoTap('right')}
                />
              </View>

              {/* Photo Indicators */}
              {currentProfile.photos && currentProfile.photos.length > 1 && (
                <View style={styles.photoIndicators}>
                  {currentProfile.photos.map((_, index) => (
                    <View 
                      key={index}
                      style={[
                        styles.indicator,
                        index === currentPhotoIndex && styles.activeIndicator
                      ]}
                    />
                  ))}
                </View>
              )}

              {/* Video Play Button */}
              {currentProfile.video && !showingVideo && (
                <TouchableOpacity style={styles.videoButton} onPress={toggleVideo}>
                  <Text style={styles.videoIcon}>▶️</Text>
                </TouchableOpacity>
              )}

              {/* Gradient Overlay */}
              <LinearGradient
                colors={['transparent', 'transparent', 'rgba(0,0,0,0.8)']}
                style={styles.gradientOverlay}
              />
            </View>

            {/* Profile Info */}
            <ScrollView style={styles.profileInfo} showsVerticalScrollIndicator={false}>
              <View style={styles.basicInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.name}>{currentProfile.name}</Text>
                  <Text style={styles.age}>{currentProfile.age}</Text>
                </View>
                <Text style={styles.distance}>{currentProfile.distance}</Text>
                <Text style={styles.occupation}>{currentProfile.occupation}</Text>
              </View>

              {/* Interests */}
              {currentProfile.interests && currentProfile.interests.length > 0 && (
                <View style={styles.interestsContainer}>
                  {currentProfile.interests.map((interest, index) => (
                    <View key={index} style={styles.interestTag}>
                      <Text style={styles.interestText}>{interest}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Prompts */}
              {currentProfile.prompts && currentProfile.prompts.map((prompt, index) => (
                <View key={index} style={styles.promptCard}>
                  <Text style={styles.promptQuestion}>{prompt.question}</Text>
                  <Text style={styles.promptAnswer}>{prompt.answer}</Text>
                </View>
              ))}
            </ScrollView>
          </Animated.View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.passButton]}
          onPress={() => handleSwipe('pass')}
        >
          <Text style={styles.actionButtonText}>✕</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.superLikeButton]}
          onPress={() => handleSwipe('superlike')}
        >
          <Text style={styles.actionButtonText}>⭐</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.likeButton]}
          onPress={() => handleSwipe('like')}
        >
          <Text style={styles.actionButtonText}>❤️</Text>
        </TouchableOpacity>
      </View>

      {/* Loading indicator when fetching more profiles */}
      {loadingMore && (
        <View style={styles.loadingMore}>
          <ActivityIndicator size="small" color="#FF6B6B" />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B',
    letterSpacing: 1,
  },
  headerButton: {
    fontSize: 24,
    color: '#fff',
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: SCREEN_WIDTH - 40,
    height: SCREEN_HEIGHT * 0.7,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  nextCard: {
    position: 'absolute',
    zIndex: 0,
  },
  mediaContainer: {
    flex: 1,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '60%',
  },
  photoNavigation: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '60%',
    flexDirection: 'row',
  },
  photoNavLeft: {
    flex: 1,
  },
  photoNavRight: {
    flex: 1,
  },
  photoIndicators: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  indicator: {
    width: 30,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
  },
  activeIndicator: {
    backgroundColor: '#fff',
  },
  videoButton: {
    position: 'absolute',
    top: '25%',
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoIcon: {
    fontSize: 20,
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  profileInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: '45%',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  basicInfo: {
    marginBottom: 15,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 5,
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 8,
  },
  age: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '300',
  },
  distance: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 5,
  },
  occupation: {
    fontSize: 16,
    color: '#FF6B6B',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  interestTag: {
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    borderColor: '#FF6B6B',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  interestText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '500',
  },
  promptCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
  },
  promptQuestion: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '600',
    marginBottom: 8,
  },
  promptAnswer: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 22,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 60,
    paddingVertical: 30,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  passButton: {
    backgroundColor: '#fff',
  },
  superLikeButton: {
    backgroundColor: '#4FC3F7',
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  likeButton: {
    backgroundColor: '#FF6B6B',
  },
  actionButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  noMoreCards: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  noMoreText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  noMoreSubtext: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 30,
  },
  loadingMore: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
  },
});