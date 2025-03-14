import VideoManager from "../../components/ecommerce/VideoManager";
import PageMeta from "../../components/common/PageMeta";

export default function Admin() {
  return (
    <>
      <PageMeta
        title="Anh Em Tam Đa"
        description=""
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">

        <div className="col-span-12 xl:col-span-12">
          <VideoManager />
        </div>
      </div>
    </>
  );
}
