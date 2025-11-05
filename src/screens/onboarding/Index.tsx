import React, { useState, useRef } from 'react';
import { View, Text, FlatList, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LottieView from 'lottie-react-native';
import { colors, typography, spacing } from '../../theme';
import { RootStackParamList } from '../../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;

const { width } = Dimensions.get('window');
const windowWidth = Dimensions.get('window').width;

const slides = [
    {
        id: '1',
        title: 'Mind Your Task',
        image: require('@/assets/lottie/welcome-2.json'),
        description: "Let's begin your journey of contribution to science, at your fingertips. ",
    },
    {
        id: '2',
        title: 'Cognitive Science',
        image: require('@/assets/lottie/welcome-3.json'),
        description: 'Modelling the human mind, one task at a time.',
    },
    {
        id: '3',
        title: 'Offline First',
        image: require('@/assets/lottie/welcome-1.json'),
        description: 'We use intertnet only to save your experiment performance data to our secure database.',
    },
];

export default function OnboardingScreen() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);
    const navigation = useNavigation<NavigationProp>();

    const handleScroll = (event: { nativeEvent: { contentOffset: { x: number; }; }; }) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / width);
        setCurrentIndex(index);
    };

    const handleGetStarted = () => {
        navigation.navigate('Home');
    };

    const isLastSlide = currentIndex === slides.length - 1;

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={slides}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                snapToAlignment="start"
                decelerationRate="fast"
                snapToInterval={windowWidth}
                renderItem={({ item }) => (
                    <View style={styles.slideContainer}>
                        <LottieView 
                            autoPlay={true}
                            loop={true}
                            source={item.image}
                            style={styles.lottieAnimation}
                            resizeMode="contain"
                        />
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.description}>{item.description}</Text>
                    </View>
                )}
                keyExtractor={(item) => item.id}
            />

            <View style={styles.indicatorContainer}>
                {slides.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.indicator,
                            index === currentIndex ? styles.indicatorActive : styles.indicatorInactive
                        ]}
                    />
                ))}
            </View>

            {isLastSlide && (
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
                        <Text style={styles.buttonText}>Get Started</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    slideContainer: {
        width: windowWidth,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.lg,
    },
    lottieAnimation: {
        width: windowWidth / 1.1,
        height: windowWidth / 1.1,
    },
    title: {
        ...typography.heading1,
        color: colors.textPrimary,
        marginTop: spacing.md,
        textAlign: 'center',
    },
    description: {
        ...typography.body,
        color: colors.textSecondary,
        textAlign: 'center',
        width: '66%',
        marginTop: spacing.sm,
    },
    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: spacing.xxl * 2,
        width: '100%',
    },
    indicator: {
        height: 2,
        marginHorizontal: 1,
        width: 16,
    },
    indicatorActive: {
        backgroundColor: colors.primary,
    },
    indicatorInactive: {
        backgroundColor: colors.border,
    },
    buttonContainer: {
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.xxl,
        width: '100%',
    },
    button: {
        backgroundColor: colors.buttonPrimary,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    buttonText: {
        ...typography.button,
        color: colors.textPrimary,
    },
});

