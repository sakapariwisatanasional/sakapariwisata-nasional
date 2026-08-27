import React, { useState } from 'react';
import { 
  CalendarDays, 
  MapPin, 
  Users, 
  Clock, 
  CheckCircle2, 
  Plus, 
  ExternalLink,
  Sparkles,
  Ticket
} from 'lucide-react';
import { Activity, CurrentUser } from '../types';
import { storage } from '../services/storage';

interface ActivitiesViewProps {
  currentUser: CurrentUser;
  activities: Activity[];
}

export const ActivitiesView: React.FC<ActivitiesViewProps> = ({
  currentUser,
  activities
}) => {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [registeredIds, setRegisteredIds] = useState<string[]>([]);

  const handleRegisterActivity = (act: Activity) => {
    if (registeredIds.includes(act.id)) {
      alert('Anda sudah terdaftar dalam kegiatan ini.');
      return;
    }
    setRegisteredIds([...registeredIds, act.id]);
    alert(`Pendaftaran kegiatan "${act.title}" berhasil! Tiket kehadiran elektronik telah diterbitkan.`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN_REGISTRATION':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">PENDAFTARAN DIBUKA</span>;
      case 'ONGOING':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300 animate-pulse">BERLANGSUNG</span>;
      case 'COMPLETED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">SELESAI</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">DITUTUP</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900">
          Agenda & Kegiatan Saka Pariwisata
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Perkemahan, sertifikasi pemandu wisata, bakti Sapta Pesona, dan lokakarya nasional
        </p>
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((act) => {
          const isRegistered = registeredIds.includes(act.id);

          return (
            <div
              key={act.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Banner Image */}
                <div className="h-44 bg-slate-800 relative overflow-hidden">
                  <img
                    src={act.coverImage}
                    alt={act.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-10">
                    <span className="px-2.5 py-1 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold rounded-lg">
                      {act.category.replace('_', ' ')}
                    </span>
                    {getStatusBadge(act.status)}
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                    <CalendarDays className="w-3.5 h-3.5" />
                    <span>
                      {new Date(act.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      {' - '}
                      {new Date(act.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 font-heading leading-snug">
                    {act.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {act.description}
                  </p>

                  <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{act.location} ({act.scope})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>Kapasitas: {act.registeredCount} / {act.maxParticipants} Peserta</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 pt-0">
                {isRegistered ? (
                  <button
                    disabled
                    className="w-full py-2.5 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-default"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Terdaftar Sebagai Peserta</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleRegisterActivity(act)}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Ticket className="w-4 h-4 text-emerald-400" />
                    <span>Daftar Kegiatan Ini</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
