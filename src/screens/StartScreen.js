import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { TYPOGRAPHY } from '../constants/typography';

import { setGoal } from '../api/socialStairApi';

const goalImage = require('../../assets/images/goal.png');

export default function StartScreen({ navigation }) {
  // 목표 층수 상태 관리 (기본값 1층)
  const [floorCount, setFloorGoal] = useState(1);
  const [loading, setLoading] = useState(false); // 로딩 상태 관리

  const handleMinus = () => {
    // 1층 밑으로는 내려가지 않도록 방지
    if (floorCount > 1) {
      setFloorGoal(floorCount - 1);
    }
  };

  const handlePlus = () => {
    setFloorGoal(floorCount + 1);
  };

  const handleStart = async () => {
    setLoading(true); // 로딩 시작
    try {
      // 1. 백엔드로 목표 층수 전송
      await setGoal(floorCount);
      
      console.log('목표 설정 성공:', floorCount);

      // 2. 성공 시 메인 화면(홈)으로 이동
      navigation.replace('MainTab'); 
    } catch (error) {
      console.error('목표 설정 실패:', error);
      Alert.alert('오류', '목표를 설정하는 중 문제가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        {/* 1. 상단 타이틀 영역 */}
        <View style={styles.headerContainer}>
          <Text style={styles.subHeader}>목표 설정</Text>
          <Text style={styles.mainHeader}>이번 주 목표 층수</Text>
        </View>

        {/* 2. 중앙 캐릭터 이미지 영역 */}
        <View style={styles.imageContainer}>
          <View style={styles.imageShadow}>
            <Image 
              source={goalImage} 
              style={styles.character} 
              resizeMode="contain" 
            />
          </View>
        </View>

        {/* 3. 질문 및 서브 타이틀 영역 */}
        <View style={styles.textContainer}>
          <Text style={styles.questionText}>
            앞으로 일주일 동안 총 몇 층{'\n'}오르는 것을 <Text style={styles.highlightText}>목표</Text>로 하시겠어요?
          </Text>
          <Text style={styles.subtitleText}>지난 주 계단 이용률은 확인하셨나요?</Text>
        </View>

        {/* 4. 숫자 조절(카운터) 영역 */}
        <View style={styles.counterWrapper}>
          <View style={styles.counterContainer}>
            {/* 마이너스 버튼 */}
            <TouchableOpacity style={styles.iconButton} onPress={handleMinus} activeOpacity={0.7}>
              <Feather name="minus" size={24} color={COLORS.black} />
            </TouchableOpacity>
            
            {/* 현재 숫자 */}
            <Text style={styles.countText}>{floorCount}</Text>
            
            {/* 플러스 버튼 */}
            <TouchableOpacity style={styles.iconButton} onPress={handlePlus} activeOpacity={0.7}>
              <Feather name="plus" size={24} color={COLORS.black} />
            </TouchableOpacity>
          </View>
          <Text style={styles.unitText}>층</Text>
        </View>

        {/* 5. 시작하기 버튼 */}
        <View style={styles.actionContainer}>
        <TouchableOpacity 
            style={[styles.startButton, loading && { backgroundColor: COLORS.gray }]} 
            onPress={handleStart}
            activeOpacity={0.8}
            disabled={loading} // 로딩 중에는 중복 클릭 방지
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.startButtonText}>지금 시작하기</Text>
            )}
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background, 
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerContainer: {
    paddingTop: 68, 
    gap: 2,         
  },
  subHeader: {
    ...TYPOGRAPHY.subHeader,
  },
  mainHeader: {
    ...TYPOGRAPHY.mainHeader,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 120,
    marginBottom: -30, 
  },
  imageShadow: {
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 9999,
  },
  character: {
    width: 400,
    height: 400,
  },
  textContainer: {
    alignItems: 'center',
    gap: 20, 
  },
  questionText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 24,
    lineHeight: 33.6,
    letterSpacing: 24 * -0.025,
    color: COLORS.black,
    textAlign: 'center',
  },
  highlightText: {
    color: '#3B57BC', 
    fontFamily: 'Pretendard-Bold',
  },
  subtitleText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    lineHeight: 22.4,
    letterSpacing: 16 * -0.025,
    color: COLORS.gray,
    textAlign: 'center',
  },
  counterWrapper: {
    alignItems: 'center',
    marginTop: 18,
    gap: 4, 
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 300, 
  },
  iconButton: {
    width: 48,
    height: 48,
    backgroundColor: COLORS.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0D2C75',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.05,
    shadowRadius: 24,
    elevation: 3,
  },
  countText: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 60,
    lineHeight: 84,
    color: COLORS.primary,
    textAlign: 'center',
    letterSpacing: 60 * -0.025,
  },
  unitText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 20,
    lineHeight: 28,
    color: COLORS.gray,
    letterSpacing: 20 * -0.025,
  },
  actionContainer: {
    marginTop: 24, 
    marginBottom: 40, 
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24, 
    borderRadius: 120,   
    shadowColor: '#0D2C75',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  startButtonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    lineHeight: 25.2,
    letterSpacing: 18 * -0.025,
    color: COLORS.white,
    textAlign: 'center',
  },
});