import { COLORS } from './colors';

export const TYPOGRAPHY = {
  // 1. 페이지 최상단 서브 헤더 (Medium, 16px, Gray)
  subHeader: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    color: COLORS.gray,
    letterSpacing: -0.4, // 16 * -0.025
  },
  // 2. 메인 헤더 (SemiBold, 20px, Black)
  mainHeader: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 20,
    color: COLORS.black,
    letterSpacing: -0.5, // 20 * -0.025
  },
  // 3. 섹션 제목 (SemiBold, 16px, Black)
  sectionTitle: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    color: COLORS.black,
    letterSpacing: -0.4, // 16 * -0.025
  },
  // 4. 인풋 플레이스홀더 (Medium, 14px, Gray)
  placeholder: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    color: COLORS.gray,
    letterSpacing: -0.35, // 14 * -0.025
  },
};