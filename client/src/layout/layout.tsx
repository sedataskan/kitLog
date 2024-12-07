import { SafeAreaView } from "react-native";
import { TopHeader } from "../components/topHeader";
import AddButton from "../components/addButton";

export function Layout({ children, title }: any) {
  return (
    <SafeAreaView>
      {title === "Home" || title === "Library" ? <AddButton /> : null}
      <TopHeader
        title={title}
        avatarUrl="https://a1cf74336522e87f135f-2f21ace9a6cf0052456644b80fa06d4f.ssl.cf2.rackcdn.com/images/characters/large/800/Bella-Swan.Twilight.webp"
      />
      {children}
    </SafeAreaView>
  );
}
