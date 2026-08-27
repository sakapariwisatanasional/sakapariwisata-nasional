import React, { useState, useEffect } from 'react';
import { 
  Member, 
  TourPackage, 
  Activity, 
  Province, 
  Skill, 
  AuditLog, 
  CurrentUser,
  CulinarySouvenirItem
} from './types';
import { storage } from './services/storage';
import { DEMO_USERS } from './data/initialData';

// Layout Components
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';

// Page Views
import { DashboardView } from './pages/DashboardView';
import { MemberManagementView } from './pages/MemberManagementView';
import { TourismDirectoryView } from './pages/TourismDirectoryView';
import { SkillDirectoryView } from './pages/SkillDirectoryView';
import { ActivitiesView } from './pages/ActivitiesView';
import { TerritoryManagementView } from './pages/TerritoryManagementView';
import { AuditLogsView } from './pages/AuditLogsView';
import { PublicPortalView } from './pages/PublicPortalView';
import { MyCardView } from './pages/MyCardView';

// Modals
import { MemberFormModal } from './components/member/MemberFormModal';
import { MemberVerificationModal } from './components/member/MemberVerificationModal';
import { MemberTransferModal } from './components/member/MemberTransferModal';
import { TourPackageFormModal } from './components/tourism/TourPackageFormModal';
import { TourPackageDetailModal } from './components/tourism/TourPackageDetailModal';
import { KtaCardCustomizerModal } from './components/member/KtaCardCustomizerModal';
import { MemberPhotoEditModal } from './components/member/MemberPhotoEditModal';
import { AdminEditMemberModal } from './components/member/AdminEditMemberModal';
import { KtaPrintPdfModal } from './components/member/KtaPrintPdfModal';
import { OperatorRoleModal } from './components/member/OperatorRoleModal';
import { CulinarySouvenirFormModal } from './components/culinary/CulinarySouvenirFormModal';
import { CulinarySouvenirDetailModal } from './components/culinary/CulinarySouvenirDetailModal';
import { CulinarySouvenirGallerySection } from './components/dashboard/CulinarySouvenirGallerySection';

