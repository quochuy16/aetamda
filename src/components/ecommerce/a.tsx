import { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import axios from "axios";
import clsx from "clsx";
import { Trash2, Plus } from "lucide-react";

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

export default function VideoManager() {
  const [showPopup, setShowPopup] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
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
        const videos: Video[] = videosResponse.data.data.map((item) => ({
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

  const handleDelete = async (videoUrl: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa video này?")) return;
  
    try {
      await axios.post("https://huy-7xbr.onrender.com/api/v1/delete-video", {
        headers: { "Content-Type": "application/json" }, 
        data: { url: videoUrl },
      });
  
      // Cập nhật lại danh sách video sau khi xóa
      setTableData((prevData) => prevData.filter((video) => video.url !== videoUrl));
  
      console.log("Video đã được xóa:", videoUrl);
    } catch (error) {
      console.error("Lỗi khi xóa video:", error);
      alert("Xóa video thất bại. Vui lòng thử lại!");
    }
  };
  
  const handleAdd = () => {
    setShowPopup(true); // Mở popup
  };

  const handleClose = () => {
    setShowPopup(false);
    setVideoUrl(""); // Xóa input khi đóng popup
  };

  const handleSave = async () => {
    if (!videoUrl.trim()) {
      alert("Vui lòng nhập URL video!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://huy-7xbr.onrender.com/api/v1/add-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: videoUrl }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Thêm video thành công!");
        handleClose(); // Đóng popup sau khi thêm thành công
      } else {
        alert("Lỗi: " + (result.message || "Không thể thêm video"));
      }
    } catch (error) {
      alert("Lỗi kết nối đến server!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
<div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
  <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
    TikTok Videos ({tableData.length})
  </h3>

  {/* Thêm 2 button bên phải */}
  <div className="flex gap-2">
    {/* Nút thêm */}
    <button
      onClick={handleAdd}
      className="p-2 rounded bg-green-500 hover:bg-green-600 text-white transition"
    >
      <Plus size={20} />
    </button>

    {/* Nút xóa */}
    <button
      onClick={handleAdd}
      className="p-2 rounded bg-red-500 hover:bg-red-600 text-white transition"
    >
      <Trash2 size={20} />
    </button>
  </div>
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
      <TableCell isHeader className="py-3 text-center text-gray-500 w-4/10">
        Icon
      </TableCell>
      <TableCell isHeader className="py-3 text-center text-gray-500 w-4/10">
        Link
      </TableCell>
      <TableCell isHeader className="py-3 text-center text-gray-500 w-1/10">
        Delete
      </TableCell>
    </TableRow>
  </TableHeader>
  <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
    {tableData.map((video, index) => (
      <TableRow key={video.id}>
        
        <TableCell
          className={clsx(
            "py-3 text-center font-medium w-1/10",
            theme === "dark" ? "text-white" : "text-black"
          )}
        >
          {index + 1}
        </TableCell>
        
        <TableCell className="py-5 w-4/10 text-center">
          <img
            src="/images/logo/icon_tiktok.png"
            alt="Thumbnail"
            className="w-8 h-10 object-fill rounded inline-block"
          />
        </TableCell>
        
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
        
        <TableCell className="py-3 text-center w-1/10">
          <button
            onClick={() => handleDelete(video.url)}
            className="text-red-500 hover:text-red-700 transition"
          >
            <Trash2 size={20} />
          </button>
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