import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// 아이콘 라이브러리 불러오기
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { TYPOGRAPHY } from '../constants/typography';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* 1. 상단 환영 인사 영역 */}
        <View style={styles.headerContainer}>
          {/* 로그인한 유저의 이름 변수가 들어갈 자리 */}
          <Text style={styles.subHeader}>어서오세요, 여지훈님</Text>
          <Text style={styles.mainHeader}>오늘도 계단 한 층 더!</Text>
        </View>

        {/* 2. 주간 목표 카드 (파란색 메인 카드) */}
        <View style={styles.goalCard}>
          
          
          <View style={styles.accumulateContainer}>
            <Text style={styles.accumulateLabel}>이번 주 누적</Text>
            <View style={styles.accumulateValueRow}>
              <Text style={styles.accumulateNumber}>12</Text>
              <Text style={styles.accumulateUnit}>층</Text>
            </View>
          </View>

          
          <View style={styles.trendIconContainer}>
            <Feather name="trending-up" size={24} color={COLORS.white} />
          </View>

          
          <View style={styles.progressContainer}>
            <View style={styles.progressBackground}>
              <View style={[styles.progressFill, { width: '40%' }]} />
            </View>
            <View style={styles.progressTextRow}>
              <Text style={styles.progressLabel}>주간 목표</Text>
              <Text style={styles.progressValue}>6/15층</Text>
            </View>
          </View>
          
        </View>

        {/* 3. 통계 카드 (연속 기록 & 달성도) */}
        <View style={styles.statsRow}>
          {/* 연속 기록 카드 */}
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <View style={styles.iconCircle}>
                <Feather name="calendar" size={20} color={COLORS.primary} />
              </View>
              <Text style={styles.statLabel}>연속 기록</Text>
            </View>
            <View style={styles.statValueRow}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statUnit}>일</Text>
            </View>
          </View>

          {/* 달성도 카드 */}
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <View style={styles.iconCircle}>
                <Feather name="award" size={20} color={COLORS.primary} />
              </View>
              <Text style={styles.statLabel}>지난 주 달성도</Text>
            </View>
            <View style={styles.statValueRow}>
              <Text style={styles.statNumber}>20</Text>
              <Text style={styles.statUnit}>%</Text>
            </View>
          </View>
        </View>

        {/* 4. 알림 리스트 영역 */}
        <View style={styles.notificationSection}>
          <Text style={styles.sectionTitle}>성찰 일지 알림</Text>
          
          <View style={styles.notificationBox}>
            {/* 알림 아이템 1 (에러/경고) */}
            <View style={styles.notiItem}>
              <Feather name="alert-triangle" size={18} color="#F24242" />
              <View style={styles.notiContent}>
                <View style={styles.notiHeader}>
                  <Text style={styles.notiCategory}>성찰 일지를 작성해주세요!</Text>
                  <Text style={styles.notiTime}>3시간</Text>
                </View>
                <Text style={styles.notiDescription}>05.06(월) 성찰 일지를 작성하지 않았습니다</Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* 알림 아이템 2 (일반 알림) */}
            <View style={styles.notiItem}>
              <Feather name="bell" size={18} color="#F5BF35" />
              <View style={styles.notiContent}>
                <View style={styles.notiHeader}>
                  <Text style={styles.notiCategory}>이번 주 엘리베이터 대신 계단을 이용해 볼까요?</Text>
                  <Text style={styles.notiTime}>10시간</Text>
                </View>
                <Text style={styles.notiDescription}>
                  계단 이용은 별도의 운동 시간 없이 신체 활동을 늘리는 효과적인 방법입니다. (Eves & Webb, 2006)
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* 알림 아이템 3 (일반 알림) */}
            <View style={styles.notiItem}>
              <Feather name="bell" size={18} color="#F5BF35" />
              <View style={styles.notiContent}>
                <View style={styles.notiHeader}>
                  <Text style={styles.notiCategory}>오늘은 계단을 이용해 스트레칭을 해보시면 어떨까요?</Text>
                  <Text style={styles.notiTime}>어제</Text>
                </View>
                <Text style={styles.notiDescription}>
                  계단을 활용한 스트레칭 사진을 연구원에게 보내주세요. 작은 선물이 있을지도~?😉
                </Text>
              </View>
            </View>
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
    color: COLORS.black,
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