export default function App() {
  // Current logged in user (Super Admin by default for full capability testing)
  const [currentUser, setCurrentUser] = useState<CurrentUser>(DEMO_USERS[0]);
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Reactive State from storage service
  const [members, setMembers] = useState<Member[]>([]);
  const [tours, setTours] = useState<TourPackage[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [culinaryItems, setCulinaryItems] = useState<CulinarySouvenirItem[]>([]);

  // Modals State
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isTourFormModalOpen, setIsTourFormModalOpen] = useState(false);
  const [isEditKtaModalOpen, setIsEditKtaModalOpen] = useState(false);
  const [isCulinaryFormOpen, setIsCulinaryFormOpen] = useState(false);
  const [editingCulinaryItem, setEditingCulinaryItem] = useState<CulinarySouvenirItem | null>(null);
  const [selectedCulinaryDetail, setSelectedCulinaryDetail] = useState<CulinarySouvenirItem | null>(null);
  const [editingPhotoMember, setEditingPhotoMember] = useState<Member | null>(null);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [printingKtaMember, setPrintingKtaMember] = useState<Member | null>(null);
  const [managingOperatorMember, setManagingOperatorMember] = useState<Member | null>(null);
  const [verifyingMember, setVerifyingMember] = useState<Member | null>(null);
  const [transferringMember, setTransferringMember] = useState<Member | null>(null);
  const [selectedTourDetail, setSelectedTourDetail] = useState<TourPackage | null>(null);

  // Synchronize state with reactive storage
  useEffect(() => {
    const syncState = () => {
      setMembers(storage.getMembers());
      setTours(storage.getTourPackages());
      setActivities(storage.getActivities());
      setProvinces(storage.getProvinces());
      setSkills(storage.getSkills());
      setAuditLogs(storage.getAuditLogs());
      setCulinaryItems(storage.getCulinarySouvenirs());
    };

    syncState();
    return storage.subscribe(syncState);
  }, []);

  // Handlers for Member Management
  const handleApproveMember = (memberId: string) => {
    storage.approveMember(memberId, `${currentUser.name} (${currentUser.role})`);
    alert('Anggota berhasil diverifikasi & Nomor Anggota Nasional (PP.KK.KC.NNNNNN) telah diterbitkan.');
  };

  const handleRejectMember = (memberId: string) => {
    storage.updateMemberStatus(memberId, 'SUSPENDED', `${currentUser.name} (${currentUser.role})`, 'Penangguhan keanggotaan oleh administrator');
    alert('Status anggota diperbarui menjadi SUSPENDED.');
  };

  return (
    <div className="flex h-screen w-screen bg-slate-50 text-slate-900 overflow-hidden font-sans antialiased">
      {/* Fixed Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setSearchQuery('');
        }}
        currentUser={currentUser}
        onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
        onOpenPublicPortal={() => setCurrentTab('verify-portal')}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header
          currentUser={currentUser}
          onSwitchUser={(user) => {
            setCurrentUser(user);
            if (user.role === 'MEMBER') {
              setCurrentTab('my-card');
            }
          }}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
          onSelectTab={setCurrentTab}
        />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {currentTab === 'dashboard' && (
              <DashboardView
                currentUser={currentUser}
                members={members}
                tours={tours}
                provinces={provinces}
                culinaryItems={culinaryItems}
                onSelectTab={setCurrentTab}
                onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
                onVerifyMember={(m) => setVerifyingMember(m)}
                onApproveMemberQuick={handleApproveMember}
                onViewTourDetail={(t) => setSelectedTourDetail(t)}
                onOpenEditCardModal={() => setIsEditKtaModalOpen(true)}
                onOpenCulinaryFormModal={(item) => {
                  setEditingCulinaryItem(item || null);
                  setIsCulinaryFormOpen(true);
                }}
                onSelectCulinaryDetail={(item) => setSelectedCulinaryDetail(item)}
              />
            )}

            {currentTab === 'culinary-souvenirs' && (
              <div className="space-y-6">
                <CulinarySouvenirGallerySection
                  items={culinaryItems}
                  currentUser={currentUser}
                  onOpenFormModal={(item) => {
                    setEditingCulinaryItem(item || null);
                    setIsCulinaryFormOpen(true);
                  }}
                  onSelectItemDetail={(item) => setSelectedCulinaryDetail(item)}
                />
              </div>
            )}

            {currentTab === 'members' && (
              <MemberManagementView
                currentUser={currentUser}
                members={members}
                provinces={provinces}
                onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
                onOpenVerifyModal={(m) => setVerifyingMember(m)}
                onOpenTransferModal={(m) => setTransferringMember(m)}
                onApproveMember={handleApproveMember}
                onRejectMember={handleRejectMember}
                onOpenEditCardModal={() => setIsEditKtaModalOpen(true)}
                onOpenEditPhotoModal={(m) => setEditingPhotoMember(m)}
                onOpenEditMemberModal={(m) => setEditingMember(m)}
                onOpenPrintPdfModal={(m) => setPrintingKtaMember(m)}
                onOpenOperatorModal={(m) => setManagingOperatorMember(m)}
              />
            )}

            {currentTab === 'tours' && (
              <TourismDirectoryView
                currentUser={currentUser}
                tours={tours}
                provinces={provinces}
                onOpenTourFormModal={() => setIsTourFormModalOpen(true)}
                onViewTourDetail={(t) => setSelectedTourDetail(t)}
              />
            )}

            {currentTab === 'skills' && (
              <SkillDirectoryView
                currentUser={currentUser}
                members={members}
                skills={skills}
                onOpenVerifyModal={(m) => setVerifyingMember(m)}
              />
            )}

            {currentTab === 'activities' && (
              <ActivitiesView
                currentUser={currentUser}
                activities={activities}
              />
            )}

            {currentTab === 'territories' && (
              <TerritoryManagementView
                provinces={provinces}
              />
            )}

            {currentTab === 'audit-logs' && (
              <AuditLogsView
                logs={auditLogs}
              />
            )}

            {currentTab === 'verify-portal' && (
              <PublicPortalView
                members={members}
                tours={tours}
                skills={skills}
                onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
                onOpenVerifyModal={(m) => setVerifyingMember(m)}
                onViewTourDetail={(t) => setSelectedTourDetail(t)}
                onSelectTab={setCurrentTab}
              />
            )}

            {currentTab === 'my-card' && (
              <MyCardView
                currentUser={currentUser}
                members={members}
                onOpenVerifyModal={(m) => setVerifyingMember(m)}
                onOpenEditCardModal={() => setIsEditKtaModalOpen(true)}
                onOpenEditPhotoModal={(m) => setEditingPhotoMember(m)}
                onOpenEditMemberModal={(m) => setEditingMember(m)}
                onOpenPrintPdfModal={(m) => setPrintingKtaMember(m)}
              />
            )}
          </div>
        </main>
      </div>

      {/* Global Modals */}
      {/* 1. Register Member Modal */}
      <MemberFormModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSuccess={() => {
          setIsRegisterModalOpen(false);
          setCurrentTab('members');
        }}
      />

      {/* 2. Public Safe Verification Modal */}
      <MemberVerificationModal
        member={verifyingMember}
        onClose={() => setVerifyingMember(null)}
      />

      {/* 3. Member Transfer / Mutasi Modal */}
      <MemberTransferModal
        member={transferringMember}
        currentUser={currentUser}
        onClose={() => setTransferringMember(null)}
        onSuccess={() => setTransferringMember(null)}
      />

      {/* 4. Tour Package Creation Modal */}
      <TourPackageFormModal
        isOpen={isTourFormModalOpen}
        currentUser={currentUser}
        onClose={() => setIsTourFormModalOpen(false)}
        onSuccess={() => {
          setIsTourFormModalOpen(false);
          setCurrentTab('tours');
        }}
      />

      {/* 5. Tour Package Details & Itinerary Modal */}
      <TourPackageDetailModal
        tour={selectedTourDetail}
        onClose={() => setSelectedTourDetail(null)}
      />

      {/* 6. Admin KTA Card Customizer Modal */}
      <KtaCardCustomizerModal
        isOpen={isEditKtaModalOpen}
        currentUser={currentUser}
        onClose={() => setIsEditKtaModalOpen(false)}
      />

      {/* 7. Member Photo Correction & Profile Sync Modal */}
      <MemberPhotoEditModal
        isOpen={!!editingPhotoMember}
        member={editingPhotoMember}
        currentUser={currentUser}
        onClose={() => setEditingPhotoMember(null)}
        onSuccess={() => setEditingPhotoMember(null)}
      />

      {/* 8. Admin Manual Profile & Domicile Edit Modal */}
      <AdminEditMemberModal
        isOpen={!!editingMember}
        member={editingMember}
        currentUser={currentUser}
        onClose={() => setEditingMember(null)}
        onSuccess={() => setEditingMember(null)}
      />

      {/* 9. KTA Print & PDF Export Modal (ISO/IEC 7810 ID-1 CR80 & A4 Sheet) */}
      <KtaPrintPdfModal
        isOpen={!!printingKtaMember}
        member={printingKtaMember}
        onClose={() => setPrintingKtaMember(null)}
        onOpenEditCard={() => {
          setPrintingKtaMember(null);
          setIsEditKtaModalOpen(true);
        }}
      />

      {/* 10. Operator Role Management Modal (Super Admin Only) */}
      <OperatorRoleModal
        isOpen={!!managingOperatorMember}
        member={managingOperatorMember}
        currentUser={currentUser}
        onClose={() => setManagingOperatorMember(null)}
        onSuccess={() => setManagingOperatorMember(null)}
      />

      {/* 11. Culinary & Souvenir Form Modal (Input Anggota Kwarran) */}
      <CulinarySouvenirFormModal
        isOpen={isCulinaryFormOpen}
        currentUser={currentUser}
        editItem={editingCulinaryItem}
        onClose={() => {
          setIsCulinaryFormOpen(false);
          setEditingCulinaryItem(null);
        }}
        onSuccess={(savedItem) => {
          setIsCulinaryFormOpen(false);
          setEditingCulinaryItem(null);
          setSelectedCulinaryDetail(savedItem);
        }}
      />

      {/* 12. Culinary & Souvenir Detail Modal */}
      <CulinarySouvenirDetailModal
        item={selectedCulinaryDetail}
        currentUser={currentUser}
        onClose={() => setSelectedCulinaryDetail(null)}
        onEdit={(item) => {
          setEditingCulinaryItem(item);
          setIsCulinaryFormOpen(true);
        }}
        onDelete={(id) => {
          storage.deleteCulinarySouvenir(id, currentUser);
          setSelectedCulinaryDetail(null);
        }}
      />
    </div>
  );
}
