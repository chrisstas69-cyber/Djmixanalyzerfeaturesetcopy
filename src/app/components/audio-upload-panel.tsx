import { useState, useRef, useEffect } from "react";
import { Upload, FileAudio, X, CheckCircle2, AlertCircle, Loader2, BarChart, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";

interface AudioFile {
  id: string;
  name: string;
  size: number;
  type: string;
  duration: number;
  data: string; // base64 or blob URL
  uploadedAt: string;
  bpm?: number;
  key?: string;
  energy?: string;
  title?: string;
  artist?: string;
  album?: string;
  label?: string;
  artwork?: string;
}

interface AudioUploadPanelProps {
  onNavigate?: (view: string) => void;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_FORMATS = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/flac', 'audio/x-flac'];

export function AudioUploadPanel({ onNavigate }: AudioUploadPanelProps = {}) {
  const [files, setFiles] = useState<AudioFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [justUploaded, setJustUploaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load files from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('uploadedAudioFiles');
      if (stored) {
        setFiles(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading audio files:', error);
    }
  }, []);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_FORMATS.includes(file.type)) {
      return `Unsupported format: ${file.type}. Please upload MP3, WAV, or FLAC files.`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum size is 50MB.`;
    }
    return null;
  };

  const getFileDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      const url = URL.createObjectURL(file);
      
      audio.addEventListener('loadedmetadata', () => {
        const duration = audio.duration;
        URL.revokeObjectURL(url);
        resolve(duration);
      });
      
      audio.addEventListener('error', () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load audio metadata'));
      });
      
      audio.src = url;
    });
  };

  const handleFileUpload = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    setUploading(true);
    const newFiles: AudioFile[] = [];

    try {
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        
        // Validate
        const error = validateFile(file);
        if (error) {
          toast.error(error);
          continue;
        }

        // Get duration
        let duration = 0;
        try {
          duration = await getFileDuration(file);
        } catch (err) {
          console.error('Error getting duration:', err);
          toast.warning(`Could not determine duration for ${file.name}`);
        }

        // Convert to base64 for storage
        const reader = new FileReader();
        const fileData = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const audioFile: AudioFile = {
          id: `audio-${Date.now()}-${i}`,
          name: file.name,
          size: file.size,
          type: file.type,
          duration,
          data: fileData,
          uploadedAt: new Date().toISOString(),
        };

        newFiles.push(audioFile);
      }

      if (newFiles.length > 0) {
        const updated = [...files, ...newFiles];
        setFiles(updated);
        localStorage.setItem('uploadedAudioFiles', JSON.stringify(updated));
        toast.success(`Uploaded ${newFiles.length} file(s) successfully`);
        setJustUploaded(true);
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('Failed to upload files');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = (id: string) => {
    const updated = files.filter(f => f.id !== id);
    setFiles(updated);
    localStorage.setItem('uploadedAudioFiles', JSON.stringify(updated));
    toast.success('File deleted');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f]">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-xl flex-shrink-0">
        <h1 className="text-xl font-semibold tracking-tight mb-1">Audio Upload</h1>
        <p className="text-xs text-white/40">
          Upload MP3, WAV, or FLAC files (max 50MB)
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Upload Area */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
              dragActive
                ? "border-primary bg-primary/10"
                : "border-white/20 bg-white/5 hover:border-white/30"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/mpeg,audio/mp3,audio/wav,audio/x-wav,audio/flac,audio/x-flac"
              multiple
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
            />
            
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-primary/20 rounded-full">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Drop audio files here or click to browse
                </h3>
                <p className="text-sm text-white/60 mb-4">
                  Supports MP3, WAV, FLAC (max 50MB per file)
                </p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="bg-primary hover:bg-primary/80 text-white"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <FileAudio className="w-4 h-4 mr-2" />
                      Select Files
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Success Message & Navigation */}
          {justUploaded && files.length > 0 && (
            <div className="bg-primary/10 border border-primary/30 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Files uploaded successfully!
                    </h3>
                    <p className="text-xs text-white/60 mt-1">
                      Your files are now available in Audio Analysis, Effects Rack, Timeline Editor, and Audio Library
                    </p>
                  </div>
                </div>
                {onNavigate && (
                  <Button
                    onClick={() => {
                      onNavigate('audio-analysis');
                      setJustUploaded(false);
                    }}
                    className="bg-primary hover:bg-primary/80 text-white"
                  >
                    <BarChart className="w-4 h-4 mr-2" />
                    Go to Audio Analysis
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Uploaded Files List */}
          {files.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">
                Uploaded Files ({files.length})
              </h2>
              <div className="space-y-2">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="p-2 bg-primary/20 rounded-lg flex-shrink-0">
                          <FileAudio className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-white truncate">
                            {file.name}
                          </h3>
                          <div className="flex items-center gap-4 mt-1 text-xs text-white/50 font-['IBM_Plex_Mono']">
                            <span>{formatFileSize(file.size)}</span>
                            <span>•</span>
                            <span>{formatDuration(file.duration)}</span>
                            <span>•</span>
                            <span>{file.type.split('/')[1].toUpperCase()}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(file.id)}
                        className="ml-4 p-2 text-white/40 hover:text-red-400 transition-colors"
                        aria-label="Delete file"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {files.length === 0 && !uploading && (
            <div className="text-center py-12">
              <FileAudio className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <p className="text-white/60 mb-2">No audio files uploaded yet</p>
              <p className="text-sm text-white/40">
                Upload audio files to analyze BPM, key, and energy levels
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

