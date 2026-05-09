import React from 'react';
import {
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// Expo 기본 아이콘 라이브러리 사용
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

// 1단계에서 저장한 캐릭터 이미지 불러오기
const characterImage = require('../../assets/images/character-shadow.png');

export default function StartScreen({ navigation }) {
  return (
    // 배경색을 메인 컬러(primary)로 꽉 채움
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        {/* 1. 캐릭터 이미지 영역 (그림자 포함) */}
        <View style={styles.imageShadow}>
          <Image 
            source={characterImage} 
            style={styles.character} 
            resizeMode="contain" 
          />
        </View>

        {/* 2. 환영 텍스트 영역 */}
        <View style={styles.textContainer}>
          <Text style={styles.welcomeTitle}>
            오르락 팀원이 되신 걸{'\n'}환영합니다!
          </Text>
          <Text style={styles.welcomeSubtitle}>
            지금부터 여러분은 각자 계단 이용 목표를{'\n'}
            달성함과 동시에 팀을 이뤄서 공동의{'\n'}
            목표를 달성하게 됩니다.
          </Text>
        </View>

        {/* 3. 목표 설정 이동 버튼 (둥근 알약 모양) */}
        <TouchableOpacity
          style={styles.startButton}
          // 나중에 만들 목표 설정(Start) 화면으로 이동
          onPress={() => navigation.navigate('Start')} 
          activeOpacity={0.8}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>목표 설정 시작</Text>
            {/* 파란색 우측 화살표 아이콘 */}
            <Feather name="chevron-right" size={24} color={COLORS.primary} />
          </View>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary, // 파란색 배경
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 34,
  },
  imageShadow: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 48,
  },
  character: {
    width: 178,
    height: 192,
  },
  textContainer: {
    alignItems: 'center',
    gap: 24,
    marginBottom: 48, // 버튼과의 간격
  },
  welcomeTitle: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 28,
    lineHeight: 39.2,
    color: COLORS.white,
    textAlign: 'center',
    letterSpacing: 28 * -0.025,
  },
  welcomeSubtitle: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    lineHeight: 22.4,
    color: '#CEDFFF',
    textAlign: 'center',
    letterSpacing: 16 * -0.025,
  },
  startButton: {
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    paddingLeft: 16,
    paddingRight: 12,
    borderRadius: 120,
    shadowColor: '#0D2C75',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  buttonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    color: COLORS.primary,
    letterSpacing: 18 * -0.025,
  },
});