import { type FC, useState, useRef } from 'react';
import { reportsApi } from '../../api/reports';

interface WaterReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  latitude: number;
  longitude: number;
  zoneId: string;
}

const WaterReportModal: FC<WaterReportModalProps> = ({ isOpen, onClose, latitude, longitude, zoneId }) => {
  const [reporterName, setReporterName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [severity, setSeverity] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [description, setDescription] = useState('');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reporterName || !contactNumber) {
      alert('Please provide your name and contact number for institutional verification.');
      return;
    }

    setIsSubmitting(true);
    try {
      await reportsApi.createReport({
        zone_id: zoneId,
        latitude,
        longitude,
        severity,
        description,
        reporter_name: reporterName,
        contact_number: contactNumber,
        image_url: imageBase64 || undefined
      });
      onClose();
    } catch (error) {
      console.error('Failed to submit report:', error);
      alert('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-primary-900/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-surface-white w-full max-w-md rounded-xl shadow-2xl border border-surface-100 overflow-hidden my-auto">
        <div className="bg-primary-900 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse"></div>
            <h3 className="text-white font-bold tracking-tight">Citizen Surveillance Report</h3>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100/50">
            <p className="text-[10px] text-blue-800 font-bold uppercase tracking-wider mb-1">Incident Location</p>
            <p className="text-[11px] text-blue-900 font-medium tabular-nums">
              GPS: {latitude.toFixed(6)}, {longitude.toFixed(6)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-text-600 uppercase tracking-wider mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                placeholder="Ex: Rajesh Kumar"
                className="w-full bg-surface-50 border border-surface-200 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary-900/10 focus:border-primary-900 outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-text-600 uppercase tracking-wider mb-1.5">Contact No.</label>
              <input
                type="tel"
                required
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="+91 98XXX XXXXX"
                className="w-full bg-surface-50 border border-surface-200 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary-900/10 focus:border-primary-900 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-text-600 uppercase tracking-wider mb-1.5">Severity Assessment</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Low', 'Medium', 'High'] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setSeverity(level)}
                  className={`py-1.5 text-[11px] font-bold rounded border transition-all ${
                    severity === level 
                    ? 'bg-primary-900 text-white border-primary-900 shadow-sm' 
                    : 'bg-white text-text-600 border-surface-200 hover:border-primary-200'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-text-600 uppercase tracking-wider mb-1.5">Photographic Evidence</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-all ${
                imageBase64 ? 'border-teal-500 bg-teal-50' : 'border-surface-200 bg-surface-50 hover:border-primary-300'
              }`}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                capture="environment"
                className="hidden" 
              />
              {imageBase64 ? (
                <div className="relative w-full h-32">
                  <img src={imageBase64} className="w-full h-full object-cover rounded-md" alt="Preview" />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-md">
                    <span className="text-white text-[10px] font-bold">Change Image</span>
                  </div>
                </div>
              ) : (
                <>
                  <svg className="w-6 h-6 text-text-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  <span className="text-[10px] font-bold text-text-500 uppercase">Tap to Capture / Upload</span>
                </>
              )}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-text-600 uppercase tracking-wider mb-1.5">Observations</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide specific details about the water accumulation..."
              className="w-full bg-surface-50 border border-surface-200 rounded-md p-3 text-sm focus:ring-2 focus:ring-primary-900/10 focus:border-primary-900 outline-none transition-all h-20 resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-lg font-bold text-sm tracking-wide shadow-lg transition-all ${
                isSubmitting 
                ? 'bg-surface-200 text-text-400 cursor-not-allowed' 
                : 'bg-primary-900 text-white hover:bg-primary-800 active:scale-[0.98]'
              }`}
            >
              {isSubmitting ? 'Verifying Data...' : 'Submit Official Report'}
            </button>
            <p className="text-[9px] text-text-400 text-center mt-3 leading-relaxed">
              Submission constitutes an official record. Your contact details will be used for verification purposes only.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WaterReportModal;
