import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/colors';

// title: 버튼에 들어갈 글자
// onPress: 버튼을 눌렀을 때 실행할 함수
// style: 혹시 나중에 마진이나 너비 등을 덮어쓰고 싶을 때 쓸 추가 스타일
export default function CustomButton({ title, onPress, style }) {
  return (
    <TouchableOpacity 
      style={[styles.button, style]} // 기본 스타일 + 추가 스타일 합치기
      onPress={onPress}
      activeOpacity={0.8} // 눌렀을 때 살짝 투명해지는 효과 (기본값보다 조금 더 또렷하게)
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 320,               
    height: 48,               
    backgroundColor: COLORS.primary, // 메인 블루 컬러
    borderRadius: 8,          // 모서리 둥글기
    justifyContent: 'center', // 세로 중앙 정렬
    alignItems: 'center',     // 가로 중앙 정렬
  },
  text: {
    fontFamily: 'Pretendard-SemiBold', // SemiBold 폰트
    color: COLORS.white,               // 화이트 텍스트
    fontSize: 14,                      // 일반적인 버튼 폰트 사이즈
    letterSpacing: 14 * -0.025,        // 자간 -2.5%
  },
});