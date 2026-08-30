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
import { spreadsheetService } from './services/spreadsheetService';

// Layout Components
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';

// Page Views
import { LandingPageView } from './pages/LandingPageView';
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
import { AuthModal } from './components/auth/AuthModal';
import { SpreadsheetSyncModal } from './components/database/SpreadsheetSyncModal';
import { MemberFormModal } from './components/member/MemberFormModal';
import { MemberVerificationModal } from './components/member/MemberVerificationModal';
import { MemberTransferModal } from './components/member/MemberTransferModal';
import { TourPackageFormModal } from './components/tourism/TourPackageFormModal';
import { TourPackageDetailModal } from './components/tourism/TourPackageDetailModal';
import { KtaCardCustomizerModal } from './components/member/KtaCardCustomizerModal';
import { MemberPhotoEditModal } from './components/member/MemberPhotoEditModal';
import { AdminEditMemberModal } from './components/member/AdminEditMemberModal';
import { KtaPrintPdfModal } from './components/member/KtaPrintPdfModal';
import { QuickShareBadgeModal } from './components/member/QuickShareBadgeModal';
import { OperatorRoleModal } from './components/member/OperatorRoleModal';
import { CulinarySouvenirFormModal } from './components/culinary/CulinarySouvenirFormModal';
import { CulinarySouvenirDetailModal } from './components/culinary/CulinarySouvenirDetailModal';
import { CulinarySouvenirGallerySection } from './components/dashboard/CulinarySouvenirGallerySection';
import { DriveMediaRepositoryModal } from './components/common/DriveMediaRepositoryModal';

