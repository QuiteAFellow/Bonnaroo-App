import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Artist } from '../types';  // Import Artist type
import artistImages from '../../assets/utils/artistImages';
import { useFavorites } from '../../context/FavoritesContext';
import { useTheme } from './ThemeContext';
import FastImage from 'react-native-fast-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { CalendarStackParamList } from '../screens/Stack/CalendarStackNavigator';  // Import CalendarStackParamList

type CalendarNav = NativeStackNavigationProp<CalendarStackParamList, 'FestivalSchedule'>;

type Props = {
    artist: Artist;  // Pass the artist object as prop
};

const ArtistBioContent: React.FC<Props> = ({ artist }) => {
    const navigation = useNavigation<CalendarNav>(); // <-- Move here!
    const { favorites, toggleFavorite } = useFavorites();
    const { themeData, theme } = useTheme();  // Get theme data from context
    const isFavorited = favorites[artist["AOTD #"]] || false;
    const descriptionSegments = artist.Description.split('[PAGE_BREAK]');

    const handleToggleFavorite = () => {
        toggleFavorite(artist);
    };

    // Set heart color based on whether the artist is favorited or not
    const heartColor = isFavorited ? (theme === 'Light' ? 'red' : themeData.highlightColor) : themeData.textColor;
    const heartIcon = isFavorited ? 'heart' : 'heart-outline';  // Heart outline for unfavorited artists

    const Container = Platform.OS === 'ios' ? SafeAreaView : View;

    return (
        <Container style={[styles.container, { backgroundColor: themeData.backgroundColor }]}>
            <ScrollView style={[styles.container, { backgroundColor: themeData.backgroundColor }]}>
            <View>
                <FastImage source={artistImages[artist.Artist]} style={styles.imageHeader} resizeMode="cover" />
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color='#000000' />
                </TouchableOpacity>
            </View>
            <View style={styles.content}>
                <View style={styles.titleContainer}>
                <Text style={[styles.title, { color: themeData.textColor }]}>{artist.Artist}</Text>
                <TouchableOpacity onPress={handleToggleFavorite} style={styles.heartContainer}>
                    <Ionicons
                    name={heartIcon}
                    size={35}
                    color={heartColor}  // Set heart color based on whether the artist is favorited or not
                    />
                </TouchableOpacity>
                </View>
                <View style={styles.infoContainer}>
                <Ionicons name="calendar" size={20} color="darkgrey" />
                <TouchableOpacity
                    onPress={() => navigation.navigate('FestivalSchedule', {
                    day: artist.Scheduled, // or whatever property represents the day
                    artistId: artist["AOTD #"], // or artist.Artist, etc.
                    startTime: artist.StartTime
                    })}
                >
                    <Text style={[styles.infoText, { color: themeData.textColor, textDecorationLine: 'underline' }]}>
                    {artist.Scheduled}
                    </Text>
                </TouchableOpacity>
                </View>
                <View style={styles.infoContainer}>
                <Ionicons name="time" size={20} color="darkgrey" />
                <TouchableOpacity
                    onPress={() => navigation.navigate('FestivalSchedule', {
                    day: artist.Scheduled,
                    artistId: artist["AOTD #"],
                    startTime: artist.StartTime
                    })}
                >
                    <Text style={[styles.infoText, { color: themeData.textColor, textDecorationLine: 'underline' }]}>
                    {artist.StartTime} - {artist.EndTime}
                    </Text>
                </TouchableOpacity>
                </View>
                <View style={styles.infoContainer}>
                <Ionicons name="location" size={20} color="darkgrey" />
                <Text style={[styles.infoText, { color: themeData.textColor }]}>{artist.Stage}</Text>
                </View>
                <View style={styles.infoContainer}>
                <Ionicons name="disc-outline" size={20} color="darkgrey" />
                <Text style={[styles.infoText, { color: themeData.textColor }]}>{artist.Genres}</Text>
                </View>
                <View style={styles.description}>
                {descriptionSegments.map((segment, index) => (
                    <Text key={index} style={[styles.descriptionText, { color: themeData.textColor }]}>
                    {segment}
                    {index < descriptionSegments.length - 1 ? '\n\n' : ''}
                    </Text>
                ))}
                </View>
            </View>
            </ScrollView>
        </Container>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    imageHeader: {
        width: '100%',
        height: 400,
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        padding: 20,
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        flex: 1,
        flexWrap: 'wrap',
    },
    heartContainer: {
        marginLeft: 10,
        padding: 5,
        backgroundColor: 'transparent', // Remove the unwanted background circle
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    infoText: {
        fontSize: 16,
        marginLeft: 10,
    },
    description: {
        marginTop: 10,
        marginBottom: 10,
    },
    descriptionText: {
        fontSize: 16,
    },
});

export default ArtistBioContent;