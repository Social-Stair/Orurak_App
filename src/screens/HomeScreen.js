import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';

import { getHomeStats, updateFcmToken } from '../api/socialStairApi';
import { COLORS } from '../constants/colors';
import { TYPOGRAPHY } from '../constants/typography';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function HomeScreen() {
  const [nickname, setNickname] = useState('사용자');
  const [goalData, setGoalData] = useState({ currentFloors: 0, goalFloors: 0, achievementRate: 0 });
  const [streak, setStreak] = useState(0); 
  const [lastWeekRate, setLastWeekRate] = useState(0); 
  const [notifications, setNotifications] = useState([]);

  const getRelativeTime = (timestamp) => {
    const now = Date.now();
    const diffInSeconds = Math.floor((now - timestamp) / 1000);

    if (diffInSeconds < 60) return '방금 전';
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}일 전`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}주 전`;
  };

  useFocusEffect(
    useCallback(() => {
      const fetchHomeData = async () => {
        try {
          const savedName = await SecureStore.getItemAsync('userNickname');
          if (savedName) setNickname(savedName);

          const statsData = await getHomeStats();
          if (statsData && statsData.members) {
            const myData = statsData.members.find(m => m.nickname === savedName);
            if (myData) {
              setGoalData({
                currentFloors: myData.currentFloors || 0,
                goalFloors: myData.goalFloors || 0,
                achievementRate: myData.achievementRate || 0,
              });
            }
          }
        } catch (error) {
          console.error("홈 데이터 새로고침 실패:", error);
        }
      };
      fetchHomeData();
      return () => {}; 
    }, [nickname]) 
  );

  useEffect(() => {
    const registerForPushNotificationsAsync = async () => {
      if (Device.isDevice) {
        try {
          const { status: existingStatus } = await Notifications.getPermissionsAsync();
          let finalStatus = existingStatus;
          
          if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
          }
          if (finalStatus !== 'granted') return;

          const tokenData = await Notifications.getExpoPushTokenAsync().catch((err) => {
            console.log('Expo Go 환경에서는 푸시 토큰을 가져올 수 없습니다 (정상입니다).', err.message);
            return null;
          });

          if (tokenData && tokenData.data) {
            const token = tokenData.data;
            const userId = await SecureStore.getItemAsync('userId'); 
            if (userId) {
              await updateFcmToken(userId, token);
              console.log('서버에 FCM 토큰 등록 완료:', token);
            }
          }
        } catch (e) {
          console.log('푸시 알림 설정 중 에러 발생 (Expo Go 제한):', e);
        }
      } else {
        console.log('푸시 알림은 실제 기기에서만 작동합니다.');
      }
    };

    registerForPushNotificationsAsync();

    const loadSavedNotifications = async () => {
      try {
        const saved = await AsyncStorage.getItem('savedNotifications');
        if (saved) setNotifications(JSON.parse(saved));
      } catch (e) {
        console.error('알림 불러오기 에러:', e);
      }
    };
    loadSavedNotifications();

    const notificationListener = Notifications.addNotificationReceivedListener(async (notification) => {
      const nowTime = Date.now();
      
      const newNoti = {
        id: nowTime.toString(), 
        timestamp: nowTime, // 시간에 쓸 고유 타임스탬프
        type: 'info', 
        title: notification.request.content.title || '성찰 일지 알림',
        body: notification.request.content.body || '새로운 알림이 도착했습니다.',
      };

      setNotifications((prev) => {
        const updatedList = [newNoti, ...prev];
        AsyncStorage.setItem('savedNotifications', JSON.stringify(updatedList));
        return updatedList;
      });
    });

    return () => {
      notificationListener.remove();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* 상단 환영 인사 영역 */}
        <View style={styles.headerContainer}>
          <Text style={styles.subHeader}>어서오세요, {nickname}님</Text>
          <Text style={styles.mainHeader}>오늘도 계단 한 층 더!</Text>
        </View>

        {/* 주간 목표 카드 */}
        <View style={styles.goalCard}>
          <View style={styles.accumulateContainer}>
            <Text style={styles.accumulateLabel}>이번 주 누적</Text>
            <View style={styles.accumulateValueRow}>
              <Text style={styles.accumulateNumber}>{goalData.currentFloors}</Text>
              <Text style={styles.accumulateUnit}>층</Text>
            </View>
          </View>

          <View style={styles.trendIconContainer}>
            <Feather name="trending-up" size={24} color={COLORS.white} />
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBackground}>
              <View style={[styles.progressFill, { width: `${Math.min(goalData.achievementRate, 100)}%` }]} />
            </View>
            <View style={styles.progressTextRow}>
              <Text style={styles.progressLabel}>주간 목표</Text>
              <Text style={styles.progressValue}>{goalData.currentFloors}/{goalData.goalFloors}층</Text>
            </View>
          </View>
        </View>

        {/* 통계 카드 */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <View style={styles.iconCircle}>
                <Feather name="calendar" size={20} color={COLORS.primary} />
              </View>
              <Text style={styles.statLabel}>연속 기록</Text>
            </View>
            <View style={styles.statValueRow}>
              <Text style={styles.statNumber}>{streak}</Text>
              <Text style={styles.statUnit}>일</Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <View style={styles.iconCircle}>
                <Feather name="award" size={20} color={COLORS.primary} />
              </View>
              <Text style={styles.statLabel}>지난 주 달성도</Text>
            </View>
            <View style={styles.statValueRow}>
              <Text style={styles.statNumber}>{lastWeekRate}</Text>
              <Text style={styles.statUnit}>%</Text>
            </View>
          </View>
        </View>

        {/* 알림 리스트 영역 */}
        <View style={styles.notificationSection}>
          <Text style={styles.sectionTitle}>성찰 일지 알림</Text>
          <View style={styles.notificationBox}>
            {notifications.length === 0 ? (
              <Text style={styles.notiDescription}>새로운 알림이 없습니다</Text>
            ) : (
              notifications.map((noti, index) => {
                const isAlert = noti.type === 'alert'; 
                return (
                  <React.Fragment key={noti.id}>
                    <View style={styles.notiItem}>
                      <Feather 
                        name={isAlert ? "alert-triangle" : "bell"} 
                        size={18} 
                        color={isAlert ? "#F24242" : "#F5BF35"} 
                      />
                      <View style={styles.notiContent}>
                        <View style={styles.notiHeader}>
                          <Text style={styles.notiCategory}>{noti.title}</Text>
                          {/* 💡 여기서 시간에 마법(getRelativeTime)을 걸어줍니다! */}
                          <Text style={styles.notiTime}>
                            {noti.timestamp ? getRelativeTime(noti.timestamp) : noti.time}
                          </Text>
                        </View>
                        <Text style={styles.notiDescription}>{noti.body}</Text>
                      </View>
                    </View>
                    {index < notifications.length - 1 && <View style={styles.divider} />}
                  </React.Fragment>
                );
              })
            )}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 68,
    paddingBottom: 140,
  },
  headerContainer: {
    marginBottom: 24,
    gap: 2,
  },
  subHeader: {
    ...TYPOGRAPHY.subHeader,
  },
  mainHeader: {
    ...TYPOGRAPHY.mainHeader,
  },
  
  // 주간 목표 카드 스타일
  goalCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 24,
    marginBottom: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  progressContainer: {
    // marginBottom: 16,
  },
  progressBackground: {
    height: 8,
    backgroundColor: '#3F5DC8',
    borderRadius: 120,
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4AD8FF',
    borderRadius: 120,
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontFamily: 'Pretendard-SemiBold',
    color: COLORS.white,
    fontSize: 14,
    letterSpacing: 14 * -0.025,
  },
  progressValue: {
    fontFamily: 'Pretendard-Medium',
    color: COLORS.white,
    fontSize: 14,
    letterSpacing: 14 * -0.025,
  },
  accumulateContainer: {
    marginBottom: 24,
  },
  accumulateLabel: {
    fontFamily: 'Pretendard-SemiBold',
    color: '#EDF1FF',
    fontSize: 14,
    marginBottom: 4,
    letterSpacing: 14 * -0.025,
  },
  accumulateValueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  accumulateNumber: {
    fontFamily: 'Pretendard-SemiBold',
    color: COLORS.white,
    fontSize: 40,
    lineHeight: 48,
    letterSpacing: 40 * -0.025,
  },
  accumulateUnit: {
    fontFamily: 'Pretendard-SemiBold',
    color: COLORS.white,
    fontSize: 16,
    marginBottom: 6, // 숫자와 라인을 맞추기 위함
    letterSpacing: 16 * -0.025,
  },
  trendIconContainer: {
    position: 'absolute',
    right: 24,
    top: 24, 
    width: 66,
    height: 66,
    backgroundColor: '#3F5DC8',
    borderRadius: 33,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 통계 카드 (연속 기록 & 달성도) 스타일
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 16,
    gap: 12,
  },
  statHeader: {
    gap: 8,
  },
  iconCircle: {
    width: 40,
    height: 40,
    backgroundColor: '#EDF1FF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statLabel: {
    fontFamily: 'Pretendard-Medium',
    color: COLORS.gray,
    fontSize: 14,
    letterSpacing: 14 * -0.025,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  statNumber: {
    fontFamily: 'Pretendard-SemiBold',
    color: COLORS.black,
    fontSize: 28,
    lineHeight: 34,
  },
  statUnit: {
    fontFamily: 'Pretendard-SemiBold',
    color: COLORS.black,
    fontSize: 16,
    marginBottom: 2,
  },

  // 알림 리스트 스타일
  notificationSection: {
    gap: 12,
  },
  sectionTitle: {
    ...TYPOGRAPHY.sectionTitle,
  },
  notificationBox: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 18,
  },
  notiItem: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  notiContent: {
    flex: 1,
    gap: 4,
  },
  notiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  notiCategory: {
    fontFamily: 'Pretendard-Medium',
    color: COLORS.gray,
    fontSize: 11,
    flex: 1,
    marginRight: 8,
    letterSpacing: 11 * -0.025,
  },
  notiTime: {
    fontFamily: 'Pretendard-Medium',
    color: COLORS.gray,
    fontSize: 10,
    letterSpacing: 10 * -0.025,
  },
  notiDescription: {
    fontFamily: 'Pretendard-Medium',
    color: COLORS.gray,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 13 * -0.025,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 16,
  },
});