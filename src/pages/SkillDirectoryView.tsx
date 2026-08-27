import React, { useState, useMemo } from 'react';
import { 
  Award, 
  Search, 
  CheckCircle2, 
  ShieldCheck, 
  MapPin, 
  Sparkles, 
  Filter, 
  Phone, 
  Mail,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Member, Skill, CurrentUser } from '../types';

interface SkillDirectoryViewProps {
  currentUser: CurrentUser;
  members: Member[];
  skills: Skill[];
  onOpenVerifyModal: (member: Member) => void;
}

export const SkillDirectoryView: React.FC<SkillDirectoryViewProps> = ({
  currentUser,
  members,
  skills,
  onOpenVerifyModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedSkillId, setSelectedSkillId] = useState<string>('ALL');

  // Categories extracted
  const categories = Array.from(new Set(skills.map(s => s.category)));

  // Filter skills and matching members
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      if (m.status !== 'ACTIVE') return false;
      if (!m.skills || m.skills.length === 0) return false;

      const q = (searchQuery || '').toLowerCase();
      const matchSearch = 
        (m.fullName || '').toLowerCase().includes(q) ||
        (m.skills && m.skills.some(s => (s.skillName || '').toLowerCase().includes(q))) ||
        (m.provinceName || '').toLowerCase().includes(q) ||
        (m.regencyName || '').toLowerCase().includes(q);

      if (!matchSearch) return false;

      if (selectedCategory !== 'ALL') {
        const hasCat = m.skills.some(s => s.category === selectedCategory);
        if (!hasCat) return false;
      }

      if (selectedSkillId !== 'ALL') {
        const hasSkill = m.skills.some(s => s.skillId === selectedSkillId);
        if (!hasSkill) return false;
      }

      return true;
    });
  }, [members, searchQuery, selectedCategory, selectedSkillId]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900">
          Direktori Keahlian & Talent Pool Pariwisata
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Pangkalan data kompetensi resmi anggota Saka Pariwisata bersertifikasi BNSP & Kwartir Nasional
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {/* Search */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari talenta, pemandu, fotografer..."
              className="bg-transparent outline-none w-full text-slate-800"
            />
          </div>

          {/* Category */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSkillId('ALL');
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none font-medium text-slate-700"
            >
              <option value="ALL">Semua Kategori Bidang</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Specific Skill */}
          <div>
            <select
              value={selectedSkillId}
              onChange={(e) => setSelectedSkillId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none font-medium text-slate-700"
            >
              <option value="ALL">Semua Jenis Keahlian Khusus</option>
              {skills
                .filter(s => selectedCategory === 'ALL' || s.category === selectedCategory)
                .map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
            </select>
          </div>
        </div>
      </div>

      {/* Member Talent Cards Grid */}
      {filteredMembers.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-400">
          <Award className="w-12 h-12 mx-auto text-slate-300 stroke-1 mb-2" />
          <p className="font-bold text-slate-700">Tidak ada talenta keahlian yang cocok.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Header Profile */}
                <div className="flex items-start gap-3">
                  <img
                    src={member.avatarUrl}
                    alt={member.fullName}
                    className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-500 shadow-xs flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-sm text-slate-900 truncate font-heading">
                      {member.fullName}
                    </h4>
                    <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-mono font-bold">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{member.nationalMemberNumber}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span className="truncate">{member.regencyName}, {member.provinceName}</span>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {member.bio || 'Kader aktif Saka Pariwisata dengan keahlian kepariwisataan.'}
                </p>

                {/* Skills Badges */}
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Kompetensi Terdaftar:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {member.skills.map((sk) => (
                      <span
                        key={sk.id}
                        className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md text-[10px] font-semibold flex items-center gap-1"
                      >
                        <Award className="w-2.5 h-2.5 text-emerald-600" />
                        <span>{sk.skillName}</span>
                        <span className="text-[9px] text-emerald-600 font-bold">({sk.proficiency})</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">{member.gugusDepan}</span>
                <button
                  onClick={() => onOpenVerifyModal(member)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Lihat Profil & KTA</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
