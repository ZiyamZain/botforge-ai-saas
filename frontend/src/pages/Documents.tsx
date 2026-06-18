import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/axios";
import {
  Upload,
  Trash2,
  FileText,
  Loader2,
  CheckCircle,
  XCircle,
  File,
  MoreHorizontal,
  Globe,
} from "lucide-react";

const statusConfig = {
  PROCESSING: { icon: <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-500" />, label: "Processing", className: "text-amber-600 bg-amber-50" },
  READY: { icon: <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />, label: "Ready", className: "text-emerald-600 bg-emerald-50" },
  FAILED: { icon: <XCircle className="w-3.5 h-3.5 text-red-500" />, label: "Failed", className: "text-red-600 bg-red-50" },
};

export default function Documents() {
  const queryClient = useQueryClient();
  const [isDragging, setIsDragging] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ["documents"],
    queryFn: () => api.get("/documents").then((r) => r.data),
    refetchInterval: 5000,
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return api.post("/documents", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["documents"] }),
    onError: (error: any) => {
      console.error("Upload failed:", error);
      alert(error.response?.data?.error || "Failed to upload document");
    },
  });

  const uploadUrlMutation = useMutation({
    mutationFn: (url: string) => api.post("/documents/url", { url }),
    onSuccess: () => {
      setUrlInput("");
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
    onError: (error: any) => {
      console.error("URL upload failed:", error);
      alert(error.response?.data?.error || "Failed to process URL");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/documents/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["documents"] }),
  });

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type === "application/pdf") uploadMutation.mutate(file);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadMutation.mutate(file);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-neutral-900">Documents</h1>
        <p className="text-[14px] text-neutral-500 mt-1">Upload and manage your knowledge base</p>
      </div>

      {/* Input zones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* PDF Upload */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-150 flex flex-col items-center justify-center ${
            isDragging
              ? "border-neutral-900 bg-neutral-50"
              : "border-neutral-200 hover:border-neutral-300"
          }`}
        >
          <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center mb-3">
            <Upload className="w-5 h-5 text-neutral-400" />
          </div>
          <p className="text-[13px] font-medium text-neutral-700 mb-1">Upload a PDF Document</p>
          <p className="text-[12px] text-neutral-400 mb-4">Supports files up to 10MB</p>
          <label className="inline-flex items-center gap-1.5 bg-neutral-900 text-white px-4 py-2 rounded-lg text-[13px] font-medium cursor-pointer hover:bg-neutral-800 transition-colors">
            <Upload className="w-3.5 h-3.5" />
            Select PDF
            <input type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
          </label>
          {uploadMutation.isPending && (
            <p className="text-[12px] text-neutral-500 mt-3 flex items-center gap-1.5">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading…
            </p>
          )}
        </div>

        {/* URL Scraper */}
        <div className="border border-neutral-200 rounded-xl p-6 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center mb-3">
            <Globe className="w-5 h-5 text-neutral-400" />
          </div>
          <p className="text-[13px] font-medium text-neutral-700 mb-1">Scrape a Webpage</p>
          <p className="text-[12px] text-neutral-400 mb-4">Enter any public URL to extract its text</p>
          
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (urlInput.trim()) {
                uploadUrlMutation.mutate(urlInput.trim());
              }
            }}
            className="w-full max-w-[240px] flex gap-2"
          >
            <input
              type="url"
              placeholder="https://example.com"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="flex-1 border border-neutral-200 rounded-lg px-3 py-1.5 text-[13px] outline-none focus:border-neutral-400"
              required
            />
            <button 
              type="submit"
              disabled={uploadUrlMutation.isPending}
              className="bg-neutral-900 text-white px-3 py-1.5 rounded-lg text-[13px] font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50 flex items-center"
            >
              {uploadUrlMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Scrape"}
            </button>
          </form>
        </div>
      </div>

      {/* Documents table */}
      <div className="bg-white border border-neutral-200/80 rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-neutral-100 flex items-center justify-between">
          <h2 className="text-[13px] font-semibold text-neutral-900">All Documents</h2>
          <span className="text-[11px] font-medium text-neutral-400">{documents.length} files</span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-neutral-400 text-[13px]">Loading…</div>
        ) : documents.length === 0 ? (
          <div className="p-12 text-center">
            <File className="w-8 h-8 mx-auto mb-2 text-neutral-200" />
            <p className="text-neutral-400 text-[13px]">No documents yet</p>
          </div>
        ) : (
          <table className="w-full text-[13px] table-fixed">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/50">
                <th className="w-[50%] text-left px-5 py-2.5 font-medium text-neutral-400 text-[11px] uppercase tracking-wider">File</th>
                <th className="w-[20%] text-left px-5 py-2.5 font-medium text-neutral-400 text-[11px] uppercase tracking-wider">Status</th>
                <th className="w-[20%] text-left px-5 py-2.5 font-medium text-neutral-400 text-[11px] uppercase tracking-wider">Uploaded</th>
                <th className="w-[10%] px-5 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc: any) => {
                const status = statusConfig[doc.status as keyof typeof statusConfig];
                return (
                  <tr key={doc.id} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5 w-full">
                        <div className="w-7 h-7 rounded-md bg-red-50 flex items-center justify-center shrink-0">
                          <FileText className="w-3.5 h-3.5 text-red-500" />
                        </div>
                        <span className="font-medium text-neutral-700 truncate block w-full">{doc.fileName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full ${status?.className}`}>
                        {status?.icon}
                        {status?.label}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-neutral-400">
                      {new Date(doc.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => deleteMutation.mutate(doc.id)}
                        className="text-neutral-300 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
