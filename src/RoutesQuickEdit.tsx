import { SectionLayout } from "./layout/SectionLayout";
import { QuickEdit } from "./symbol/QuickEdit";
import { QuickEditToolbar } from "./symbol/QuickEditToolbar";

export const RoutesQuickEdit = () => {
  return <SectionLayout body={<QuickEdit />} footer={<QuickEditToolbar />} />;
};
