import React from 'react';

const ResourcesPage: React.FC = () => {
  const kenyaResources = [
    {
      category: 'Emergency Hotlines',
      items: [
        { name: 'Police Emergency', number: '999' },
        { name: 'Gender Violence Hotline', number: '1195' },
        { name: 'Child Protection', number: '116' }
      ]
    },
    {
      category: 'Legal Aid',
      items: [
        { name: 'FIDA Kenya', number: '+254 20 374 3764' },
        { name: 'Kituo Cha Sheria', number: '+254 20 229 562' }
      ]
    },
    {
      category: 'Shelters & Support',
      items: [
        { name: 'Haven Safe House', number: '+254 722 205 883' },
        { name: 'Gender Violence Recovery Centre', number: 'Kenyatta Hospital' }
      ]
    }
  ];

  const handleCall = (number: string) => {
    window.open(`tel:${number}`, '_self');
  };

  return (
    <div style={{ 
      padding: '20px',
      minHeight: '100vh',
      background: '#f8fafc'
    }}>
      <h2 style={{ color: '#1e293b', marginBottom: '10px' }}>🇰🇪 Kenya Resources</h2>
      <p style={{ color: '#64748b', marginBottom: '30px' }}>
        Important contacts and support services
      </p>

      {kenyaResources.map((category, categoryIndex) => (
        <div key={categoryIndex} style={{ marginBottom: '30px' }}>
          <h3 style={{ 
            color: '#334155',
            borderBottom: '2px solid #3b82f6',
            paddingBottom: '5px',
            marginBottom: '15px'
          }}>
            {category.category}
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {category.items.map((resource, resourceIndex) => (
              <div key={resourceIndex} style={{
                background: 'white',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <h4 style={{ 
                  color: '#1e40af',
                  margin: '0 0 8px 0'
                }}>
                  {resource.name}
                </h4>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{
                    color: '#059669',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}>
                    {resource.number}
                  </span>
                  
                  <button
                    onClick={() => handleCall(resource.number.replace(/\D/g, ''))}
                    style={{
                      padding: '10px 20px',
                      background: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    📞 Call
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResourcesPage;
