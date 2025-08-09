/**
 * Community page - Discovery-focused social features and community engagement
 * Features: Discovery feed, local groups, discovery events, and community challenges
 */

'use client';

import { MobileLayout } from '@/components/mobile-layout';

const mockDiscoveryStories = [
  {
    id: 1,
    title: 'Hidden Gem Romance Finds',
    type: 'discovery-story',
    author: 'Sarah Chen',
    discoveries: 23,
    likes: 89,
    timeAgo: '2 hours ago',
    description:
      'Found three amazing indie romance novels at our local branch that nobody talks about! These hidden gems deserve way more attention.',
    tags: ['Romance', 'Indie', 'Hidden Gems'],
    location: 'Central Library',
    isFeatured: true,
  },
  {
    id: 2,
    title: 'Sci-Fi Deep Dive Challenge',
    type: 'discovery-group',
    author: 'Marcus Rodriguez',
    discoveries: 45,
    members: 18,
    timeAgo: '4 hours ago',
    description:
      'Our group is discovering the evolution of space opera from Foundation to modern works. Join us for weekly discovery sessions!',
    tags: ['Sci-Fi', 'Space Opera', 'Group Discovery'],
    location: 'Westside Branch',
    isFeatured: true,
  },
  {
    id: 3,
    title: 'Local Authors Discovery Map',
    type: 'discovery-event',
    author: 'Library Events Team',
    discoveries: 67,
    attendees: 34,
    timeAgo: '6 hours ago',
    description:
      'Community members are mapping local authors and their works. Discover writers in your neighborhood you never knew existed!',
    tags: ['Local Authors', 'Community Mapping', 'Discovery'],
    location: 'Multiple Branches',
    isFeatured: false,
  },
  {
    id: 4,
    title: 'YA Fantasy Discovery Club',
    type: 'discovery-group',
    author: 'Emma Thompson',
    discoveries: 31,
    members: 24,
    timeAgo: '8 hours ago',
    description:
      'Teen-led discovery group finding the next big YA fantasy series before they go viral. We have an amazing track record!',
    tags: ['YA Fantasy', 'Teen Discovery', 'Next Big Thing'],
    location: 'Northside Branch',
    isFeatured: false,
  },
  {
    id: 5,
    title: 'Poetry Discovery Challenge',
    type: 'discovery-challenge',
    author: 'Poetry Collective',
    discoveries: 28,
    participants: 56,
    timeAgo: '12 hours ago',
    description:
      'Challenge: Find one poem that changes your perspective this week. Share discoveries and discuss impact with the community.',
    tags: ['Poetry', 'Challenge', 'Perspective'],
    location: 'Downtown Branch',
    isFeatured: false,
  },
  {
    id: 6,
    title: 'Historical Fiction Time Travel',
    type: 'discovery-story',
    author: 'Dr. James Wilson',
    discoveries: 42,
    likes: 156,
    timeAgo: '1 day ago',
    description:
      'Discovered a fascinating connection between three historical fiction novels set in different eras but linked by theme and character development.',
    tags: ['Historical Fiction', 'Connections', 'Time Travel'],
    location: 'Central Library',
    isFeatured: true,
  },
];

const mockLocalGroups = [
  {
    id: 1,
    name: 'Downtown Discovery Circle',
    location: 'Downtown Area',
    members: 89,
    activeDiscoveries: 23,
    meetupFrequency: 'Weekly',
    specialty: 'Literary Fiction & Memoirs',
    description: 'Passionate readers discovering overlooked literary gems in the heart of downtown.',
  },
  {
    id: 2,
    name: 'Westside Genre Hunters',
    location: 'Westside Area',
    members: 67,
    activeDiscoveries: 34,
    meetupFrequency: 'Bi-weekly',
    specialty: 'Sci-Fi, Fantasy & Horror',
    description: 'Adventure-seeking readers hunting for the next great genre breakthrough.',
  },
  {
    id: 3,
    name: 'Family Discovery Network',
    location: 'Northside Area',
    members: 124,
    activeDiscoveries: 45,
    meetupFrequency: 'Monthly',
    specialty: 'Family Reading & Kids Books',
    description: 'Parents and kids discovering amazing family-friendly reads together.',
  },
];

