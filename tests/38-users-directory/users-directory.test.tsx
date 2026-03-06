/**
 * users-directory.test.tsx -- Step 38: Users Directory
 *
 * Tests the UsersPage component which combines:
 * - Debounced search input
 * - Parallel data fetching (users + friendships)
 * - Friend action buttons mapped from friendship status
 *
 * Concepts practiced:
 * - Mocking multiple API modules with vi.mock
 * - Fake timers + userEvent for debounce testing
 * - Verifying conditional rendering based on derived state
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

// ---------- Mock the API modules BEFORE importing the component ----------

// We mock the entire module so fetchUserDirectory and fetchFriendships
// return controlled data without hitting a real server.

const mockFetchUserDirectory = vi.fn();
const mockFetchFriendships = vi.fn();
const mockSendFriendRequest = vi.fn();
const mockDeleteFriendship = vi.fn();

vi.mock('../api/users', () => ({
  fetchUserDirectory: (...args: unknown[]) => mockFetchUserDirectory(...args),
}));

vi.mock('../api/friendships', () => ({
  fetchFriendships: (...args: unknown[]) => mockFetchFriendships(...args),
  sendFriendRequest: (...args: unknown[]) => mockSendFriendRequest(...args),
  deleteFriendship: (...args: unknown[]) => mockDeleteFriendship(...args),
}));

// Mock the auth context -- pretend user id=1 is logged in
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: 1,
      username: 'jvc',
      email: 'jvc@icstars.org',
      handle: 'jvc',
      displayName: 'Jonathan',
      bio: null,
      avatarUrl: null,
    },
    token: 'fake-token-123',
    loading: false,
    setAuth: vi.fn(),
    logout: vi.fn(),
  }),
}));

// Mock Header and Footer so tests focus on UsersPage logic
vi.mock('../components/Header', () => ({
  default: () => <header data-testid="header">Header</header>,
}));
vi.mock('../components/Footer', () => ({
  default: () => <footer data-testid="footer">Footer</footer>,
}));

// NOW import the component under test
import UsersPage from '../components/UsersPage';

// Sample data -- two users plus the logged-in user
const sampleUsers = [
  {
    id: 2,
    username: 'intern_alex',
    handle: 'intern-alex',
    displayName: 'Alex Torres',
    bio: 'Learning to code!',
    avatarUrl: null,
    createdAt: '2026-01-06T10:00:00.000Z',
    entryCount: 3,
  },
  {
    id: 1,
    username: 'jvc',
    handle: 'jvc',
    displayName: 'Jonathan',
    bio: 'Tech Fellow',
    avatarUrl: null,
    createdAt: '2026-01-01T00:00:00.000Z',
    entryCount: 10,
  },
  {
    id: 3,
    username: 'intern_maya',
    handle: 'intern-maya',
    displayName: 'Maya Johnson',
    bio: null,
    avatarUrl: null,
    createdAt: '2026-01-06T10:00:00.000Z',
    entryCount: 1,
  },
];

// Helper to render the component inside a router (Link needs one)
function renderUsersPage() {
  return render(
    <MemoryRouter>
      <UsersPage />
    </MemoryRouter>,
  );
}

// ---------- Tests ----------

describe('UsersPage', () => {
  beforeEach(() => {
    // Reset all mocks before each test so state does not leak
    vi.clearAllMocks();

    // Default: return all users and no friendships
    mockFetchUserDirectory.mockResolvedValue(sampleUsers);
    mockFetchFriendships.mockResolvedValue([]);
  });

  it('renders user cards after loading', async () => {
    // ARRANGE + ACT -- render triggers the useEffect fetch
    renderUsersPage();

    // The loading indicator appears first
    expect(screen.getByText(/loading users/i)).toBeInTheDocument();

    // ASSERT -- wait for the cards to appear
    await waitFor(() => {
      expect(screen.getByText('Alex Torres')).toBeInTheDocument();
      expect(screen.getByText('Jonathan')).toBeInTheDocument();
      expect(screen.getByText('Maya Johnson')).toBeInTheDocument();
    });

    // Count badge should say "3 users found"
    expect(screen.getByText(/3 users found/i)).toBeInTheDocument();
  });

  it('shows "You" badge on the logged-in user card', async () => {
    renderUsersPage();

    await waitFor(() => {
      expect(screen.getByText('Jonathan')).toBeInTheDocument();
    });

    // The badge "You" should appear once (for user id=1)
    expect(screen.getByText('You')).toBeInTheDocument();
  });

  it('shows "Add Friend" for users with no friendship', async () => {
    renderUsersPage();

    await waitFor(() => {
      expect(screen.getByText('Alex Torres')).toBeInTheDocument();
    });

    // Alex and Maya should each have an "Add Friend" button
    const addButtons = screen.getAllByRole('button', { name: /add friend/i });
    expect(addButtons).toHaveLength(2); // Alex + Maya, not jvc (self)
  });

  it('shows "Pending -- Cancel" when friendship is PENDING', async () => {
    // Simulate a pending friendship between user 1 and user 2
    mockFetchFriendships.mockResolvedValue([
      {
        id: 99,
        userAId: 1,  // pair-normalized: min(1,2) = 1
        userBId: 2,
        status: 'PENDING',
        createdAt: '2026-03-09T00:00:00.000Z',
        updatedAt: '2026-03-09T00:00:00.000Z',
      },
    ]);

    renderUsersPage();

    await waitFor(() => {
      expect(screen.getByText(/pending -- cancel/i)).toBeInTheDocument();
    });

    // Maya (id=3) should still show "Add Friend"
    expect(screen.getByRole('button', { name: /add friend/i })).toBeInTheDocument();
  });

  it('shows "Friends -- Unfriend" when friendship is ACCEPTED', async () => {
    mockFetchFriendships.mockResolvedValue([
      {
        id: 99,
        userAId: 1,
        userBId: 3,
        status: 'ACCEPTED',
        createdAt: '2026-03-09T00:00:00.000Z',
        updatedAt: '2026-03-09T00:00:00.000Z',
      },
    ]);

    renderUsersPage();

    await waitFor(() => {
      expect(screen.getByText(/friends -- unfriend/i)).toBeInTheDocument();
    });
  });

  it('calls sendFriendRequest when "Add Friend" is clicked', async () => {
    mockSendFriendRequest.mockResolvedValue({
      id: 100, userAId: 1, userBId: 2, status: 'PENDING',
      createdAt: '2026-03-09T00:00:00.000Z',
      updatedAt: '2026-03-09T00:00:00.000Z',
    });

    renderUsersPage();
    const user = userEvent.setup();

    await waitFor(() => {
      expect(screen.getByText('Alex Torres')).toBeInTheDocument();
    });

    // Click the first "Add Friend" button (Alex)
    const addButtons = screen.getAllByRole('button', { name: /add friend/i });
    await user.click(addButtons[0]);

    // Verify the API was called with the correct userId
    expect(mockSendFriendRequest).toHaveBeenCalledWith('fake-token-123', 2);
  });

  it('calls deleteFriendship when "Pending -- Cancel" is clicked', async () => {
    mockFetchFriendships.mockResolvedValue([
      {
        id: 77,
        userAId: 1,
        userBId: 2,
        status: 'PENDING',
        createdAt: '2026-03-09T00:00:00.000Z',
        updatedAt: '2026-03-09T00:00:00.000Z',
      },
    ]);
    mockDeleteFriendship.mockResolvedValue(undefined);

    renderUsersPage();
    const user = userEvent.setup();

    await waitFor(() => {
      expect(screen.getByText(/pending -- cancel/i)).toBeInTheDocument();
    });

    await user.click(screen.getByText(/pending -- cancel/i));

    expect(mockDeleteFriendship).toHaveBeenCalledWith('fake-token-123', 77);
  });

  it('displays "No users match your search." when search returns empty', async () => {
    // After initial load, simulate search returning empty
    mockFetchUserDirectory
      .mockResolvedValueOnce(sampleUsers)  // initial load
      .mockResolvedValueOnce([]);           // after search

    renderUsersPage();

    await waitFor(() => {
      expect(screen.getByText('Alex Torres')).toBeInTheDocument();
    });

    const user = userEvent.setup();
    const searchInput = screen.getByRole('searchbox');

    // Type a search that returns no results
    await user.type(searchInput, 'zzzzz');

    // Wait for debounce + re-render
    await waitFor(() => {
      expect(screen.getByText(/no users match your search/i)).toBeInTheDocument();
    });
  });

  it('shows error message when fetch fails', async () => {
    mockFetchUserDirectory.mockRejectedValue(new Error('Network error'));

    renderUsersPage();

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Network error');
    });
  });

  it('links each user name to their profile page', async () => {
    renderUsersPage();

    await waitFor(() => {
      expect(screen.getByText('Alex Torres')).toBeInTheDocument();
    });

    // Alex's name should link to /u/intern-alex
    const alexLink = screen.getByRole('link', { name: 'Alex Torres' });
    expect(alexLink).toHaveAttribute('href', '/u/intern-alex');
  });
});
