import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const FloatingActionButton = () => {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const toggleMenu = () => {
    const toValue = isExpanded ? 0 : 1;

    Animated.spring(animation, {
      toValue,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();

    setIsExpanded(!isExpanded);
  };

  const closeMenu = () => {
    if (isExpanded) {
      Animated.spring(animation, {
        toValue: 0,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }).start();
      setIsExpanded(false);
    }
  };

  const handleCreateGroup = () => {
    toggleMenu();
    router.push('/createGroup');
  };

  const handleJoinGroup = () => {
    toggleMenu();
    router.push('/joinGroup');
  };

  const createGroupY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -70],
  });

  const joinGroupY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -140],
  });

  const opacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const rotation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  return (
    <>
      {/* Backdrop for closing menu */}
      {isExpanded && (
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={closeMenu}
        />
      )}

      <View style={styles.container}>
        {/* Join Group Button */}
        {isExpanded && (
        <Animated.View
          style={[
            styles.secondaryButton,
            {
              transform: [{ translateY: joinGroupY }],
              opacity,
            },
          ]}
        >
          <TouchableOpacity
            style={[styles.actionButton, styles.joinButton]}
            onPress={handleJoinGroup}
          >
            <Text style={styles.actionButtonIcon}>🔗</Text>
            <Text style={styles.actionLabel}>加入群組</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Create Group Button */}
      {isExpanded && (
        <Animated.View
          style={[
            styles.secondaryButton,
            {
              transform: [{ translateY: createGroupY }],
              opacity,
            },
          ]}
        >
          <TouchableOpacity
            style={[styles.actionButton, styles.createButton]}
            onPress={handleCreateGroup}
          >
            <Text style={styles.actionButtonIcon}>➕</Text>
            <Text style={styles.actionLabel}>創建群組</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Main FAB */}
      <TouchableOpacity
        style={[styles.fab, isExpanded && styles.fabActive]}
        onPress={toggleMenu}
      >
        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
          <MaterialIcons
            name={isExpanded ? "close" : "add"}
            size={28}
            color="#FFFFFF"
          />
        </Animated.View>
      </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  container: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 100 : 80,
    right: 20,
    alignItems: 'flex-end',
    maxWidth: SCREEN_WIDTH - 40,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  fabActive: {
    backgroundColor: '#E63946',
  },
  secondaryButton: {
    position: 'absolute',
    alignItems: 'flex-end',
    right: 0,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    maxWidth: SCREEN_WIDTH - 80,
  },
  createButton: {
    backgroundColor: '#4CAF50',
  },
  joinButton: {
    backgroundColor: '#2196F3',
  },
  actionButtonIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  actionLabel: {
    fontSize: SIZES.xSmall,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default FloatingActionButton;
