import { useUpdatePantryStock } from '@/lib/api/pantries';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

const DEBOUNCE_MS = 800;

interface Props {
  pantryId: string;
  sku: string;
  stock: number;
}

export function StockStepper({ pantryId, sku, stock }: Props) {
  const updateStock = useUpdatePantryStock();
  const [value, setValue] = useState(stock);

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pending = useRef(false); // a local change is not yet confirmed by the server
  const target = useRef(stock); // latest value we intend to persist
  const serverRef = useRef(stock);
  serverRef.current = stock;

  // server reflects target
  useEffect(() => {
    if (pending.current) {
      if (stock === target.current) pending.current = false;
      return;
    }
    setValue(stock);
  }, [stock]);

  const flush = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    if (!pending.current) return;
    updateStock.mutate(
      { pantryId, sku, stock: target.current },
      {
        onError: () => {
          pending.current = false;
          setValue(serverRef.current);
        },
      }
    );
  }, [pantryId, sku, updateStock]);

  const flushRef = useRef(flush);
  flushRef.current = flush;

  // flush any pending change if the row unmounts mid-edit.
  useEffect(() => () => flushRef.current(), []);

  function step(delta: number) {
    const next = Math.max(0, value + delta);
    if (next === value) return;
    setValue(next);
    target.current = next;
    pending.current = true;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => flushRef.current(), DEBOUNCE_MS);
  }

  return (
    <View className="flex-row items-center gap-1">
      <Pressable
        className="w-7 h-7 rounded-lg bg-stone dark:bg-[#2E2E2C] items-center justify-center active:opacity-60"
        disabled={value === 0}
        onPress={() => step(-1)}
      >
        <Text className="text-[16px] font-light text-ink dark:text-[#F2F0EB] leading-none">−</Text>
      </Pressable>

      <View className="w-8 items-center">
        <Text className="text-[13px] font-bold text-ink dark:text-[#F2F0EB]">{value}</Text>
      </View>

      <Pressable
        className="w-7 h-7 rounded-lg bg-stone dark:bg-[#2E2E2C] items-center justify-center active:opacity-60"
        onPress={() => step(1)}
      >
        <Text className="text-[16px] font-light text-ink dark:text-[#F2F0EB] leading-none">+</Text>
      </Pressable>
    </View>
  );
}
