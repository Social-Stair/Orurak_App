import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';

import { COLORS } from '../constants/colors';
import { TYPOGRAPHY } from '../constants/typography';

import { getHomeStats } from '../api/socialStairApi';

export default function StatusScreen() {
  // 서버에서 받아올 상태(State) 관리
  const [totalMembers, setTotalMembers] = useState(0);
  const [sharedGoal, setSharedGoal] = useState({ currentFloors: 0, goalFloors: 0, achievementRate: 0 });
  const [membersList, setMembersList] = useState([]);
  const [loading, setLoading] = useState(true);

  // 화면이 포커스(보일 때)될 때마다 최신 현황 보이게
  useFocusEffect(
    useCallback(() => {
      const fetchStatusData = async () => {
        setLoading(true);
        try {
          const data = await getHomeStats();
          
          if (data) {
            // 1. 총 인원 세팅
            setTotalMembers(data.totalParticipants || 0);
            
            // 2. 공동 목표 세팅
            if (data.sharedGoal) {
              setSharedGoal({
                currentFloors: data.sharedGoal.currentFloors || 0,
                goalFloors: data.sharedGoal.goalFloors || 0,
                achievementRate: data.sharedGoal.achievementRate || 0,
              });
            }

            // 3. 팀원 개별 목록 세팅
            if (data.members) {
              setMembersList(data.members);
            }
          }
        } catch (error) {
          console.error("현황 데이터 불러오기 에러:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchStatusData();
    }, [])
  );

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

        {/* 로딩 중일 때 표시 */}
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
        ) : (
          /* 2. 랭킹 카드 전체 영역 */
          <View style={styles.cardContainer}>
            
            {/* 2-1. 상단 파란색 요약 헤더 */}
            <View style={styles.cardHeaderBlue}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.totalMemberText}>총 {totalMembers}명</Text>
                <Text style={styles.totalFloorText}>{sharedGoal.currentFloors} / {sharedGoal.goalFloors}층</Text>
              </View>
              
              {/* 전체 프로그레스 바 (100% 초과 방지) */}
              <View style={styles.totalProgressBg}>
                <View style={[styles.totalProgressFill, { width: `${Math.min(sharedGoal.achievementRate, 100)}%` }]}>
                  <View style={styles.totalProgressThumb} />
                </View>
              </View>
            </View>

            {/* 2-2. 하얀색 팀원 리스트 영역 */}
            <View style={styles.listContainer}>
              {membersList.length === 0 ? (
                <Text style={styles.emptyText}>참여 중인 팀원이 없습니다.</Text>
              ) : (
                membersList.map((member, index) => {
                  // 달성률 가져오기 (없으면 0)
                  const achievementRate = member.achievementRate || 0;

                  return (
                    <View key={member.userId || index} style={styles.memberRow}>
                      {/* 이름 & 층수 텍스트 */}
                      <View style={styles.memberTextRow}>
                        <Text style={styles.memberName}>{member.nickname}</Text>
                        <Text style={styles.memberScore}>
                          {member.currentFloors}/{member.goalFloors}층
                        </Text>
                      </View>
                      
                      {/* 개별 프로그레스 바 (100% 초과 방지) */}
                      <View style={styles.memberProgressBg}>
                        <View style={[styles.memberProgressFill, { width: `${Math.min(achievementRate, 100)}%` }]} />
                      </View>
                    </View>
                  );
                })
              )}
            </View>

          </View>
        )}

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
    paddingBottom: 24,
  },
  emptyText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
    paddingVertical: 20,
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