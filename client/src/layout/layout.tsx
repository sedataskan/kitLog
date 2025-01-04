import { SafeAreaView } from "react-native";
import { TopHeader } from "../components/topHeader";

export function Layout({ children, title }: any) {
  return (
    <SafeAreaView>
      <TopHeader
        title={title}
        avatarUrl="https://a1cf74336522e87f135f-2f21ace9a6cf0052456644b80fa06d4f.ssl.cf2.rackcdn.com/images/characters/large/800/Bella-Swan.Twilight.webp"
      />
      {children}
    </SafeAreaView>
  );
}