const mockDiscoveryChallenges = [
  {
    id: 1,
    title: 'One Week, Five Genres',
    participants: 234,
    timeRemaining: '3 days',
    difficulty: 'Medium',
    description: 'Discover something new in five different genres this week.',
    reward: 'Discovery Explorer Badge',
  },
  {
    id: 2,
    title: 'Local Author Spotlight',
    participants: 156,
    timeRemaining: '12 days',
    difficulty: 'Easy',
    description: 'Find and share one local author from your area.',
    reward: 'Community Champion Badge',
  },
  {
    id: 3,
    title: 'Hidden Gem Hunt',
    participants: 89,
    timeRemaining: '5 days',
    difficulty: 'Hard',
    description: 'Discover a book with less than 100 reviews that deserves more attention.',
    reward: 'Gem Hunter Badge + Special Recognition',
  },
];

// Discovery Card Component
const DiscoveryCard = ({ discovery, isCompact = false }: { discovery: any; isCompact?: boolean }) => {
  const handleEngageDiscovery = (discoveryId: number) => {
    console.log('Engaging with discovery:', discoveryId);
  };

  const getDiscoveryTypeColor = (type: string) => {
    switch (type) {
      case 'discovery-story':
        return 'bg-primary-green';
      case 'discovery-group':
        return 'bg-primary-purple';
      case 'discovery-event':
        return 'bg-primary-orange';
      case 'discovery-challenge':
        return 'bg-primary-teal';
      default:
        return 'bg-primary-blue';
    }
  };

  const getDiscoveryTypeText = (type: string) => {
    switch (type) {
      case 'discovery-story':
        return 'DISCOVERY STORY';
      case 'discovery-group':
        return 'DISCOVERY GROUP';
      case 'discovery-event':
        return 'DISCOVERY EVENT';
      case 'discovery-challenge':
        return 'DISCOVERY CHALLENGE';
      default:
        return 'DISCOVERY';
    }
  };

  const getMetricLabel = (type: string) => {
    switch (type) {
      case 'discovery-story':
        return 'LIKES';
      case 'discovery-group':
        return 'MEMBERS';
      case 'discovery-event':
        return 'ATTENDEES';
      case 'discovery-challenge':
        return 'PARTICIPANTS';
      default:
        return 'ENGAGEMENT';
    }
  };

  const getMetricValue = (discovery: any) => {
    if (discovery.likes) return discovery.likes;
    if (discovery.members) return discovery.members;
    if (discovery.attendees) return discovery.attendees;
    if (discovery.participants) return discovery.participants;
    return discovery.discoveries || 0;
  };

  return (
    <div className="outline-bold-thin rounded-2xl bg-white/80 p-6 backdrop-blur-sm transition-transform duration-300 hover:scale-105">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div
              className={`shadow-backdrop mb-3 inline-block rounded-full px-3 py-1 text-xs font-black text-white ${getDiscoveryTypeColor(discovery.type)}`}
            >
              {getDiscoveryTypeText(discovery.type)}
            </div>
            <h3 className="mb-2 text-lg font-black text-text-primary">{discovery.title}</h3>
            <p className="text-base font-bold text-text-primary">{discovery.description}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-base">
            <span className="font-bold text-text-primary">DISCOVERED BY</span>
            <span className="font-black text-text-primary">{discovery.author}</span>
          </div>

          <div className="flex justify-between text-base">
            <span className="font-bold text-text-primary">DISCOVERIES</span>
            <span className="font-black text-text-primary">{discovery.discoveries}</span>
          </div>

          {!isCompact && (
            <>
              <div className="flex justify-between text-base">
                <span className="font-bold text-text-primary">LOCATION</span>
                <span className="font-black text-text-primary">{discovery.location}</span>
              </div>

              <div className="flex justify-between text-base">
                <span className="font-bold text-text-primary">{getMetricLabel(discovery.type)}</span>
                <span className="font-black text-text-primary">{getMetricValue(discovery)}</span>
              </div>

              <div className="flex justify-between text-base">
                <span className="font-bold text-text-primary">SHARED</span>
                <span className="font-black text-text-primary">{discovery.timeAgo}</span>
              </div>
            </>
          )}

          {isCompact && (
            <div className="flex justify-between text-base">
              <span className="font-bold text-text-primary">{getMetricLabel(discovery.type)}</span>
              <span className="font-black text-text-primary">{getMetricValue(discovery)}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {discovery.tags.slice(0, isCompact ? 2 : undefined).map((tag: string, index: number) => (
            <span
              key={index}
              className="rounded-full bg-primary-yellow/20 px-3 py-1 text-xs font-bold text-text-primary"
            >
              {tag}
            </span>
          ))}
        </div>

        <button
          onClick={() => handleEngageDiscovery(discovery.id)}
          className="touch-feedback shadow-backdrop w-full rounded-2xl bg-primary-green px-6 py-3 text-lg font-black text-text-primary transition-transform hover:scale-105"
        >
          JOIN DISCOVERY
        </button>
      </div>
    </div>
  );
};

// Local Group Card Component
const LocalGroupCard = ({ group }: { group: any }) => {
  const handleJoinGroup = (groupId: number) => {
    console.log('Joining group:', groupId);
  };

  return (
    <div className="outline-bold-thin rounded-2xl bg-white/80 p-6 backdrop-blur-sm transition-transform duration-300 hover:scale-105">
      <div className="space-y-4">
        <div>
          <h3 className="mb-2 text-lg font-black text-text-primary">{group.name}</h3>
          <p className="text-base font-bold text-text-primary">{group.description}</p>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-base">
            <span className="font-bold text-text-primary">LOCATION</span>
            <span className="font-black text-text-primary">{group.location}</span>
          </div>

          <div className="flex justify-between text-base">
            <span className="font-bold text-text-primary">MEMBERS</span>
            <span className="font-black text-text-primary">{group.members}</span>
          </div>

          <div className="flex justify-between text-base">
            <span className="font-bold text-text-primary">ACTIVE DISCOVERIES</span>
            <span className="font-black text-text-primary">{group.activeDiscoveries}</span>
          </div>

          <div className="flex justify-between text-base">
            <span className="font-bold text-text-primary">MEETUPS</span>
            <span className="font-black text-text-primary">{group.meetupFrequency}</span>
          </div>
        </div>

        <div className="rounded-full bg-primary-orange/20 px-3 py-2 text-center">
          <span className="text-sm font-bold text-text-primary">{group.specialty}</span>
        </div>

        <button
          onClick={() => handleJoinGroup(group.id)}
          className="touch-feedback shadow-backdrop w-full rounded-2xl bg-primary-purple px-6 py-3 text-lg font-black text-text-primary transition-transform hover:scale-105"
        >
          JOIN GROUP
        </button>
      </div>
    </div>
  );
};

// Discovery Challenge Card Component
const DiscoveryChallengeCard = ({ challenge }: { challenge: any }) => {
  const handleJoinChallenge = (challengeId: number) => {
    console.log('Joining challenge:', challengeId);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-primary-green';
      case 'Medium':
        return 'bg-primary-orange';
      case 'Hard':
        return 'bg-primary-pink';
      default:
        return 'bg-primary-blue';
    }
  };

  return (
    <div className="outline-bold-thin rounded-2xl bg-white/80 p-6 backdrop-blur-sm transition-transform duration-300 hover:scale-105">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div
              className={`shadow-backdrop mb-3 inline-block rounded-full px-3 py-1 text-xs font-black text-white ${getDifficultyColor(challenge.difficulty)}`}
            >
              {challenge.difficulty.toUpperCase()}
            </div>
            <h3 className="mb-2 text-lg font-black text-text-primary">{challenge.title}</h3>
            <p className="text-base font-bold text-text-primary">{challenge.description}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-base">
            <span className="font-bold text-text-primary">PARTICIPANTS</span>
            <span className="font-black text-text-primary">{challenge.participants}</span>
          </div>

          <div className="flex justify-between text-base">
            <span className="font-bold text-text-primary">TIME REMAINING</span>
            <span className="font-black text-text-primary">{challenge.timeRemaining}</span>
          </div>

          <div className="flex justify-between text-base">
            <span className="font-bold text-text-primary">REWARD</span>
            <span className="font-black text-text-primary">{challenge.reward}</span>
          </div>
        </div>

        <button
          onClick={() => handleJoinChallenge(challenge.id)}
          className="touch-feedback shadow-backdrop w-full rounded-2xl bg-primary-teal px-6 py-3 text-lg font-black text-text-primary transition-transform hover:scale-105"
        >
          JOIN CHALLENGE
        </button>
      </div>
    </div>
  );
};

// Featured Discoveries Component
const FeaturedDiscoveries = ({ discoveries }: { discoveries: any[] }) => {
  return (
    <div className="animate-fade-in-up animation-delay-200">
      <div className="pop-element-lg relative overflow-hidden rounded-3xl bg-primary-orange p-8 shadow-[0_10px_40px_rgb(0,0,0,0.3)] sm:p-12">
        <div className="relative z-10 space-y-6 sm:space-y-8">
          <div>
            <h2 className="mb-4 text-huge font-black leading-extra-tight text-text-primary sm:mb-6">
              <span className="text-primary-yellow">FEATURED</span>
              <br />
              <span className="text-mega">DISCOVERIES</span>
            </h2>
            <p className="mb-6 text-lg font-bold text-text-primary sm:text-xl">
              Amazing finds and discoveries from our community members!
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {discoveries.map((discovery) => (
              <DiscoveryCard key={discovery.id} discovery={discovery} />
            ))}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="animate-float absolute left-6 top-6 z-0 h-16 w-16 rounded-full bg-primary-yellow opacity-30 shadow-[0_4px_15px_rgb(0,0,0,0.2)] sm:h-20 sm:w-20" />
        <div className="animate-float-delayed absolute right-12 top-2 z-0 h-12 w-12 rounded-full bg-primary-pink opacity-25 shadow-[0_4px_15px_rgb(0,0,0,0.2)] sm:h-16 sm:w-16" />
        <div className="animate-float-slow absolute bottom-6 right-6 z-0 h-8 w-8 rounded-full bg-primary-teal opacity-40 shadow-[0_4px_15px_rgb(0,0,0,0.2)] sm:h-12 sm:w-12" />
        <div className="animate-float absolute bottom-12 left-4 z-0 h-10 w-10 rounded-full bg-primary-orange opacity-35 shadow-[0_4px_15px_rgb(0,0,0,0.2)] sm:h-14 sm:w-14" />
        <div className="animate-float-delayed absolute right-4 top-12 z-0 h-6 w-6 rounded-full bg-primary-purple opacity-45 shadow-[0_4px_15px_rgb(0,0,0,0.2)] sm:h-8 sm:w-8" />
      </div>
    </div>
  );
};

// Local Discovery Groups Component
const LocalDiscoveryGroups = ({ groups }: { groups: any[] }) => {
  return (
    <div className="animate-fade-in-up animation-delay-300">
      <div className="pop-element-lg relative overflow-hidden rounded-3xl bg-primary-green p-8 shadow-[0_10px_40px_rgb(0,0,0,0.3)] sm:p-12">
        <div className="relative z-10 space-y-6 sm:space-y-8">
          <div>
            <h2 className="mb-4 text-huge font-black leading-extra-tight text-text-primary sm:mb-6">
              <span className="text-primary-yellow">LOCAL</span>
              <br />
              <span className="text-mega">DISCOVERY GROUPS</span>
            </h2>
            <p className="mb-6 text-lg font-bold text-text-primary sm:text-xl">
              Connect with discovery groups in your area and find reading buddies nearby!
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => (
              <LocalGroupCard key={group.id} group={group} />
            ))}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="animate-float absolute left-6 top-6 z-0 h-16 w-16 rounded-full bg-primary-yellow opacity-30 shadow-[0_4px_15px_rgb(0,0,0,0.2)] sm:h-20 sm:w-20" />
        <div className="animate-float-delayed absolute right-12 top-2 z-0 h-12 w-12 rounded-full bg-primary-pink opacity-25 shadow-[0_4px_15px_rgb(0,0,0,0.2)] sm:h-16 sm:w-16" />
        <div className="animate-float-slow absolute bottom-6 right-6 z-0 h-8 w-8 rounded-full bg-primary-teal opacity-40 shadow-[0_4px_15px_rgb(0,0,0,0.2)] sm:h-12 sm:w-12" />
        <div className="animate-float absolute bottom-12 left-4 z-0 h-10 w-10 rounded-full bg-primary-orange opacity-35 shadow-[0_4px_15px_rgb(0,0,0,0.2)] sm:h-14 sm:w-14" />
        <div className="animate-float-delayed absolute right-4 top-12 z-0 h-6 w-6 rounded-full bg-primary-purple opacity-45 shadow-[0_4px_15px_rgb(0,0,0,0.2)] sm:h-8 sm:w-8" />
      </div>
    </div>
  );
};

