import { api } from "~/trpc/server";
import Write from "./wrapper";

const WritePage = async ({
  searchParams,
}: {
  searchParams: Promise<{ editId: string | undefined }>;
}) => {
  const { editId } = await searchParams;
  let editData = null;

  if (editId) {
    editData = await api.story.getDataForEdit({
      id: editId,
    });
  }

  return <Write editData={editData} />;
};

export default WritePage;
