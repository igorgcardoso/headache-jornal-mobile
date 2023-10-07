import { Header } from '@components/Header';
import { Link as LinkExpo } from 'expo-router';
import { Text, View } from 'react-native';

interface LinkProps {
  href: string;
  text: string;
}

function Link({ href, text }: LinkProps) {
  return (
    <LinkExpo
      href={href}
      className="w-full items-center justify-center bg-slate-500 p-4"
    >
      <Text className="text-lg font-bold leading-relaxed text-white">
        {text}
      </Text>
    </LinkExpo>
  );
}

export default function Misc() {
  return (
    <View className="flex-1 bg-slate-800">
      <Header title="Misc" />
      <View className="mt-10 space-y-4">
        <Link href="/remedy" text="Remedies" />
        <Link href="/food" text="Foods" />
        <Link href="/drink" text="Drinks" />
      </View>
    </View>
  );
}
