import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { COLORS } from '../constants/colors';
import { TYPOGRAPHY } from '../constants/typography';

// 임시 데이터 (데이터 불러오기)
const TEAM_DATA = Array.from({ length: 10 }).map((_, index) => ({
  id: String(index + 1),
  name: '여지훈',
  current: 14,
  target: 16,
}));

export default function StatusScreen() {
  // 전체 통계 계산 (임시 하드코딩, 실제 데이터 연동 시 계산 로직 추가)
  const totalMembers = 10;
  const totalCurrentFloor = 80;
  const totalTargetFloor = 100;
  
  // 전체 진행률 퍼센트 계산
  const totalProgressPercent = (totalCurrentFloor / totalTargetFloor) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        
        {/* 1. 상단 타이틀 영역 */}
        <View style={styles.headerContainer}>
          <Text style={styles.subHeader}>집계 상황</Text>
          <Text style={styles.mainHeader}>오르락 팀원들의 실시간 목표 달성 현황</Text>
        </View>

        {/* 2. 랭킹 카드 전체 영역 */}
        <View style={styles.cardContainer}>
          
          {/* 2-1. 상단 파란색 요약 헤더 */}
          <View style={styles.cardHeaderBlue}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.totalMemberText}>총 {totalMembers}명</Text>
              <Text style={styles.totalFloorText}>{totalCurrentFloor} / {totalTargetFloor}층</Text>
            </View>
            
            {/* 전체 프로그레스 바 */}
            <View style={styles.totalProgressBg}>
              <View style={[styles.totalProgressFill, { width: `${totalProgressPercent}%` }]}>
                {/* 진행률 끝에 달린 하늘색 동그라미 */}
                <View style={styles.totalProgressThumb} />
              </View>
            </View>
          </View>

          {/* 2-2. 하얀색 팀원 리스트 영역 */}
          <View style={styles.listContainer}>
            {TEAM_DATA.map((member, index) => {
              // 개별 진행률 계산
              const memberProgress = (member.current / member.target) * 100;

              return (
                <View key={member.id} style={styles.memberRow}>
                  {/* 이름 & 층수 텍스트 */}
                  <View style={styles.memberTextRow}>
                    <Text style={styles.memberName}>{member.name}</Text>
                    <Text style={styles.memberScore}>
                      {member.current}/{member.target}층
                    </Text>
                  </View>
                  
                  {/* 개별 프로그레스 바 */}
                  <View style={styles.memberProgressBg}>
                    <View style={[styles.memberProgressFill, { width: `${memberProgress}%` }]} />
                  </View>
                </View>
              );
            })}
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
    marginBottom: 20,
    gap: 2,
  },
  subHeader: {
    ...TYPOGRAPHY.subHeader,
  },
  mainHeader: {
    ...TYPOGRAPHY.mainHeader,
  },

  /* 메인 카드 래퍼 */
  cardContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },

  /* 카드 상단 파란색 헤더 */
  cardHeaderBlue: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  totalMemberText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    color: COLORS.white,
  },
  totalFloorText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    color: COLORS.white,
  },
  
  /* 전체 프로그레스 바 스타일 */
  totalProgressBg: {
    height: 4,
    backgroundColor: '#EDF1FF',
    borderRadius: 2,
    position: 'relative',
    justifyContent: 'center',
  },
  totalProgressFill: {
    height: 4,
    backgroundColor: '#4AD8FF',
    borderRadius: 2,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  totalProgressThumb: {
    width: 8,
    height: 8,
    backgroundColor: '#4AD8FF',
    borderRadius: 4,
    position: 'absolute',
    right: -4,
    top: -2,
  },

  /* 하단 팀원 리스트 */
  listContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 16, 
  },
  memberRow: {
    gap: 6,
  },
  memberTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberName: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 12,
    color: COLORS.black,
    letterSpacing: 12 * 0.025,
  },
  memberScore: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 12,
    color: COLORS.primary,
    letterSpacing: 12 * 0.025,
  },
  
  /* 개별 프로그레스 바 스타일 */
  memberProgressBg: {
    height: 4,
    backgroundColor: '#EDF1FF',
    borderRadius: 2,
    position: 'relative',
  },
  memberProgressFill: {
    height: 4,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
    position: 'absolute',
    left: 0,
    top: 0,
  },
});