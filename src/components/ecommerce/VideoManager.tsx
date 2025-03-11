import { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import axios from "axios";
import clsx from "clsx";
import { Trash2, Plus, X } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

interface Video {
  id: string;
  url: string;
}

export default function VideoManager() {
  const [showPopup, setShowPopup] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [tableData, setTableData] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("https://huy-7xbr.onrender.com/api/v1/get-video");
        setTableData(response.data.data);
      } catch (error) {
        setError("Không thể tải dữ liệu. Vui lòng thử lại!");
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const handleDelete = async (videoUrl: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa video này?")) return;
    try {
      await axios.post("https://huy-7xbr.onrender.com/api/v1/delete-video", { url: videoUrl });
      setTableData((prev) => prev.filter((video) => video.url !== videoUrl));
    } catch (error) {
      alert("Xóa video thất bại. Vui lòng thử lại!");
    }
  };

  const handleSave = async () => {
    if (!videoUrl.trim()) {
      alert("Vui lòng nhập URL video!");
      return;
    }
    try {
      await axios.post("https://huy-7xbr.onrender.com/api/v1/add-video", { url: videoUrl });
      setTableData([...tableData, { id: Date.now().toString(), url: videoUrl }]);
      setShowPopup(false);
      setVideoUrl("");
    } catch (error) {
      alert("Lỗi kết nối đến server!");
    }
  };
  
  const handleDeleteAll = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa tất cả video?")) return;
  
    try {
      await axios.post("https://huy-7xbr.onrender.com/api/v1/delete-videos");
      setTableData([]);
  
      console.log("Tất cả video đã được xóa");
    } catch (error) {
      console.error("Lỗi khi xóa tất cả video:", error);
      alert("Xóa tất cả video thất bại. Vui lòng thử lại!");
    }
  };
  

  return (
    <div className="p-4 bg-white rounded-xl shadow-lg dark:bg-gray-900">
      <div className="flex justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          TikTok Videos ({tableData.length})
        </h3>
        
        {/* Wrapper cho 2 nút */}
        <div className="flex gap-2 justify-end">
          <button onClick={() => setShowPopup(true)} className="p-2 bg-green-500 text-white rounded hover:bg-green-600">
            <Plus size={20} />
          </button>
          <button
            onClick={() => handleDeleteAll()}
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
            {tableData.slice().reverse().map((video, index) => (
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
      )}

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}>
          <div className="bg-white p-10 rounded-lg shadow-lg w-120">
            <div className="flex justify-between mb-3">
              <h2 className="text-lg font-semibold">Thêm Video</h2>
              <button onClick={() => setShowPopup(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Nhập URL video"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowPopup(false)} className="px-4 py-2 bg-gray-300 rounded">Hủy</button>
              <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded">Lưu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}