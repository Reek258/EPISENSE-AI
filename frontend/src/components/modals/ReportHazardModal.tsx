import React, { useState, useEffect } from 'react';
import { X, Camera, MapPin, CheckCircle2, Loader2 } from 'lucide-react';
import apiClient from '../../api/client';

interface ReportHazardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReportHazardModal: React.FC<ReportHazardModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    severity: 'Medium',
    description: ''
  });
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (isOpen) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.error("GPS Error", err),
        { enableHighAccuracy: true }
      );
    }
  }, [isOpen]);

  useEffect(() => {
    if (step === 2 && !image && isOpen) {
      startCamera();
    }
    return () => stopCamera();
  }, [step, image, isOpen]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setVideoStream(stream);
      const video = document.getElementById('camera-preview') as HTMLVideoElement;
      if (video) video.srcObject = stream;
    } catch (err) {
      console.error("Camera access denied", err);
    }
  };

  const stopCamera = () => {
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
      setVideoStream(null);
    }
  };

  const capturePhoto = () => {
    const video = document.getElementById('camera-preview') as HTMLVideoElement;
    const canvas = document.createElement('canvas');
    if (video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setImage(dataUrl);
      stopCamera();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await apiClient.post('/reports/', {
        reporter_name: formData.name,
        contact_number: formData.phone,
        latitude: coords?.lat || 18.5204,
        longitude: coords?.lng || 73.8567,
        severity: formData.severity,
        description: formData.description,
        image_url: image, 
        zone_id: "ZONE_01",
        status: "pending"
      });
      setStep(3);
    } catch (err) {
      alert("Failed to submit report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-primary-950/80 backdrop-blur-md">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl relative">
        <div className="bg-[#4a1d07] p-8 text-white relative">
          <button onClick={() => { stopCamera(); onClose(); }} className="absolute top-6 right-6 text-white/50 hover:text-white">
            <X size={24} />
          </button>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary-600 rounded-2xl shadow-lg shadow-primary-900/50">
              <Camera size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight uppercase tracking-widest">Report Hazard</h3>
              <p className="text-[10px] text-primary-300 font-bold uppercase tracking-widest">Citizen Surveillance Portal</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-400 uppercase tracking-widest ml-1">Full Name</label>
                  <input 
                    className="w-full px-5 py-4 bg-surface-50 border border-surface-100 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-primary-500/10"
                    placeholder="Ex: Nitesh Patil"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-400 uppercase tracking-widest ml-1">Mobile No.</label>
                  <input 
                    className="w-full px-5 py-4 bg-surface-50 border border-surface-100 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-primary-500/10"
                    placeholder="+91"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-400 uppercase tracking-widest ml-1">Location Context</label>
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center space-x-3">
                  <MapPin size={20} className="text-blue-600 animate-bounce" />
                  <div>
                    <p className="text-[10px] text-blue-800 font-bold uppercase tracking-tighter">Automatic GPS Active</p>
                    <p className="text-[10px] text-blue-600/70 font-medium">
                      {coords ? `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}` : "Acquiring coordinates..."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-400 uppercase tracking-widest ml-1">Observation Details</label>
                <textarea 
                  className="w-full px-5 py-4 bg-surface-50 border border-surface-100 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-primary-500/10 min-h-[80px] resize-none"
                  placeholder="Ex: Large puddle of stagnant water near the main gate of Kothrud Society..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <button 
                onClick={() => setStep(2)}
                disabled={!formData.name || !formData.phone}
                className="w-full py-5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl shadow-xl shadow-primary-600/20 font-black text-xs uppercase tracking-[0.2em] transition-all disabled:opacity-50"
              >
                Next: Launch Live Camera
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="aspect-video bg-black rounded-3xl overflow-hidden relative shadow-inner">
                {image ? (
                  <img src={image} className="w-full h-full object-cover" alt="Captured Hazard" />
                ) : (
                  <video id="camera-preview" autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]" />
                )}
                
                {!image && (
                  <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                    <button 
                      onClick={capturePhoto}
                      className="h-16 w-16 bg-white rounded-full border-4 border-primary-600 shadow-2xl active:scale-90 transition-all flex items-center justify-center"
                    >
                      <div className="h-10 w-10 bg-primary-600 rounded-full"></div>
                    </button>
                  </div>
                )}
              </div>

              <div className="flex space-x-3">
                <button 
                  onClick={() => { setImage(null); setStep(1); stopCamera(); }}
                  className="flex-1 py-4 bg-surface-100 hover:bg-surface-200 text-text-600 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                >
                  {image ? "Retake" : "Back"}
                </button>
                {image && (
                  <button 
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-[2] py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl shadow-xl shadow-green-600/20 font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center space-x-2"
                  >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <span>Submit Official Report</span>}
                  </button>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="py-12 text-center space-y-6">
              <div className="flex justify-center">
                <div className="h-24 w-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center animate-bounce shadow-xl shadow-green-100">
                  <CheckCircle2 size={48} />
                </div>
              </div>
              <div>
                <h4 className="text-2xl font-black text-primary-950">Report Logged</h4>
                <p className="text-xs text-text-500 font-medium mt-2 max-w-[200px] mx-auto">
                  Transmission complete. Pune Health Department notified.
                </p>
              </div>
              <button 
                onClick={onClose}
                className="px-8 py-4 bg-primary-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all"
              >
                Return to Home
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportHazardModal;
