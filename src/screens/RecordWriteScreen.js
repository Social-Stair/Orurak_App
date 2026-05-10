import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

import { Feather } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import CustomButton from '../components/customButton';
import { COLORS } from '../constants/colors';
import { TYPOGRAPHY } from '../constants/typography';

import SuccessModal from '../components/SuccessModal';

import { createJournal, recordStairs, skipToday } from '../api/socialStairApi';

export default function RecordWriteScreen({ navigation }) {
    const [loading, setLoading] = useState(false);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [moveMethod, setMoveMethod] = useState('계단'); 

    const [recordTimes, setRecordTimes] = useState(['']); 
    
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
    const [currentTimeIndex, setCurrentTimeIndex] = useState(null);

    const [startFloor, setStartFloor] = useState('');
    const [endFloor, setEndFloor] = useState('');
    const [satisfaction, setSatisfaction] = useState(1);
    const [journalText, setJournalText] = useState('');
    const [withFriend, setWithFriend] = useState(false);

    // 모달 관리 상태들
    const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
    const [achievementRate, setAchievementRate] = useState(30); 
    const [modalTitle, setModalTitle] = useState('대단해요!');
    const [modalSubText, setModalSubText] = useState('삼성관 대학원생들의\n건강한 움직임을 응원합니다.\n지금의 좋은 기운을 유지해보세요!');

    const isStairs = moveMethod === '계단';
    const isNotWorking = moveMethod === '출근 안 함';

    const handleSelectMethod = (method) => {
        setMoveMethod(method);
        setIsDropdownOpen(false);
        
        if (method === '출근 안 함') {
        setRecordTimes(['']);
        setStartFloor('');
        setEndFloor('');
        setSatisfaction(1);
        setJournalText('');
        setWithFriend(false);
        } 
        else if (method === '엘리베이터') {
        setRecordTimes(['']);
        setStartFloor('');
        setEndFloor('');
        setWithFriend(false);
        }
    };

    const addTimeInput = () => {
        if (isStairs) setRecordTimes([...recordTimes, '']);
    };

    const removeTimeInput = (indexToRemove) => {
        const newTimes = recordTimes.filter((_, index) => index !== indexToRemove);
        setRecordTimes(newTimes);
    };

    const showTimePicker = (index) => {
        if (!isStairs) return;
        setCurrentTimeIndex(index);
        setTimePickerVisibility(true);
    };

    const hideTimePicker = () => {
        setTimePickerVisibility(false);
    };

    const handleConfirmTime = (date) => {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        const ampm = hours >= 12 ? '오후' : '오전';
        hours = hours % 12;
        hours = hours ? hours : 12; 
        minutes = minutes < 10 ? '0' + minutes : minutes;
        const strTime = `${ampm} ${hours}:${minutes}`;

        const newTimes = [...recordTimes];
        newTimes[currentTimeIndex] = strTime;
        setRecordTimes(newTimes);
        hideTimePicker();
    };

    const handleSubmit = async () => {
        // 1. 빈칸 검사 로직
        if (moveMethod === '계단') {
        const hasEmptyTime = recordTimes.some(time => time === '');
        if (hasEmptyTime || !startFloor || !endFloor || !journalText) {
            Alert.alert('알림', '시간, 층수, 성찰 일지를 모두 입력해주세요!');
            return; 
        }
        } else if (moveMethod === '엘리베이터') {
        if (!journalText) {
            Alert.alert('알림', '성찰 일지를 작성해주세요!');
            return;
        }
        }
        // '출근 안 함'은 검사할 빈칸이 없으므로 바로 통과

        setLoading(true);

        try {
        // 2. 선택한 이동 방법에 따른 API 호출
        if (moveMethod === '계단') {
            // [계단] 층수 기록 + 성찰 일지 작성
            const recordsPayload = recordTimes.map((time) => ({
            fromFloor: parseInt(startFloor, 10),
            toFloor: parseInt(endFloor, 10),
            time: time, 
            withColleague: withFriend
            }));

            const recordResponse = await recordStairs(recordsPayload); // 층수 기록
            await createJournal(journalText, parseInt(satisfaction, 10)); // 성찰 일지 등록

            // 달성률 업데이트
            setAchievementRate(recordResponse.achievementRate || 0);

            if (recordResponse.milestone) {
            setModalTitle(recordResponse.milestone.title);
            setModalSubText(recordResponse.milestone.body);
            } else {
            setModalTitle('수고하셨어요!');
            setModalSubText('오늘의 건강한 발걸음이 기록되었습니다.\n지금의 좋은 기운을 유지해보세요!');
            }

        } else if (moveMethod === '엘리베이터') {
            // [엘리베이터] 성찰 일지만 작성
            await createJournal(journalText, parseInt(satisfaction, 10));
            
            setModalTitle('일지 작성 완료');
            setModalSubText('오늘의 성찰 일지가 무사히 기록되었습니다.');
            setAchievementRate(0); // 모달에서 0%로 보이거나, 디자인에 맞게 처리

        } else if (moveMethod === '출근 안 함') {
            // [출근 안 함] skipToday API 호출
            await skipToday();
            
            setModalTitle('설정 완료');
            setModalSubText('오늘은 푹 쉬시고, 다음 출근 때 뵙겠습니다!');
            setAchievementRate(0);
        }

        // 3. 통신이 모두 성공하면 성공 모달 띄우기
        setSuccessModalVisible(true);

        } catch (error) {
            console.error("기록 등록 실패:", error);
            Alert.alert('에러', '기록을 등록하는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
            setLoading(false);
        }
    };

    const handleModalComplete = () => {
        setSuccessModalVisible(false);
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            
            <View style={styles.headerContainer}>
                <View>
                <Text style={styles.subHeader}>기록 작성</Text>
                <Text style={styles.mainHeader}>오늘의 오르락 기록</Text>
                </View>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                <Feather name="x" size={28} color={COLORS.black} />
                </TouchableOpacity>
            </View>

            <View style={styles.formContainer}>
                
                <View style={styles.inputGroup}>
                <Text style={styles.sectionTitle}>어떤 이동 방법을 선택하셨나요?</Text>
                <TouchableOpacity 
                    style={styles.dropdownBox} 
                    activeOpacity={0.8}
                    onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                    <Text style={styles.dropdownText}>{moveMethod}</Text>
                    <Feather name={isDropdownOpen ? "chevron-up" : "chevron-down"} size={24} color={COLORS.gray} />
                </TouchableOpacity>

                {isDropdownOpen && (
                    <View style={styles.dropdownList}>
                    {['계단', '엘리베이터', '출근 안 함'].map((method) => (
                        <TouchableOpacity 
                        key={method} 
                        style={styles.dropdownItem}
                        onPress={() => handleSelectMethod(method)}
                        >
                        <Text style={styles.dropdownItemText}>{method}</Text>
                        </TouchableOpacity>
                    ))}
                    </View>
                )}
                </View>

                <View style={styles.inputGroup}>
                <Text style={styles.sectionTitle}>언제 오르셨나요?</Text>
                
                {recordTimes.map((time, index) => (
                    <View key={index} style={styles.timeInputRow}>
                    <TouchableOpacity 
                        style={[styles.timeInputWrapper, !isStairs && styles.disabledInput]}
                        onPress={() => showTimePicker(index)}
                        disabled={!isStairs}
                    >
                        <Text style={[styles.timeInputText, !time && styles.placeholderText]}>
                        {time || "예) 오후 12:00"}
                        </Text>
                    </TouchableOpacity>
                    
                    {index === recordTimes.length - 1 ? (
                        <TouchableOpacity 
                        style={[styles.plusButton, !isStairs && { backgroundColor: COLORS.gray }]} 
                        onPress={addTimeInput}
                        disabled={!isStairs}
                        >
                        <Feather name="plus" size={24} color={COLORS.white} />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity 
                        style={styles.minusButton} 
                        onPress={() => removeTimeInput(index)}
                        >
                        <Feather name="minus" size={24} color={COLORS.white} />
                        </TouchableOpacity>
                    )}
                    </View>
                ))}

                <DateTimePickerModal
                    isVisible={isTimePickerVisible}
                    mode="time"
                    onConfirm={handleConfirmTime}
                    onCancel={hideTimePicker}
                    confirmTextIOS="확인"
                    cancelTextIOS="취소"
                />
                </View>

                <View style={styles.inputGroup}>
                <Text style={styles.sectionTitle}>몇 층부터 몇 층까지 계단을 오르셨나요?</Text>
                <View style={styles.floorInputRow}>
                    <TextInput
                    style={[styles.floorInput, !isStairs && styles.disabledInput]}
                    placeholder="예) 1층"
                    placeholderTextColor={COLORS.gray}
                    value={startFloor}
                    onChangeText={setStartFloor}
                    editable={isStairs}
                    keyboardType="numeric"
                    />
                    <Text style={styles.arrowText}>→</Text>
                    <TextInput
                    style={[styles.floorInput, !isStairs && styles.disabledInput]}
                    placeholder="예) 12층"
                    placeholderTextColor={COLORS.gray}
                    value={endFloor}
                    onChangeText={setEndFloor}
                    editable={isStairs}
                    keyboardType="numeric"
                    />
                </View>
                </View>

                <View style={styles.inputGroup}>
                <Text style={styles.sectionTitle}>이동 방법은 나의 의지에 따른 선택이었나요?</Text>
                <View style={styles.satisfactionWrapper}>
                    <Slider
                    style={styles.slider}
                    minimumValue={1}
                    maximumValue={7}
                    step={1}
                    value={satisfaction}
                    onValueChange={(val) => setSatisfaction(val)}
                    minimumTrackTintColor={COLORS.primary}
                    maximumTrackTintColor="#DBDEE6"
                    thumbTintColor={isNotWorking ? 'transparent' : COLORS.primary} 
                    disabled={isNotWorking} 
                    />
                    <View style={styles.satisfactionDotsRow}>
                    {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                        <Text key={num} style={styles.scoreNumber}>{num}</Text>
                    ))}
                    </View>
                    <View style={styles.satisfactionLabels}>
                    <Text style={styles.satisfactionLabel}>매우 아님</Text>
                    <Text style={styles.satisfactionLabel}>매우 그러함</Text>
                    </View>
                </View>
                </View>

                <View style={styles.inputGroup}>
                <Text style={styles.sectionTitle}>성찰 일지</Text>
                <TextInput
                    style={[styles.journalInput, isNotWorking && styles.disabledInput]}
                    placeholder="이 방법을 선택한 가장 큰 이유는 무엇인가요? 선택 이후 어떤 느낌이 드는지 자유롭게 적어주세요!"
                    placeholderTextColor={COLORS.gray}
                    multiline
                    textAlignVertical="top"
                    value={journalText}
                    onChangeText={setJournalText}
                    editable={!isNotWorking} 
                />
                
                {isStairs && (
                    <View style={styles.checkboxContainer}>
                    <TouchableOpacity 
                        style={styles.checkboxRow}
                        activeOpacity={0.8}
                        onPress={() => setWithFriend(!withFriend)}
                    >
                        <View style={[styles.checkbox, withFriend && styles.checkboxActive]}>
                        {withFriend && <Feather name="check" size={12} color={COLORS.white} />}
                        </View>
                        <Text style={styles.checkboxText}>친구와 함께 올랐어요!</Text>
                    </TouchableOpacity>
                    <Text style={styles.checkboxSubText}>
                        {"(계단 이용이 x2로 측정됩니다.\n연구원에게 인증 사진을 보내주세요!)"}
                    </Text>
                    </View>
                )}
                </View>

            </View>

            <View style={styles.actionContainer}>
                <CustomButton 
                title={loading ? "등록 중..." : "등록하기"}
                onPress={handleSubmit}
                disabled={loading}
                />
            </View>

            </ScrollView>
        </KeyboardAvoidingView>

        <SuccessModal 
            visible={isSuccessModalVisible}
            onClose={handleModalComplete}
            achievementRate={achievementRate}
            title={modalTitle}
            subText={modalSubText}
        />

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
    paddingBottom: 64,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', 
    marginBottom: 24,
  },
  subHeader: {
    ...TYPOGRAPHY.subHeader,
    marginBottom: 2,
  },
  mainHeader: {
    ...TYPOGRAPHY.mainHeader,
  },
  formContainer: {
    gap: 24,
  },
  inputGroup: {
    gap: 10,
    zIndex: 1, 
  },
  sectionTitle: {
    ...TYPOGRAPHY.sectionTitle,
  },
  dropdownBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  dropdownText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    color: COLORS.gray,
    letterSpacing: 14 * -0.025,
  },
  dropdownList: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    marginTop: -4, 
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  dropdownItemText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    color: COLORS.black,
    letterSpacing: 14 * -0.025,
  },
  timeInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeInputWrapper: {
    flex: 1,
    height: 48,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  timeInputText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    color: COLORS.black,
  },
  placeholderText: {
    color: COLORS.gray,
  },
  plusButton: {
    width: 48,
    height: 48,
    backgroundColor: COLORS.primary, 
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  minusButton: {
    width: 48,
    height: 48,
    backgroundColor: '#F24242', 
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledInput: {
    backgroundColor: '#DBDEE6', 
  },
  floorInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  floorInput: {
    flex: 1,
    height: 48,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    ...TYPOGRAPHY.placeholder,
    color: COLORS.black,
    textAlign: 'center',
  },
  arrowText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    color: COLORS.gray,
    marginHorizontal: 12,
  },
  satisfactionWrapper: {
    marginTop: 10,
    marginBottom: 12,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  satisfactionDotsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14, 
    marginTop: -4,
  },
  scoreNumber: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    color: COLORS.gray,
    letterSpacing: 14 * -0.025,
  },
  satisfactionLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  satisfactionLabel: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 12,
    color: COLORS.gray,
    letterSpacing: 12 * -0.025,
  },
  journalInput: {
    height: 145,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 16,
    ...TYPOGRAPHY.placeholder,
    color: COLORS.black,
  },
  checkboxContainer: {
    alignItems: 'center', 
    marginTop: 8,
    gap: 8,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  checkboxActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkboxText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14,
    color: COLORS.gray,
    letterSpacing: 14 * -0.025,
  },
  checkboxSubText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 12,
    color: COLORS.gray,
    letterSpacing: 14 * -0.025,
    textAlign: 'center', 
  },
  actionContainer: {
    marginTop: 24,
    alignItems: 'center', 
  },
});