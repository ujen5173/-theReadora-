import { isCuid } from "@paralleldrive/cuid2";
import { redirect } from "next/navigation";
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
    if (!isCuid(editId)) {
      redirect("/write");
      return;
    }

    editData = await api.story.getDataForEdit({
      id: editId,
    });
  }

  return <Write editData={editData} />;
};

export default WritePage;
