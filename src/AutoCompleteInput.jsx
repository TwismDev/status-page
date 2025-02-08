import React, { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash.debounce';
import './App.css';

function AutoCompleteInput() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState([]);

  const fetchOrganizations = useCallback(
    async (searchQuery) => {
      setIsLoading(true);
      try {
        const url = 'https://scrbd.co-stream.live/api/orgs';
        const response = await fetch(url, {
          method: 'POST',
          body: JSON.stringify({ query: searchQuery }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setSuggestions(Object.values(data));
      } catch (error) {
        console.error('Error fetching organizations:', error);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Debounce our fetch so we don't spam the server
  const debouncedFetch = useCallback(
    debounce((searchQuery) => fetchOrganizations(searchQuery), 300),
    [fetchOrganizations]
  );

  useEffect(() => {
    if (query.length > 2) {
      debouncedFetch(query);
    } else {
      setSuggestions([]);
    }
  }, [query, debouncedFetch]);

  const filteredSuggestions = suggestions.filter((org) =>
    org.orgname.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelectOrg = (org) => {
    setQuery(org.orgname);
    setSelectedOrg(org.id);
    setSuggestions([]);
  };

  return (
    <div style={containerStyle}>
      {/* Use a .form-group wrapper so our existing styles apply */}
      <div className="form-group">
        <input
          id="orgInput"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {isLoading && <p style={loadingTextStyle}>Loading...</p>}

      {filteredSuggestions.length > 0 && (
        <div style={suggestionListStyle}>
          {filteredSuggestions.map((item) => (
            <div
              key={item.id}
              style={suggestionItemStyle}
              onClick={() => handleSelectOrg(item)}
            >
              <p style={suggestionTextStyle}>{item.orgname}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// We can keep or reduce these inline styles for the container & suggestions
const containerStyle = {
  position: 'relative',
//   width: '300px',
  margin: '0 auto',
  // any other styling you need
};

const loadingTextStyle = {
  textAlign: 'center',
  fontSize: '16px',
  margin: '10px 0',
};

const suggestionListStyle = {
  position: 'absolute',
  top: 'calc(100% + 4px)',
  width: '100%',
  maxHeight: '200px',
  overflowY: 'auto',
  borderRadius: '4px',
  border: '1px solid #ddd',
  backgroundColor: '#fff',
  zIndex: 999,
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const suggestionItemStyle = {
  padding: '10px',
  borderBottom: '1px solid #ddd',
  cursor: 'pointer',
  // backgroundColor: '#fff',
};

const suggestionTextStyle = {
  margin: 0,
  fontSize: '15px',
};

export default AutoCompleteInput;