// Discovery Challenges Component
const DiscoveryChallenges = ({ challenges }: { challenges: any[] }) => {
  return (
    <div className="animate-fade-in-up animation-delay-400">
      <div className="pop-element-lg relative overflow-hidden rounded-3xl bg-primary-pink p-8 shadow-[0_10px_40px_rgb(0,0,0,0.3)] sm:p-12">
        <div className="relative z-10 space-y-6 sm:space-y-8">
          <div>
            <h2 className="mb-4 text-huge font-black leading-extra-tight text-text-primary sm:mb-6">
              <span className="text-primary-yellow">DISCOVERY</span>
              <br />
              <span className="text-mega">CHALLENGES</span>
            </h2>
            <p className="mb-6 text-lg font-bold text-text-primary sm:text-xl">
              Take on discovery challenges and earn badges while exploring new reads!
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {challenges.map((challenge) => (
              <DiscoveryChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="animate-float absolute left-6 top-6 z-0 h-16 w-16 rounded-full bg-primary-yellow opacity-30 shadow-[0_4px_15px_rgb(0,0,0,0.2)] sm:h-20 sm:w-20" />
        <div className="animate-float-delayed absolute right-12 top-2 z-0 h-12 w-12 rounded-full bg-primary-pink opacity-25 shadow-[0_4px_15px_rgb(0,0,0,0.2)] sm:h-16 sm:w-16" />
        <div className="animate-float-slow absolute bottom-6 right-6 z-0 h-8 w-8 rounded-full bg-primary-teal opacity-40 shadow-[0_4px_15px_rgb(0,0,0,0.2)] sm:h-12 sm:w-12" />
        <div className="animate-float absolute bottom-12 left-4 z-0 h-10 w-10 rounded-full bg-primary-green opacity-35 shadow-[0_4px_15px_rgb(0,0,0,0.2)] sm:h-14 sm:w-14" />
        <div className="animate-float-delayed absolute right-4 top-12 z-0 h-6 w-6 rounded-full bg-primary-purple opacity-45 shadow-[0_4px_15px_rgb(0,0,0,0.2)] sm:h-8 sm:w-8" />
      </div>
    </div>
  );
};

// Discovery Feed Component
const DiscoveryFeed = ({ discoveries }: { discoveries: any[] }) => {
  return (
    <div className="animate-fade-in-up animation-delay-500">
      <div className="pop-element-lg relative overflow-hidden rounded-3xl bg-primary-blue p-8 shadow-[0_10px_40px_rgb(0,0,0,0.3)] sm:p-12">
        <div className="relative z-10 space-y-6 sm:space-y-8">
          <div>
            <h2 className="mb-4 text-huge font-black leading-extra-tight text-text-primary sm:mb-6">
              <span className="text-primary-yellow">DISCOVERY</span>
              <br />
              <span className="text-mega">FEED</span>
            </h2>
            <p className="mb-6 text-lg font-bold text-text-primary sm:text-xl">
              See what the community is discovering right now!
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {discoveries.map((discovery) => (
              <DiscoveryCard key={discovery.id} discovery={discovery} isCompact={true} />
            ))}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="animate-float absolute left-6 top-6 z-0 h-16 w-16 rounded-full bg-primary-yellow opacity-30 shadow-[0_4px_15px_rgb(0,0,0,0.2)] sm:h-20 sm:w-20" />
        <div className="animate-float-delayed absolute right-12 top-2 z-0 h-12 w-12 rounded-full bg-primary-pink opacity-25 shadow-[0_4px_15px_rgb(0,0,0,0.2)] sm:h-16 sm:w-16" />
        <div className="animate-float-slow absolute bottom-6 right-6 z-0 h-8 w-8 rounded-full bg-primary-teal opacity-40 shadow-[0_4px_15px_rgb(0,0,0,0.2)] sm:h-12 sm:w-12" />
        <div className="animate-float absolute bottom-12 left-4 z-0 h-10 w-10 rounded-full bg-primary-green opacity-35 shadow-[0_4px_15px_rgb(0,0,0,0.2)] sm:h-14 sm:w-14" />
        <div className="animate-float-delayed absolute right-4 top-12 z-0 h-6 w-6 rounded-full bg-primary-purple opacity-45 shadow-[0_4px_15px_rgb(0,0,0,0.2)] sm:h-8 sm:w-8" />
      </div>
    </div>
  );
};

const CommunityPage = () => {
  const featuredDiscoveries = mockDiscoveryStories.filter((discovery) => discovery.isFeatured);
  const allDiscoveries = mockDiscoveryStories.filter((discovery) => !discovery.isFeatured);

  return (
    <MobileLayout>
      <div className="px-4 py-8 sm:px-8 sm:py-12">
        <div className="mx-auto max-w-7xl space-y-8 sm:space-y-12">
          {/* Hero Section - Clean and Focused */}
          <div className="animate-fade-in-up pop-element-lg relative overflow-hidden rounded-3xl bg-primary-purple p-8 shadow-[0_10px_40px_rgb(0,0,0,0.3)] sm:p-12">
            <div className="relative z-10">
              <h1 className="mb-4 text-huge font-black leading-extra-tight text-text-primary sm:mb-6">
                <span className="text-primary-yellow">DISCOVERY</span>
                <br />
                <span className="text-mega">COMMUNITY</span>
              </h1>
              <p className="mb-6 text-lg font-bold leading-tight text-text-primary sm:mb-8 sm:text-xl">
                Join fellow book lovers discovering amazing reads,
                <br />
                sharing hidden gems, and building reading connections!
              </p>

              {/* Primary Action */}
              <div className="outline-bold-thin rounded-2xl bg-white/80 p-6 backdrop-blur-sm">
                <div className="space-y-4 text-center">
                  <div className="text-4xl font-black text-text-primary">🔍</div>
                  <div className="text-lg font-black text-text-primary">Ready to discover together?</div>
                  <div className="text-base font-bold text-text-primary">
                    Share discoveries, join local groups, and take on reading challenges
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="animate-float absolute left-6 top-6 z-0 h-16 w-16 rounded-full bg-primary-yellow opacity-30 shadow-[0_4px_15px_rgb(0,0,0,0.2)] sm:h-20 sm:w-20" />
            <div className="animate-float-delayed absolute right-12 top-2 z-0 h-12 w-12 rounded-full bg-primary-pink opacity-25 shadow-[0_4px_15px_rgb(0,0,0,0.2)] sm:h-16 sm:w-16" />
            <div className="animate-float-slow absolute bottom-6 right-6 z-0 h-8 w-8 rounded-full bg-primary-teal opacity-40 shadow-[0_4px_15px_rgb(0,0,0,0.2)] sm:h-12 sm:w-12" />
            <div className="animate-float absolute bottom-12 left-4 z-0 h-10 w-10 rounded-full bg-primary-green opacity-35 shadow-[0_4px_15px_rgb(0,0,0,0.2)] sm:h-14 sm:w-14" />
            <div className="animate-float-delayed absolute right-4 top-12 z-0 h-6 w-6 rounded-full bg-primary-orange opacity-45 shadow-[0_4px_15px_rgb(0,0,0,0.2)] sm:h-8 sm:w-8" />
          </div>

          {/* Featured Discoveries */}
          <FeaturedDiscoveries discoveries={featuredDiscoveries} />

          {/* Local Discovery Groups */}
          <LocalDiscoveryGroups groups={mockLocalGroups} />

          {/* Discovery Challenges */}
          <DiscoveryChallenges challenges={mockDiscoveryChallenges} />

          {/* Discovery Feed */}
          <DiscoveryFeed discoveries={allDiscoveries} />
        </div>
      </div>
    </MobileLayout>
  );
};

export default CommunityPage;
