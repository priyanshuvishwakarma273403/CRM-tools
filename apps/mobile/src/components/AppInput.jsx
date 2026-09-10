import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { RADIUS, SPACING, TYPOGRAPHY } from '../theme';

export function AppInput({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  onRightIconPress,
  multiline = false,
  numberOfLines = 1,
  style,
  containerStyle,
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, TYPOGRAPHY.caption]}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          multiline && { height: 'auto', minHeight: 80, alignItems: 'flex-start' },
          isFocused && styles.focused,
          error && styles.errorInput,
        ]}
      >
        {LeftIcon && <LeftIcon size={20} color={COLORS.neutral[400]} style={styles.leftIcon} />}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.neutral[400]}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={numberOfLines}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[styles.input, TYPOGRAPHY.body, style]}
        />
        {RightIcon && (
          <RightIcon
            size={20}
            color={COLORS.neutral[400]}
            onPress={onRightIconPress}
            style={styles.rightIcon}
          />
        )}
      </View>
      {error && <Text style={[styles.errorText, TYPOGRAPHY.caption]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
    width: '100%',
  },
  label: {
    color: COLORS.neutral[700],
    marginBottom: SPACING.xs,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.neutral[300],
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
  },
  focused: {
    borderColor: COLORS.primary[600],
    borderWidth: 1.5,
  },
  errorInput: {
    borderColor: COLORS.danger[500],
  },
  input: {
    flex: 1,
    color: COLORS.neutral[900],
    paddingVertical: SPACING.xs,
  },
  leftIcon: {
    marginRight: SPACING.sm,
  },
  rightIcon: {
    marginLeft: SPACING.sm,
  },
  errorText: {
    color: COLORS.danger[500],
    marginTop: SPACING.xs,
  },
});
