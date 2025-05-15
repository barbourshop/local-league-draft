import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';
import { generateClient } from 'aws-amplify/api';
import { listPlayers, listPlayerEvaluations, listTeams, listCoaches } from './graphql/queries';
import { updatePlayer } from './graphql/mutations';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useParams
} from 'react-router-dom';
import PlayerForm from './PlayerForm';
import TeamsPage from './TeamsPage';
import AssignPlayersPage from './AssignPlayersPage';
import CoachesPage from './CoachesPage';
import TeamDetailsPage from './TeamDetailsPage';

Amplify.configure(awsExports);

const client = generateClient();

const columns = [
  { key: 'name', label: 'Player' },
  { key: 'schoolGrade', label: 'School Grade' },
  { key: 'overallRank', label: 'Overall Rank' },
  { key: 'offenseRank', label: 'Offense Rank' },
  { key: 'defenseRank', label: 'Defense Rank' },
  { key: 'firstTimePlayer', label: 'First Time Player' },
  { key: 'clubPlayer', label: 'Club Player' },
  { key: 'teamName', label: 'Team' },
];

function PlayerTable({ players, loading, error, filters, setFilters, notFilters, setNotFilters, sortConfig, setSortConfig, onUpdate }) {
  const [refresh, setRefresh] = useState(0);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleNotChange = (key, checked) => {
    setNotFilters((prev) => ({ ...prev, [key]: checked }));
  };

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        // Toggle direction
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      } else {
        return { key, direction: 'asc' };
      }
    });
  };

  const filteredPlayers = players.filter(p =>
    columns.every(col => {
      const filterValue = filters[col.key];
      const not = notFilters[col.key];
      if (!filterValue) return true;
      let cellValue = p[col.key];
      if (typeof cellValue === 'boolean') {
        cellValue = cellValue ? 'Yes' : 'No';
      }
      const match = String(cellValue || '').toLowerCase().includes(filterValue.toLowerCase());
      return not ? !match : match;
    })
  );

  const sortedPlayers = React.useMemo(() => {
    if (!sortConfig.key) return filteredPlayers;
    const sorted = [...filteredPlayers];
    sorted.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      // For booleans, sort Yes > No
      if (typeof aValue === 'boolean' || typeof bValue === 'boolean') {
        aValue = aValue ? 1 : 0;
        bValue = bValue ? 1 : 0;
      }
      // For numbers, sort numerically
      if (!isNaN(Number(aValue)) && !isNaN(Number(bValue))) {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else {
        // Otherwise, sort as strings
        aValue = String(aValue || '').toLowerCase();
        bValue = String(bValue || '').toLowerCase();
      }
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredPlayers, sortConfig]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container">
      <h1>Player Evaluation Results</h1>
      <table>
        <thead>
          <tr className="filter-row">
            {columns.map(col => (
              <th key={col.key}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <input
                    type="text"
                    placeholder={`Filter ${col.label}`}
                    value={filters[col.key] || ''}
                    onChange={e => handleFilterChange(col.key, e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <label title="NOT" style={{ display: 'flex', alignItems: 'center', fontSize: '0.9em', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={!!notFilters[col.key]}
                      onChange={e => handleNotChange(col.key, e.target.checked)}
                      style={{ marginLeft: 2, marginRight: 2 }}
                    />
                    ≠
                  </label>
                </div>
              </th>
            ))}
          </tr>
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                style={{ cursor: 'pointer', userSelect: 'none' }}
                onClick={() => handleSort(col.key)}
              >
                {col.label}
                {sortConfig.key === col.key && (
                  <span style={{ marginLeft: 4 }}>
                    {sortConfig.direction === 'asc' ? '▲' : '▼'}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedPlayers.map(p => (
            <tr key={p.id}>
              {columns.map(col => (
                <td key={col.key}>
                  {col.key === 'name' ? (
                    <Link to={`/edit/${p.id}`}>{p.name || p.id}</Link>
                  ) : col.key === 'teamName' ? (
                    p.teamName
                  ) : (
                    typeof p[col.key] === 'boolean' ? (p[col.key] ? 'Yes' : 'No') : p[col.key]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 32, textAlign: 'right' }}>
        <Link to="/new" style={{ fontWeight: 600, fontSize: '1.1em', textDecoration: 'underline' }}>
          + Create New Player Evaluation
        </Link>
      </div>
    </div>
  );
}

function App() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [notFilters, setNotFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [playerRes, evalRes, teamRes, coachRes] = await Promise.all([
          client.graphql({ query: listPlayers }),
          client.graphql({ query: listPlayerEvaluations }),
          client.graphql({ query: listTeams }),
          client.graphql({ query: listCoaches }),
        ]);
        const players = playerRes.data.listPlayers.items;
        const evaluations = evalRes.data.listPlayerEvaluations.items;
        const teams = teamRes.data.listTeams.items;
        const coaches = coachRes.data.listCoaches.items;
        // Join data
        const joined = players.map(player => {
          const evaluation = evaluations.find(e => e.playerId === player.id) || {};
          const team = teams.find(t => t.id === player.teamID);
          // Find coach by player.coachId, or by teamID
          let coach = null;
          if (player.coachId) {
            coach = coaches.find(c => c.id === player.coachId);
          } else if (player.teamID) {
            coach = coaches.find(c => c.teamID === player.teamID);
          }
          return {
            ...player,
            ...evaluation,
            teamName: team ? team.name : '',
            coachName: coach ? coach.name : '',
          };
        });
        setPlayers(joined);
      } catch (err) {
        setError(err.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [refresh]);

  const handleRefresh = () => setRefresh(r => r + 1);

  return (
    <Router>
      <div style={{ padding: 16, borderBottom: '1px solid #eee', marginBottom: 24 }}>
        <Link to="/" style={{ marginRight: 16 }}>Players</Link>
        <Link to="/teams" style={{ marginRight: 16 }}>Teams</Link>
        <Link to="/coaches" style={{ marginRight: 16 }}>Coaches</Link>
        <Link to="/assign-players">Assign Players</Link>
      </div>
      <Routes>
        <Route
          path="/"
          element={
            <PlayerTable
              players={players}
              loading={loading}
              error={error}
              filters={filters}
              setFilters={setFilters}
              notFilters={notFilters}
              setNotFilters={setNotFilters}
              sortConfig={sortConfig}
              setSortConfig={setSortConfig}
              onUpdate={handleRefresh}
            />
          }
        />
        <Route path="/teams" element={<TeamsPage />} />
        <Route path="/coaches" element={<CoachesPage />} />
        <Route path="/assign-players" element={<AssignPlayersPage />} />
        <Route path="/new" element={<PlayerForm mode="new" onSave={handleRefresh} />} />
        <Route path="/edit/:id" element={<PlayerForm mode="edit" onSave={handleRefresh} />} />
        <Route path="/teams/:id" element={<TeamDetailsPage />} />
      </Routes>
    </Router>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />); 