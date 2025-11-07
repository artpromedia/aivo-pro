import React, { useState } from 'react';
import { 
  CreditCard, 
  Users, 
  School,
  TrendingUp,
  Plus,
  Minus,
  Download
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

const mockLicenseData = {
  total: 2500,
  inUse: 2175,
  allocated: 2375,
  available: 125,
  schools: [
    { id: '1', name: 'Lincoln Elementary', address: '123 Main St', allocated: 450, inUse: 425 },
    { id: '2', name: 'Washington Middle', address: '456 Oak Ave', allocated: 600, inUse: 580 },
    { id: '3', name: 'Roosevelt High', address: '789 Elm St', allocated: 900, inUse: 892 },
  ],
  history: [
    { type: 'purchase', description: 'Purchased 500 new licenses', date: '2024-11-01' },
    { type: 'allocation', description: 'Allocated 100 licenses to Lincoln Elementary', date: '2024-10-28' },
  ],
};

export const LicenseManagement: React.FC = () => {
  const [allocationChanges, setAllocationChanges] = useState<Record<string, number>>({});

  const { data: licenseData } = useQuery({
    queryKey: ['district-licenses'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockLicenseData;
    },
  });

  const handleAllocationChange = (schoolId: string, delta: number) => {
    const current = allocationChanges[schoolId] || 0;
    const school = licenseData?.schools?.find((s: any) => s.id === schoolId);
    
    if (!school) return;
    
    const newValue = school.allocated + current + delta;
    
    if (newValue >= school.inUse && newValue <= school.allocated + (licenseData?.available || 0)) {
      setAllocationChanges(prev => ({
        ...prev,
        [schoolId]: current + delta
      }));
    }
  };

  const saveAllocations = () => {
    void alert('License allocations saved!');
    setAllocationChanges({});
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">License Management</h1>
              <p className="text-gray-600">Manage and allocate district licenses</p>
            </div>
            <Link
              to="/licenses/purchase"
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" />
              Purchase More Licenses
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* License Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <p className="text-sm text-gray-600">Total Licenses</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{licenseData?.total || 0}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-green-600" />
              <p className="text-sm text-gray-600">In Use</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{licenseData?.inUse || 0}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <School className="w-5 h-5 text-purple-600" />
              <p className="text-sm text-gray-600">Allocated</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{licenseData?.allocated || 0}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <p className="text-sm text-gray-600">Available</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{licenseData?.available || 0}</p>
          </div>
        </div>

        {/* License Allocation Table */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">School Allocations</h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">School</th>
                  <th className="text-center py-3 px-4">Allocated</th>
                  <th className="text-center py-3 px-4">In Use</th>
                  <th className="text-center py-3 px-4">Available</th>
                  <th className="text-center py-3 px-4">Utilization</th>
                  <th className="text-center py-3 px-4">Adjust</th>
                </tr>
              </thead>
              <tbody>
                {licenseData?.schools?.map((school: any) => {
                  const change = allocationChanges[school.id] || 0;
                  const newAllocation = school.allocated + change;
                  const newAvailable = newAllocation - school.inUse;
                  
                  return (
                    <tr key={school.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{school.name}</p>
                          <p className="text-sm text-gray-500">{school.address}</p>
                        </div>
                      </td>
                      <td className="text-center py-3 px-4">
                        <span className={change !== 0 ? 'text-primary-600 font-bold' : ''}>
                          {newAllocation}
                        </span>
                        {change !== 0 && (
                          <span className={`text-sm ml-2 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ({change > 0 ? '+' : ''}{change})
                          </span>
                        )}
                      </td>
                      <td className="text-center py-3 px-4">{school.inUse}</td>
                      <td className="text-center py-3 px-4">
                        <span className={newAvailable < 5 ? 'text-red-600 font-bold' : ''}>
                          {newAvailable}
                        </span>
                      </td>
                      <td className="text-center py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-sm">{Math.round((school.inUse / newAllocation) * 100)}%</span>
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                (school.inUse / newAllocation) > 0.9 ? 'bg-red-500' :
                                (school.inUse / newAllocation) > 0.7 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${Math.min(100, (school.inUse / newAllocation) * 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="text-center py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleAllocationChange(school.id, -10)}
                            disabled={newAllocation <= school.inUse}
                            className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleAllocationChange(school.id, 10)}
                            disabled={(licenseData?.available || 0) <= 0}
                            className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {Object.keys(allocationChanges).length > 0 && (
            <div className="mt-6 flex justify-between items-center p-4 bg-primary-50 rounded-xl">
              <p className="text-sm text-gray-700">
                You have unsaved allocation changes
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setAllocationChanges({})}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveAllocations}
                  className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
