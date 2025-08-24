import React, { useEffect, useRef } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const AnimatedModal = ({ 
  visible, 
  onClose, 
  children, 
  animationType = 'slide', // 'slide', 'scale', 'fade'
  position = 'bottom', // 'bottom', 'center', 'top'
  backdropOpacity = 0.5,
  style = {}
}) => {
  const slideAnim = useRef(new Animated.Value(
    position === 'bottom' ? SCREEN_HEIGHT : 
    position === 'top' ? -SCREEN_HEIGHT : 0
  )).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      const animations = [
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        })
      ];

      if (animationType === 'slide') {
        animations.push(
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
            tension: 100,
            friction: 8,
          })
        );
      } else if (animationType === 'scale') {
        animations.push(
          Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            tension: 100,
            friction: 8,
          })
        );
      } else if (animationType === 'fade') {
        animations.push(
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          })
        );
      }

      Animated.parallel(animations).start();
    } else {
      const animations = [
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        })
      ];

      if (animationType === 'slide') {
        animations.push(
          Animated.timing(slideAnim, {
            toValue: position === 'bottom' ? SCREEN_HEIGHT : 
                   position === 'top' ? -SCREEN_HEIGHT : 0,
            duration: 250,
            useNativeDriver: true,
          })
        );
      } else if (animationType === 'scale') {
        animations.push(
          Animated.spring(scaleAnim, {
            toValue: 0,
            useNativeDriver: true,
            tension: 100,
            friction: 8,
          })
        );
      } else if (animationType === 'fade') {
        animations.push(
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
          })
        );
      }

      Animated.parallel(animations).start();
    }
  }, [visible]);

  const handleClose = () => {
    const animations = [
      Animated.timing(backdropAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      })
    ];

    if (animationType === 'slide') {
      animations.push(
        Animated.timing(slideAnim, {
          toValue: position === 'bottom' ? SCREEN_HEIGHT : 
                 position === 'top' ? -SCREEN_HEIGHT : 0,
          duration: 250,
          useNativeDriver: true,
        })
      );
    } else if (animationType === 'scale') {
      animations.push(
        Animated.spring(scaleAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        })
      );
    } else if (animationType === 'fade') {
      animations.push(
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        })
      );
    }

    Animated.parallel(animations).start(() => onClose());
  };

  const getContentStyle = () => {
    const baseStyle = [styles.content, style];
    
    if (animationType === 'slide') {
      return [
        ...baseStyle,
        position === 'bottom' && styles.bottomContent,
        position === 'top' && styles.topContent,
        position === 'center' && styles.centerContent,
        { transform: [{ translateY: slideAnim }] }
      ];
    } else if (animationType === 'scale') {
      return [
        ...baseStyle,
        styles.centerContent,
        { transform: [{ scale: scaleAnim }] }
      ];
    } else if (animationType === 'fade') {
      return [
        ...baseStyle,
        styles.centerContent,
        { opacity: fadeAnim }
      ];
    }
    
    return baseStyle;
  };

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={styles.container}>
        <Animated.View 
          style={[
            styles.backdrop, 
            { 
              opacity: backdropAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, backdropOpacity]
              })
            }
          ]}
        >
          <TouchableOpacity style={styles.backdropTouch} onPress={handleClose} />
        </Animated.View>
        <Animated.View style={getContentStyle()}>
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 1)',
  },
  backdropTouch: {
    flex: 1,
  },
  content: {
    backgroundColor: '#FFFFFF',
  },
  bottomContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  topContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  centerContent: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [
      { translateX: -SCREEN_WIDTH * 0.4 },
      { translateY: -100 }
    ],
    borderRadius: 16,
    minWidth: SCREEN_WIDTH * 0.8,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
  },
});

export default AnimatedModal;