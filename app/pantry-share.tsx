import { BackButton } from '@/components/BackButton';
import { usePantries } from '@/lib/api/pantries';
import { useThemeColors } from '@/hooks/useThemeColors';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Share, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function PantryShareScreen() {
  const { pantryId, pantryName } = useLocalSearchParams<{ pantryId: string; pantryName: string }>();
  const { primary, muted } = useThemeColors();
  const [copied, setCopied] = useState(false);

  const { data: pantries, isLoading } = usePantries();
  const idCode = pantries?.find((p) => p.id === pantryId)?.id_code ?? '';

  async function handleCopy() {
    if (!idCode) return;
    await Clipboard.setStringAsync(idCode);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  async function handleShare() {
    if (!idCode) return;
    await Share.share({
      message: `Únete a mi despensa${pantryName ? ` "${pantryName}"` : ''} con el código: ${idCode}`,
    });
  }

  return (
    <SafeAreaView className="flex-1 bg-cream dark:bg-[#161614]" edges={['top']}>
      <View className="px-5 pt-4">
        <BackButton />
      </View>

      <View className="flex-1 px-5 justify-center gap-6">
        {/* Header */}
        <View className="items-center gap-2">
          <View className="w-16 h-16 rounded-2xl bg-mist dark:bg-[#0D2B1A] items-center justify-center mb-2">
            <Ionicons name="people-outline" size={32} color={primary} />
          </View>
          <Text className="font-display text-[28px] text-ink dark:text-[#F2F0EB] text-center">
            Compartir despensa
          </Text>
          {pantryName ? (
            <Text className="text-[15px] font-medium text-forest dark:text-mint">{pantryName}</Text>
          ) : null}
          <Text className="text-[14px] text-pebble text-center" style={{ maxWidth: 280 }}>
            Comparte este código con quien quieras que se una a tu despensa.
          </Text>
        </View>

        {/* Code display */}
        <View className="items-center">
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <Pressable
              className="flex-row gap-2 active:opacity-70"
              onPress={handleCopy}
              accessibilityLabel="Copiar código"
            >
              {idCode.split('').map((char, i) => (
                <View
                  key={i}
                  className="w-12 h-14 rounded-xl bg-white dark:bg-[#1E1E1C] border border-stone dark:border-[#2E2E2C] items-center justify-center"
                  style={{ elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4 }}
                >
                  <Text className="text-[26px] font-bold text-ink dark:text-[#F2F0EB]">
                    {char}
                  </Text>
                </View>
              ))}
            </Pressable>
          )}

          {/* Copy feedback */}
          <View className="h-7 justify-center mt-3">
            {copied ? (
              <View className="flex-row items-center gap-1.5">
                <Ionicons name="checkmark-circle" size={16} color={primary} />
                <Text className="text-[13px] font-medium text-forest dark:text-mint">
                  ¡Código copiado!
                </Text>
              </View>
            ) : (
              <Text className="text-[12px] text-pebble">Toca el código para copiarlo</Text>
            )}
          </View>
        </View>

        {/* Action buttons */}
        <View className="gap-3">
          <Pressable
            className="flex-row items-center justify-center gap-2 bg-forest dark:bg-mint py-4 rounded-xl active:opacity-80"
            onPress={handleCopy}
            disabled={!idCode || isLoading}
          >
            <Ionicons
              name={copied ? 'checkmark-outline' : 'copy-outline'}
              size={18}
              color="#F2F0EB"
            />
            <Text className="text-cream dark:text-[#161614] font-semibold text-base">
              {copied ? 'Copiado' : 'Copiar código'}
            </Text>
          </Pressable>

          <Pressable
            className="flex-row items-center justify-center gap-2 border border-stone dark:border-[#2E2E2C] bg-white dark:bg-[#1E1E1C] py-4 rounded-xl active:opacity-70"
            onPress={handleShare}
            disabled={!idCode || isLoading}
          >
            <Ionicons name="share-social-outline" size={18} color={muted} />
            <Text className="text-ink dark:text-[#F2F0EB] font-semibold text-base">Compartir</Text>
          </Pressable>
        </View>

        {/* Info */}
        <View className="flex-row items-start gap-2 bg-stone dark:bg-[#1E1E1C] rounded-xl p-4">
          <Ionicons name="information-circle-outline" size={16} color={muted} style={{ marginTop: 1 }} />
          <Text className="flex-1 text-[12px] text-pebble leading-relaxed">
            Cualquiera con este código puede unirse como miembro. Puedes ver y gestionar los miembros desde los ajustes de tu despensa.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
