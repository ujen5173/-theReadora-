import Header from "../_components/layouts/header";
import SettingsNavigation from "../_components/layouts/settings/navigation";

const Settings = async ({
  searchParams,
}: {
  searchParams: Promise<{ tab: string }>;
}) => {
  const { tab } = await searchParams;

  return (
    <>
      <Header
        background={false}
        removeBackground
        headerExtraStyle="border-b border-border shadow-sm"
      />
      <div className="w-full">
        <div className="max-w-[1440px] mx-auto px-4 py-12">
          <SettingsNavigation tab={tab} />
        </div>
      </div>
    </>
  );
};

export default Settings;
