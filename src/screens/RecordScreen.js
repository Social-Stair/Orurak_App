// src/screens/RecordScreen.js
import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { TYPOGRAPHY } from '../constants/typography';

// 임시 데이터 (데이터 불러오기)
const JOURNAL_DATA = [
  {
    id: '1',
    date: '5월 8일',
    score: 7,
    lastModified: '2026.05.08',
  },
  {
    id: '2',
    date: '5월 7일',
    score: 3,
    lastModified: '2026.05.08',
  },
];

export default function RecordScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        
        {/* 1. 상단 헤더 영역 (타이틀 + 작성하기 버튼) */}
        <View style={styles.headerRow}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.subHeader}>기록 모음</Text>
            <Text style={styles.mainHeader}>성찰 일지 목록</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.writeButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('RecordWrite')}
          >
            <Text style={styles.writeButtonText}>작성하기</Text>
          </TouchableOpacity>
        </View>

        {/* 2. 성찰 일지 카드 리스트 영역 */}
        <View style={styles.listContainer}>
          {JOURNAL_DATA.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.card}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('RecordDetail')}
            >
              <View style={styles.cardContent}>
                {/* 만족도 */}
                <View style={styles.scoreRow}>
                  <Text style={styles.scoreLabel}>만족도</Text>
                  <Text style={styles.scoreValue}>{item.score}</Text>
                </View>
                
                {/* 일지 제목 */}
                <Text style={styles.cardTitle}>{item.date} 성찰 일지</Text>
                
                {/* 마지막 수정 시간 */}
                <View style={styles.dateRow}>
                  <Text style={styles.dateLabel}>마지막 수정 시간</Text>
                  <Text style={styles.dateValue}>{item.lastModified}</Text>
                </View>
              </View>

              {/* 우측 화살표 아이콘 */}
              <Feather name="chevron-right" size={24} color={COLORS.black} />
            </TouchableOpacity>
          ))}
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
  
  // 헤더 스타일
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  headerTextContainer: {
    gap: 2,
  },
  subHeader: {
    ...TYPOGRAPHY.subHeader,
  },
  mainHeader: {
    ...TYPOGRAPHY.mainHeader,
  },
  writeButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4, 
  },
  writeButtonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14,
    color: COLORS.white,
    letterSpacing: 14 * -0.025,
  },

  // 일지 리스트 & 카드 스타일
  listContainer: {
    gap: 16, // 카드들 사이의 간격
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#0D2C75',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 2,
  },
  cardContent: {
    gap: 6,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scoreLabel: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14,
    color: COLORS.primary,
    letterSpacing: 14 * -0.025,
  },
  scoreValue: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14,
    letterSpacing: 14 * -0.025,
    color: COLORS.primary,
  },
  cardTitle: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    letterSpacing: 16 * -0.025,
    color: COLORS.black,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateLabel: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 12,
    color: COLORS.gray,
    letterSpacing: 12 * -0.025,
  },
  dateValue: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 12,
    color: COLORS.gray,
    letterSpacing: 12 * -0.025,
  },
});