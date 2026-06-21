import { usePantryContext } from '@/context/PantryContext';
import { useLeavePantry, usePantryMembers, usePromotePantryMember } from '@/lib/api/pantries';
import type { Pantry } from '@/types/pantry';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

interface Props {
  pantry: Pantry;
  onClose: () => void;
}

type Mode = 'solo' | 'pickAdmin' | 'regular';

export function LeavePantryModal({ pantry, onClose }: Props) {
  const { user } = useUser();
  const { activePantryId, setActivePantryId } = usePantryContext();
  const { data: members, isLoading, isError, refetch } = usePantryMembers(pantry.id);
  const leave = useLeavePantry();
  const promote = usePromotePantryMember();

  const [selectedNewAdmin, setSelectedNewAdmin] = useState<string | null>(null);
  const [forceAdminPick, setForceAdminPick] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Derived from the member list + the current user, decided before any call.
  const currentUserId = user?.id;
  const all = members ?? [];
  const memberCount = all.length;
  const admins = all.filter((m) => m.is_admin);
  const otherMembers = all.filter((m) => m.user_id !== currentUserId);
  const isOnlyMember = memberCount === 1;
  const isCurrentAdmin = all.some((m) => m.user_id === currentUserId && m.is_admin);
  const isLastAdmin = isCurrentAdmin && admins.length === 1;

  const mode: Mode =
    forceAdminPick || (isLastAdmin && !isOnlyMember) ? 'pickAdmin' : isOnlyMember ? 'solo' : 'regular';

  const inFlight = leave.isPending || promote.isPending;

  function finishLeft() {
    // If we just left the active pantry, drop the stale active id.
    if (activePantryId === pantry.id) setActivePantryId(null);
    onClose();
  }

  function handleError(e: unknown) {
    const status = (e as { status?: number }).status;
    const message = e instanceof Error ? e.message : '';
    // Stale member list — server says we're the last admin. Re-fetch and switch
    // to the "choose a new admin" flow.
    if (status === 409 && message === 'last_admin_must_promote') {
      setForceAdminPick(true);
      setErrorMsg('Debes asignar un nuevo administrador antes de salir.');
      refetch();
      return;
    }
    // Already not a member (left from another device) — treat as success.
    if (status === 403) {
      finishLeft();
      return;
    }
    setErrorMsg(message || 'Ocurrió un error. Intenta de nuevo.');
  }

  async function doLeave() {
    setErrorMsg(null);
    try {
      await leave.mutateAsync(pantry.id);
      await finishLeft();
    } catch (e) {
      handleError(e);
    }
  }

  async function doPromoteThenLeave() {
    if (!selectedNewAdmin) return;
    setErrorMsg(null);
    try {
      await promote.mutateAsync({ pantryId: pantry.id, userId: selectedNewAdmin });
      await leave.mutateAsync(pantry.id);
      await finishLeft();
    } catch (e) {
      handleError(e);
    }
  }

  return (
    <View className="absolute inset-0 bg-black/40 items-center justify-center px-5">
      <View className="w-full rounded-2xl bg-white dark:bg-[#1E1E1C] p-4">
        {isLoading ? (
          <View className="py-8 items-center">
            <ActivityIndicator />
          </View>
        ) : isError ? (
          <>
            <Text className="text-[16px] font-semibold text-ink dark:text-[#F2F0EB] mb-2">
              No pudimos cargar los integrantes
            </Text>
            <Text className="text-[13px] text-pebble mb-4">
              Revisa tu conexión e intenta de nuevo.
            </Text>
            <View className="flex-row gap-2">
              <Pressable
                className="flex-1 py-3 rounded-xl bg-stone dark:bg-[#2E2E2C] items-center"
                onPress={onClose}
              >
                <Text className="text-pebble font-medium">Cerrar</Text>
              </Pressable>
              <Pressable
                className="flex-1 py-3 rounded-xl bg-forest dark:bg-mint items-center"
                onPress={() => refetch()}
              >
                <Text className="text-cream dark:text-[#161614] font-semibold">Reintentar</Text>
              </Pressable>
            </View>
          </>
        ) : mode === 'solo' ? (
          <>
            <Text className="text-[16px] font-semibold text-ink dark:text-[#F2F0EB] mb-2">
              Salir de «{pantry.name}»
            </Text>
            <Text className="text-[13px] text-pebble mb-4">
              Eres el único integrante. Al salir, esta despensa y todos sus datos se eliminarán
              permanentemente.
            </Text>
            {errorMsg && <Text className="text-expired text-[12px] mb-3">{errorMsg}</Text>}
            <View className="flex-row gap-2">
              <Pressable
                className="flex-1 py-3 rounded-xl bg-stone dark:bg-[#2E2E2C] items-center"
                disabled={inFlight}
                onPress={onClose}
              >
                <Text className="text-pebble font-medium">Cancelar</Text>
              </Pressable>
              <Pressable
                className="flex-1 py-3 rounded-xl bg-expired items-center"
                disabled={inFlight}
                onPress={doLeave}
              >
                {inFlight ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-semibold">Eliminar y salir</Text>
                )}
              </Pressable>
            </View>
          </>
        ) : mode === 'pickAdmin' ? (
          <>
            <Text className="text-[16px] font-semibold text-ink dark:text-[#F2F0EB] mb-1">
              Elige un nuevo administrador
            </Text>
            <Text className="text-[13px] text-pebble mb-3">
              Eres el último administrador. Asigna a alguien antes de salir de «{pantry.name}».
            </Text>
            {otherMembers.map((m) => {
              const selected = selectedNewAdmin === m.user_id;
              return (
                <Pressable
                  key={m.user_id}
                  className={`flex-row items-center justify-between px-3 py-3 rounded-xl mb-2 ${
                    selected ? 'bg-mist dark:bg-[#0D2B1A]' : 'bg-stone dark:bg-[#2E2E2C]'
                  }`}
                  disabled={inFlight}
                  onPress={() => setSelectedNewAdmin(m.user_id)}
                >
                  <Text className="text-ink dark:text-[#F2F0EB] font-medium">{m.nickname}</Text>
                  {selected && <Ionicons name="checkmark-circle" size={18} color="#2D6A4F" />}
                </Pressable>
              );
            })}
            {errorMsg && <Text className="text-expired text-[12px] mb-3 mt-1">{errorMsg}</Text>}
            <View className="flex-row gap-2 mt-1">
              <Pressable
                className="flex-1 py-3 rounded-xl bg-stone dark:bg-[#2E2E2C] items-center"
                disabled={inFlight}
                onPress={onClose}
              >
                <Text className="text-pebble font-medium">Cancelar</Text>
              </Pressable>
              <Pressable
                className={`flex-1 py-3 rounded-xl items-center ${
                  selectedNewAdmin ? 'bg-expired' : 'bg-stone dark:bg-[#2E2E2C]'
                }`}
                disabled={!selectedNewAdmin || inFlight}
                onPress={doPromoteThenLeave}
              >
                {inFlight ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text
                    className={selectedNewAdmin ? 'text-white font-semibold' : 'text-pebble font-medium'}
                  >
                    Asignar y salir
                  </Text>
                )}
              </Pressable>
            </View>
          </>
        ) : (
          <>
            <Text className="text-[16px] font-semibold text-ink dark:text-[#F2F0EB] mb-2">
              Salir de «{pantry.name}»
            </Text>
            <Text className="text-[13px] text-pebble mb-4">
              Dejarás de tener acceso a esta despensa. Podrás volver a unirte con el código.
            </Text>
            {errorMsg && <Text className="text-expired text-[12px] mb-3">{errorMsg}</Text>}
            <View className="flex-row gap-2">
              <Pressable
                className="flex-1 py-3 rounded-xl bg-stone dark:bg-[#2E2E2C] items-center"
                disabled={inFlight}
                onPress={onClose}
              >
                <Text className="text-pebble font-medium">Cancelar</Text>
              </Pressable>
              <Pressable
                className="flex-1 py-3 rounded-xl bg-expired items-center"
                disabled={inFlight}
                onPress={doLeave}
              >
                {inFlight ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-semibold">Salir</Text>
                )}
              </Pressable>
            </View>
          </>
        )}
      </View>
    </View>
  );
}
