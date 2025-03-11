import { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import axios from "axios";
import clsx from "clsx";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

interface Video {
  id: string;
  name: string;
  image: string;
  url: string;
  price: string; // Số tim & lượt xem
}

export default function RecentOrders() {
  const [tableData, setTableData] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      setError(null);

      try {
        const videosResponse = await axios.get("https://huy-7xbr.onrender.com/api/v1/get-video");

        console.log("Videos:", videosResponse.data.data);

        // 3️⃣ Chuyển dữ liệu video thành danh sách hiển thị
        const videos: Video[] = videosResponse.data.data.map((item: any) => ({
          id: item.id,
          url: item.url,
        }));

        setTableData(videos);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu TikTok:", error);
        setError("Không thể tải dữ liệu. Vui lòng thử lại!");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const { theme } = useTheme();
  useEffect(() => {
    console.log("Current Theme:", theme);
  }, [theme]); 

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          TikTok Videos ({tableData.length})
        </h3>
      </div>

      {loading ? (
        <p className="text-gray-500">Đang tải dữ liệu...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="max-w-full overflow-x-auto">
          <Table>
  <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
    <TableRow>
      <TableCell isHeader className="py-3 text-center text-gray-500 w-1/10">
        STT
      </TableCell>
      <TableCell isHeader className="py-3 text-center text-gray-500 w-1/2">
        Icon
      </TableCell>
      <TableCell isHeader className="py-3 text-center text-gray-500 w-4/10">
        Link
      </TableCell>
    </TableRow>
  </TableHeader>
  <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
    {tableData.map((video, index) => (
      <TableRow key={video.id}>
        {/* Cột STT */}
        <TableCell
          className={clsx(
            "py-3 text-center font-medium w-1/10",
            theme === "dark" ? "text-white" : "text-black"
          )}
        >
          {index + 1}
        </TableCell>
        {/* Cột Icon */}
        <TableCell className="py-5 w-1/2 text-center">
          <img
            src="/images/logo/icon_tiktok.png"
            alt="Thumbnail"
            className="w-8 h-10 object-fill rounded inline-block"
          />
        </TableCell>
        {/* Cột Link */}
        <TableCell className="py-3 text-center w-4/10">
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            Xem Video
          </a>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>


        </div>
      )}
    </div>
  );
}

