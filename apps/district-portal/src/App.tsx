import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Schools } from './pages/Schools';
import { SchoolDetail } from './pages/Schools/SchoolDetail';
import { Students } from './pages/Students';
import { StudentDetail } from './pages/Students/StudentDetail';
import { StudentAIModel } from './pages/Students/StudentAIModel';
import { IEPs } from './pages/IEPs';
import { IEPDetail } from './pages/IEPs/IEPDetail';
import { CreateIEP } from './pages/IEPs/CreateIEP.tsx';
import { Integrations } from './pages/Integrations';
import { LicenseManagement } from './pages/Licenses';
import { PurchaseLicense } from './pages/Licenses/PurchaseLicense';
import { ManageSeats } from './pages/Licenses/ManageSeats';
import { Analytics } from './pages/Analytics';
import { UsageReport } from './pages/Analytics/UsageReport';
import { PerformanceReport } from './pages/Analytics/PerformanceReport';
import { ComplianceReport } from './pages/Analytics/ComplianceReport';
import { Billing } from './pages/Billing';
import { InvoiceHistory } from './pages/Billing/InvoiceHistory';
import { Teachers } from './pages/Teachers';
import { TeacherDetail } from './pages/Teachers/TeacherDetail';
import { Settings } from './pages/Settings';
import { DistrictLayout } from './layouts/DistrictLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DistrictLayout />}>
          <Route index element={<Dashboard />} />
          
          {/* Schools */}
          <Route path="schools" element={<Schools />} />
          <Route path="schools/:schoolId" element={<SchoolDetail />} />
          
          {/* Students */}
          <Route path="students" element={<Students />} />
          <Route path="students/:studentId" element={<StudentDetail />} />
          <Route path="students/:studentId/ai-model" element={<StudentAIModel />} />
          
          {/* IEPs */}
          <Route path="ieps" element={<IEPs />} />
          <Route path="ieps/create" element={<CreateIEP />} />
          <Route path="ieps/:iepId" element={<IEPDetail />} />
          <Route path="ieps/:iepId/edit" element={<CreateIEP />} />
          
          {/* Integrations */}
          <Route path="integrations" element={<Integrations />} />
          
          {/* Teachers */}
          <Route path="teachers" element={<Teachers />} />
          <Route path="teachers/:teacherId" element={<TeacherDetail />} />
          
          {/* Licenses */}
          <Route path="licenses" element={<LicenseManagement />} />
          <Route path="licenses/purchase" element={<PurchaseLicense />} />
          <Route path="licenses/manage-seats" element={<ManageSeats />} />
          
          {/* Analytics */}
          <Route path="analytics" element={<Analytics />} />
          <Route path="analytics/usage" element={<UsageReport />} />
          <Route path="analytics/performance" element={<PerformanceReport />} />
          <Route path="analytics/compliance" element={<ComplianceReport />} />
          
          {/* Billing */}
          <Route path="billing" element={<Billing />} />
          <Route path="billing/invoices" element={<InvoiceHistory />} />
          
          {/* Settings */}
          <Route path="settings" element={<Settings />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
