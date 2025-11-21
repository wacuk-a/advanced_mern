import React, { useState } from 'react';

interface Resource {
  id: string;
  name: string;
  type: 'emergency' | 'shelter' | 'medical' | 'legal' | 'support' | 'government';
  category: string;
  description: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  hours: string;
  services: string[];
  area: string;
  verified: boolean;
}

const ResourceDirectory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedArea, setSelectedArea] = useState('all');

  // Kenya-specific resources
  const kenyaResources: Resource[] = [
    // Emergency Services
    {
      id: '1',
      name: 'Kenya Police Emergency',
      type: 'emergency',
      category: 'Police',
      description: 'National police emergency response',
      phone: '999',
      email: '',
      website: 'https://www.kenyapolice.go.ke',
      address: 'Nationwide',
      hours: '24/7',
      services: ['Emergency Response', 'Crime Reporting', 'Public Safety'],
      area: 'Nationwide',
      verified: true
    },
    {
      id: '2',
      name: 'Ambulance Services',
      type: 'emergency',
      category: 'Medical',
      description: 'Emergency medical services and ambulance',
      phone: '999',
      email: '',
      website: '',
      address: 'Nationwide',
      hours: '24/7',
      services: ['Emergency Medical', 'Ambulance', 'First Aid'],
      area: 'Nationwide',
      verified: true
    },
    {
      id: '3',
      name: 'AAR Healthcare Emergency',
      type: 'medical',
      category: 'Medical',
      description: 'Private healthcare emergency services',
      phone: '119',
      email: 'emergency@aar.co.ke',
      website: 'https://www.aar-healthcare.com',
      address: 'Multiple locations nationwide',
      hours: '24/7',
      services: ['Emergency Medical', 'Ambulance', 'Insurance'],
      area: 'Nationwide',
      verified: true
    },

    // Shelters and Safe Houses
    {
      id: '4',
      name: 'Gender Violence Recovery Centre',
      type: 'shelter',
      category: 'Shelter',
      description: 'Safe shelter for gender-based violence survivors',
      phone: '+254 20 272 6300',
      email: 'gwrc@knh.or.ke',
      website: '',
      address: 'Kenyatta National Hospital, Nairobi',
      hours: '24/7',
      services: ['Shelter', 'Counseling', 'Medical Care', 'Legal Aid'],
      area: 'Nairobi',
      verified: true
    },
    {
      id: '5',
      name: 'Haven Safe House',
      type: 'shelter',
      category: 'Shelter',
      description: 'Temporary safe accommodation for vulnerable persons',
      phone: '+254 722 205 883',
      email: 'info@thehavenorganisation.org',
      website: 'http://www.thehavenorganisation.org',
      address: 'Nairobi',
      hours: '24/7',
      services: ['Emergency Shelter', 'Food', 'Counseling', 'Reintegration'],
      area: 'Nairobi',
      verified: true
    },

    // Legal Aid
    {
      id: '6',
      name: 'FIDA Kenya',
      type: 'legal',
      category: 'Legal',
      description: 'Federation of Women Lawyers - Legal aid for women',
      phone: '+254 20 374 3764',
      email: 'fidakenya@fidakenya.org',
      website: 'https://fidakenya.org',
      address: 'Lenana Road, Nairobi',
      hours: '8:00 AM - 5:00 PM',
      services: ['Legal Aid', 'Counseling', 'Court Representation', 'Advocacy'],
      area: 'Nairobi',
      verified: true
    },
    {
      id: '7',
      name: 'Kituo Cha Sheria',
      type: 'legal',
      category: 'Legal',
      description: 'Legal advice centre for marginalized communities',
      phone: '+254 20 210 0248',
      email: 'info@kituochasheria.or.ke',
      website: 'https://kituochasheria.or.ke',
      address: 'Mfangano Street, Nairobi',
      hours: '8:00 AM - 5:00 PM',
      services: ['Legal Advice', 'Paralegal Services', 'Education', 'Mediation'],
      area: 'Nairobi',
      verified: true
    },

    // Support Organizations
    {
      id: '8',
      name: 'Kenya Red Cross',
      type: 'support',
      category: 'Support',
      description: 'Humanitarian organization providing emergency support',
      phone: '1199',
      email: 'info@redcross.or.ke',
      website: 'https://www.redcross.or.ke',
      address: 'South C, Nairobi',
      hours: '24/7',
      services: ['Emergency Response', 'First Aid', 'Disaster Management', 'Support'],
      area: 'Nationwide',
      verified: true
    },
    {
      id: '9',
      name: 'Counselling & Development Foundation',
      type: 'support',
      category: 'Support',
      description: 'Professional counseling and psychological support',
      phone: '+254 722 515 295',
      email: 'info@cdf-kenya.org',
      website: 'http://www.cdf-kenya.org',
      address: 'Westlands, Nairobi',
      hours: '8:00 AM - 6:00 PM',
      services: ['Counseling', 'Therapy', 'Support Groups', 'Crisis Intervention'],
      area: 'Nairobi',
      verified: true
    },
    {
      id: '10',
      name: 'CRADLE - The Children Foundation',
      type: 'support',
      category: 'Support',
      description: 'Child rights and protection organization',
      phone: '+254 20 387 3037',
      email: 'info@thecradle.or.ke',
      website: 'https://thecradle.or.ke',
      address: 'Muthithi Road, Nairobi',
      hours: '8:00 AM - 5:00 PM',
      services: ['Child Protection', 'Legal Aid', 'Counseling', 'Education'],
      area: 'Nairobi',
      verified: true
    },

    // Government Services
    {
      id: '11',
      name: 'Department of Children Services',
      type: 'government',
      category: 'Government',
      description: 'Government agency for child protection and welfare',
      phone: '116',
      email: 'director@childrenservices.go.ke',
      website: 'http://www.childrenservices.go.ke',
      address: 'State Department for Social Protection',
      hours: '8:00 AM - 5:00 PM',
      services: ['Child Protection', 'Foster Care', 'Adoption', 'Welfare'],
      area: 'Nationwide',
      verified: true
    },
    {
      id: '12',
      name: 'Gender Violence Hotline',
      type: 'government',
      category: 'Government',
      description: 'Government gender-based violence response',
      phone: '1195',
      email: '',
      website: '',
      address: 'Nationwide',
      hours: '24/7',
      services: ['GBV Reporting', 'Counseling', 'Referral Services'],
      area: 'Nationwide',
      verified: true
    },

    // Medical Services
    {
      id: '13',
      name: 'Kenyatta National Hospital',
      type: 'medical',
      category: 'Medical',
      description: 'National referral hospital with emergency services',
      phone: '+254 20 272 6300',
      email: 'info@knh.or.ke',
      website: 'https://knh.or.ke',
      address: 'Hospital Road, Nairobi',
      hours: '24/7',
      services: ['Emergency Care', 'Specialized Treatment', 'Surgery', 'Trauma Care'],
      area: 'Nairobi',
      verified: true
    },
    {
      id: '14',
      name: 'Mombasa County Hospital',
      type: 'medical',
      category: 'Medical',
      description: 'Public hospital serving Mombasa and coastal region',
      phone: '+254 41 231 4201',
      email: '',
      website: '',
      address: 'Mombasa',
      hours: '24/7',
      services: ['Emergency Care', 'General Treatment', 'Maternal Health'],
      area: 'Mombasa',
      verified: true
    },
    {
      id: '15',
      name: 'Nakuru Provincial Hospital',
      type: 'medical',
      category: 'Medical',
      description: 'Major public hospital in Rift Valley region',
      phone: '+254 51 221 2061',
      email: '',
      website: '',
      address: 'Nakuru',
      hours: '24/7',
      services: ['Emergency Care', 'General Treatment', 'Specialized Care'],
      area: 'Nakuru',
      verified: true
    }
  ];

  const resourceTypes = [
    { value: 'all', label: 'All Resources', icon: '📚' },
    { value: 'emergency', label: 'Emergency Services', icon: '🚨' },
    { value: 'shelter', label: 'Safe Shelters', icon: '🏠' },
    { value: 'medical', label: 'Medical Services', icon: '🏥' },
    { value: 'legal', label: 'Legal Aid', icon: '⚖️' },
    { value: 'support', label: 'Support Organizations', icon: '🤝' },
    { value: 'government', label: 'Government Services', icon: '🏛️' }
  ];

  const areas = [
    'all',
    'Nationwide',
    'Nairobi',
    'Mombasa',
    'Kisumu',
    'Nakuru',
    'Eldoret',
    'Western Kenya',
    'Coastal Region',
    'Rift Valley'
  ];

  const getTypeIcon = (type: string) => {
    const foundType = resourceTypes.find(t => t.value === type);
    return foundType ? foundType.icon : '📋';
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'emergency': return '#ef4444';
      case 'shelter': return '#10b981';
      case 'medical': return '#3b82f6';
      case 'legal': return '#8b5cf6';
      case 'support': return '#f59e0b';
      case 'government': return '#6b7280';
      default: return '#9ca3af';
    }
  };

  const filteredResources = kenyaResources.filter(resource => {
    const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    const matchesArea = selectedArea === 'all' || resource.area === selectedArea;

    return matchesSearch && matchesType && matchesArea;
  });

  const callResource = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const openWebsite = (website: string) => {
    if (website) {
      window.open(website, '_blank');
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      background: 'white', 
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#333', margin: '0 0 10px 0' }}>📚 Kenya Resource Directory</h1>
        <p style={{ color: '#666', margin: 0 }}>Find emergency services, shelters, and support organizations across Kenya</p>
      </div>

      {/* Emergency Alert */}
      <div style={{
        padding: '15px',
        background: '#fef2f2',
        border: '2px solid #ef4444',
        borderRadius: '8px',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        <h3 style={{ color: '#dc2626', margin: '0 0 10px 0' }}>🚨 Immediate Emergency?</h3>
        <p style={{ color: '#991b1b', margin: '0 0 15px 0' }}>
          Call <strong>999</strong> for Police, Ambulance, or Fire emergencies
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => window.open('tel:999', '_self')}
            style={{
              padding: '10px 20px',
              background: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            🚔 Call 999 (Emergency)
          </button>
          <button
            onClick={() => window.open('tel:1195', '_self')}
            style={{
              padding: '10px 20px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            🛡️ Gender Violence (1195)
          </button>
          <button
            onClick={() => window.open('tel:116', '_self')}
            style={{
              padding: '10px 20px',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            👶 Child Protection (116)
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div style={{
        padding: '20px',
        background: '#f8fafc',
        border: '2px solid #e2e8f0',
        borderRadius: '10px',
        marginBottom: '30px'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
              🔍 Search Resources
            </label>
            <input
              type="text"
              placeholder="Search by name, service, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
              📂 Resource Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px'
              }}
            >
              {resourceTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
              📍 Area/Region
            </label>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px'
              }}
            >
              {areas.map(area => (
                <option key={area} value={area}>
                  {area === 'all' ? '🌍 All Areas' : `📍 ${area}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ color: '#6b7280', fontSize: '14px' }}>
            Found {filteredResources.length} resources
            {selectedType !== 'all' && ` in ${resourceTypes.find(t => t.value === selectedType)?.label}`}
            {selectedArea !== 'all' && ` for ${selectedArea}`}
          </div>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedType('all');
              setSelectedArea('all');
            }}
            style={{
              padding: '8px 16px',
              background: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            🔄 Clear Filters
          </button>
        </div>
      </div>

      {/* Resources Grid */}
      <div>
        <h3 style={{ color: '#333', marginBottom: '20px' }}>
          Available Resources in Kenya ({filteredResources.length})
        </h3>
        
        {filteredResources.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            <p>No resources found matching your criteria. Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
            {filteredResources.map(resource => (
              <div
                key={resource.id}
                style={{
                  padding: '20px',
                  border: '2px solid',
                  borderColor: getTypeColor(resource.type),
                  borderRadius: '10px',
                  background: '#f9fafb',
                  position: 'relative'
                }}
              >
                {resource.verified && (
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: '#10b981',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '10px',
                    fontWeight: 'bold'
                  }}>
                    ✅ Verified
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px', marginBottom: '15px' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: getTypeColor(resource.type),
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    fontWeight: 'bold'
                  }}>
                    {getTypeIcon(resource.type)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ color: '#1f2937', margin: '0 0 5px 0', fontSize: '18px' }}>
                      {resource.name}
                    </h4>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ 
                        padding: '4px 8px', 
                        background: getTypeColor(resource.type),
                        color: 'white',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 'bold'
                      }}>
                        {resource.category}
                      </span>
                      <span style={{ color: '#6b7280', fontSize: '12px' }}>
                        📍 {resource.area}
                      </span>
                    </div>
                  </div>
                </div>

                <p style={{ color: '#4b5563', margin: '0 0 15px 0', lineHeight: '1.5', fontSize: '14px' }}>
                  {resource.description}
                </p>

                <div style={{ marginBottom: '15px' }}>
                  <strong style={{ color: '#333', fontSize: '13px' }}>Services Offered:</strong>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px' }}>
                    {resource.services.map((service, index) => (
                      <span
                        key={index}
                        style={{
                          padding: '3px 8px',
                          background: '#e5e7eb',
                          color: '#4b5563',
                          borderRadius: '12px',
                          fontSize: '11px'
                        }}
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '15px', fontSize: '13px', color: '#6b7280' }}>
                  {resource.phone && (
                    <div style={{ marginBottom: '5px' }}>
                      <strong>📞 Phone:</strong> {resource.phone}
                    </div>
                  )}
                  {resource.email && (
                    <div style={{ marginBottom: '5px' }}>
                      <strong>📧 Email:</strong> {resource.email}
                    </div>
                  )}
                  {resource.address && (
                    <div style={{ marginBottom: '5px' }}>
                      <strong>📍 Address:</strong> {resource.address}
                    </div>
                  )}
                  {resource.hours && (
                    <div>
                      <strong>🕒 Hours:</strong> {resource.hours}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {resource.phone && (
                    <button
                      onClick={() => callResource(resource.phone)}
                      style={{
                        padding: '8px 16px',
                        background: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      📞 Call Now
                    </button>
                  )}
                  {resource.website && (
                    <button
                      onClick={() => openWebsite(resource.website)}
                      style={{
                        padding: '8px 16px',
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      🌐 Visit Website
                    </button>
                  )}
                  <button
                    onClick={() => alert(`Adding ${resource.name} to your safety plan...`)}
                    style={{
                      padding: '8px 16px',
                      background: '#8b5cf6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    💾 Save Resource
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Reference */}
      <div style={{ 
        marginTop: '30px',
        padding: '20px',
        background: '#fffbeb',
        borderRadius: '10px',
        border: '2px solid #fcd34d'
      }}>
        <h4 style={{ color: '#92400e', margin: '0 0 15px 0' }}>📋 Kenya Emergency Quick Reference</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', fontSize: '14px', color: '#92400e' }}>
          <div><strong>🚨 All Emergencies:</strong> 999</div>
          <div><strong>🛡️ Gender Violence:</strong> 1195</div>
          <div><strong>👶 Child Protection:</strong> 116</div>
          <div><strong>🏥 Medical Emergency:</strong> 999</div>
          <div><strong>🤝 Red Cross:</strong> 1199</div>
          <div><strong>🏥 AAR Insurance:</strong> 119</div>
        </div>
      </div>
    </div>
  );
};

export default ResourceDirectory;