export default function App() {
  // Current logged in user
  const [currentUser, setCurrentUser] = useState<CurrentUser>(storage.getCurrentUser() || DEMO_USERS[0]);
  
  // Default to Landing Page as requested
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Reactive State from storage service
  const [members, setMembers] = useState<Member[]>([]);
  const [tours, setTours] = useState<TourPackage[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [culinaryItems, setCulinaryItems] = useState<CulinarySouvenirItem[]>([]);

  // Auth & Spreadsheet Modals State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register' | 'forgot'>('login');
  const [isSpreadsheetModalOpen, setIsSpreadsheetModalOpen] = useState(false);
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);

  // Other Modals State
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isTourFormModalOpen, setIsTourFormModalOpen] = useState(false);
  const [isEditKtaModalOpen, setIsEditKtaModalOpen] = useState(false);
  const [isCulinaryFormOpen, setIsCulinaryFormOpen] = useState(false);
  const [editingCulinaryItem, setEditingCulinaryItem] = useState<CulinarySouvenirItem | null>(null);
  const [selectedCulinaryDetail, setSelectedCulinaryDetail] = useState<CulinarySouvenirItem | null>(null);
  const [editingPhotoMember, setEditingPhotoMember] = useState<Member | null>(null);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [printingKtaMember, setPrintingKtaMember] = useState<Member | null>(null);
  const [quickSharingMember, setQuickSharingMember] = useState<Member | null>(null);
  const [managingOperatorMember, setManagingOperatorMember] = useState<Member | null>(null);
  const [verifyingMember, setVerifyingMember] = useState<Member | null>(null);
  const [transferringMember, setTransferringMember] = useState<Member | null>(null);
  const [selectedTourDetail, setSelectedTourDetail] = useState<TourPackage | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      setCurrentUser(storage.getCurrentUser());
    };

    syncState();
    return storage.subscribe(syncState);
  }, []);

  // Handle URL Query Params & Pathname for KTA Barcode/QR Code live lookup
  useEffect(() => {
    try {
      const pathname = window.location.pathname;
      let pathVerifyId = '';
      if (pathname.includes('/verify/')) {
        pathVerifyId = decodeURIComponent(pathname.split('/verify/')[1]?.split('?')[0] || '').trim();
      }

      const urlParams = new URLSearchParams(window.location.search);
      const verifyId = urlParams.get('verifyId') || urlParams.get('nta') || urlParams.get('id') || urlParams.get('kta') || pathVerifyId;
      const tabParam = urlParams.get('tab');

      if (tabParam === 'verify-portal') {
        setCurrentTab('verify-portal');
      }

      if (verifyId) {
        const cleanId = verifyId.trim().toLowerCase();
        const allMembers = storage.getMembers();
        const found = allMembers.find(m => 
          (m.nationalMemberNumber && m.nationalMemberNumber.toLowerCase() === cleanId) ||
          (m.verificationToken && m.verificationToken.toLowerCase() === cleanId) ||
          m.id.toLowerCase() === cleanId
        );
        if (found) {
          setVerifyingMember(found);
        }
      }
    } catch (e) {
      console.warn('URL param parsing error', e);
    }
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

  // Super Admin Delete Member Handlers
  const handleDeleteMember = (member: Member) => {
    if (currentUser.role !== 'SUPER_ADMIN') {
      alert('Hanya Super Admin Nasional yang memiliki wewenang menghapus data anggota.');
      return;
    }
    const success = storage.deleteMember(member.id, currentUser);
    if (success) {
      alert(`Data keanggotaan ${member.fullName} telah berhasil dihapus dari database.`);
    }
  };

  const handleDeleteAllDummyMembers = () => {
    if (currentUser.role !== 'SUPER_ADMIN') {
      alert('Hanya Super Admin Nasional yang memiliki wewenang membersihkan data dummy.');
      return;
    }
    const count = storage.deleteAllDummyMembers(currentUser);
    alert(`Berhasil menghapus ${count} data anggota dummy. Database anggota kini bersih.`);
  };

  // Open Auth Modal helper
  const handleOpenAuth = (type: 'login' | 'register' | 'forgot') => {
    setAuthModalTab(type);
    setIsAuthModalOpen(true);
  };

  const handleOpenSpreadsheet = () => {
    if (currentUser.role === 'SUPER_ADMIN') {
      setIsSpreadsheetModalOpen(true);
    }
  };

  const handleOpenDrive = () => {
    if (currentUser.role === 'SUPER_ADMIN') {
      setIsDriveModalOpen(true);
    }
  };

  // IF CURRENT TAB IS LANDING PAGE
  if (currentTab === 'landing') {
    return (
      <div className="min-h-screen bg-slate-900">
        <LandingPageView
          currentUser={currentUser}
          members={members}
          tours={tours}
          culinaryItems={culinaryItems}
          onOpenLoginModal={() => handleOpenAuth('login')}
          onOpenRegisterModal={() => handleOpenAuth('register')}
          onOpenVerifyModal={(m) => setVerifyingMember(m)}
          onViewTourDetail={(t) => setSelectedTourDetail(t)}
          onSelectCulinaryDetail={(item) => setSelectedCulinaryDetail(item)}
          onEnterDashboard={(tab) => setCurrentTab(tab || 'dashboard')}
        />

        {/* Global Modals for Landing View */}
        <AuthModal
          isOpen={isAuthModalOpen}
          initialTab={authModalTab}
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setIsAuthModalOpen(false);
            if (user.role === 'MEMBER') {
              setCurrentTab('my-card');
            } else {
              setCurrentTab('dashboard');
            }
          }}
        />

        <MemberVerificationModal
          member={verifyingMember}
          onClose={() => setVerifyingMember(null)}
        />

        <TourPackageDetailModal
          tour={selectedTourDetail}
          onClose={() => setSelectedTourDetail(null)}
        />

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
        onOpenRegisterModal={() => handleOpenAuth('register')}
        onOpenPublicPortal={() => setCurrentTab('verify-portal')}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        onOpenSpreadsheetModal={currentUser.role === 'SUPER_ADMIN' ? handleOpenSpreadsheet : undefined}
        onOpenDriveModal={currentUser.role === 'SUPER_ADMIN' ? handleOpenDrive : undefined}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header
          currentUser={currentUser}
          onSwitchUser={(user) => {
            setCurrentUser(user);
            storage.setCurrentUser(user);
            if (user.role === 'MEMBER') {
              setCurrentTab('my-card');
            }
          }}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenRegisterModal={() => handleOpenAuth('register')}
          onSelectTab={setCurrentTab}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          onOpenSpreadsheetModal={currentUser.role === 'SUPER_ADMIN' ? handleOpenSpreadsheet : undefined}
          onOpenDriveModal={currentUser.role === 'SUPER_ADMIN' ? handleOpenDrive : undefined}
          onOpenLoginModal={() => handleOpenAuth('login')}
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
                onOpenRegisterModal={() => handleOpenAuth('register')}
                onVerifyMember={(m) => setVerifyingMember(m)}
                onApproveMemberQuick={handleApproveMember}
                onViewTourDetail={(t) => setSelectedTourDetail(t)}
                onOpenEditCardModal={() => setIsEditKtaModalOpen(true)}
                onOpenCulinaryFormModal={(item) => {
                  setEditingCulinaryItem(item || null);
                  setIsCulinaryFormOpen(true);
                }}
                onSelectCulinaryDetail={(item) => setSelectedCulinaryDetail(item)}
                onOpenSpreadsheetModal={currentUser.role === 'SUPER_ADMIN' ? handleOpenSpreadsheet : undefined}
                onOpenDriveModal={currentUser.role === 'SUPER_ADMIN' ? handleOpenDrive : undefined}
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
                onOpenRegisterModal={() => handleOpenAuth('register')}
                onOpenVerifyModal={(m) => setVerifyingMember(m)}
                onOpenTransferModal={(m) => setTransferringMember(m)}
                onApproveMember={handleApproveMember}
                onRejectMember={handleRejectMember}
                onOpenEditCardModal={() => setIsEditKtaModalOpen(true)}
                onOpenEditPhotoModal={(m) => setEditingPhotoMember(m)}
                onOpenEditMemberModal={(m) => setEditingMember(m)}
                onOpenPrintPdfModal={(m) => setPrintingKtaMember(m)}
                onOpenQuickShareModal={(m) => setQuickSharingMember(m)}
                onOpenOperatorModal={(m) => setManagingOperatorMember(m)}
                onDeleteMember={handleDeleteMember}
                onDeleteAllDummyMembers={handleDeleteAllDummyMembers}
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
                onOpenRegisterModal={() => handleOpenAuth('register')}
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
                onOpenQuickShareModal={(m) => setQuickSharingMember(m)}
              />
            )}
          </div>
        </main>
      </div>

      {/* Global Modals */}
      {/* 1. Auth Modal (Login / Register / Forgot Password / View Password Toggle) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialTab={authModalTab}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setIsAuthModalOpen(false);
          if (user.role === 'MEMBER') {
            setCurrentTab('my-card');
          } else {
            setCurrentTab('dashboard');
          }
        }}
      />

      {/* 2. Google Spreadsheet Sync & Database Manager (SUPER ADMIN ONLY) */}
      {currentUser.role === 'SUPER_ADMIN' && (
        <SpreadsheetSyncModal
          isOpen={isSpreadsheetModalOpen}
          onClose={() => setIsSpreadsheetModalOpen(false)}
        />
      )}

      {/* 3. Register Member Modal */}
      <MemberFormModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSuccess={() => {
          setIsRegisterModalOpen(false);
          setCurrentTab('members');
        }}
      />

      {/* 4. Public Safe Verification Modal */}
      <MemberVerificationModal
        member={verifyingMember}
        onClose={() => setVerifyingMember(null)}
      />

      {/* 5. Member Transfer / Mutasi Modal */}
      <MemberTransferModal
        member={transferringMember}
        currentUser={currentUser}
        onClose={() => setTransferringMember(null)}
        onSuccess={() => setTransferringMember(null)}
      />

      {/* 6. Tour Package Creation Modal */}
      <TourPackageFormModal
        isOpen={isTourFormModalOpen}
        currentUser={currentUser}
        onClose={() => setIsTourFormModalOpen(false)}
        onSuccess={() => {
          setIsTourFormModalOpen(false);
          setCurrentTab('tours');
        }}
      />

      {/* 7. Tour Package Details & Itinerary Modal */}
      <TourPackageDetailModal
        tour={selectedTourDetail}
        onClose={() => setSelectedTourDetail(null)}
      />

      {/* 8. Admin KTA Card Customizer Modal */}
      <KtaCardCustomizerModal
        isOpen={isEditKtaModalOpen}
        currentUser={currentUser}
        onClose={() => setIsEditKtaModalOpen(false)}
      />

      {/* 9. Member Photo Correction & Profile Sync Modal */}
      <MemberPhotoEditModal
        isOpen={!!editingPhotoMember}
        member={editingPhotoMember}
        currentUser={currentUser}
        onClose={() => setEditingPhotoMember(null)}
        onSuccess={() => setEditingPhotoMember(null)}
      />

      {/* 10. Admin Manual Profile & Domicile Edit Modal */}
      <AdminEditMemberModal
        isOpen={!!editingMember}
        member={editingMember}
        currentUser={currentUser}
        onClose={() => setEditingMember(null)}
        onSuccess={() => setEditingMember(null)}
      />

      {/* 11. KTA Print & PDF Export Modal (ISO/IEC 7810 ID-1 CR80 & A4 Sheet) */}
      <KtaPrintPdfModal
        isOpen={!!printingKtaMember}
        member={printingKtaMember}
        onClose={() => setPrintingKtaMember(null)}
        onOpenEditCard={() => {
          setPrintingKtaMember(null);
          setIsEditKtaModalOpen(true);
        }}
      />

      {/* 12. Quick Share & Event Networking Badge Modal */}
      <QuickShareBadgeModal
        isOpen={!!quickSharingMember}
        member={quickSharingMember}
        onClose={() => setQuickSharingMember(null)}
        onOpenVerifyModal={(m) => {
          setQuickSharingMember(null);
          setVerifyingMember(m);
        }}
      />

      {/* 13. Operator Role Management Modal (Super Admin Only) */}
      <OperatorRoleModal
        isOpen={!!managingOperatorMember}
        member={managingOperatorMember}
        currentUser={currentUser}
        onClose={() => setManagingOperatorMember(null)}
        onSuccess={() => setManagingOperatorMember(null)}
      />

      {/* 13. Culinary & Souvenir Form Modal */}
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

      {/* 14. Culinary & Souvenir Detail Modal */}
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

      {/* 15. Google Drive Media Repository Modal (SUPER ADMIN ONLY) */}
      {currentUser.role === 'SUPER_ADMIN' && (
        <DriveMediaRepositoryModal
          isOpen={isDriveModalOpen}
          onClose={() => setIsDriveModalOpen(false)}
        />
      )}
    </div>
  );
}

