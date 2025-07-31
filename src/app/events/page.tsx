/**
 * Events page - Book club meetups and library events
 * Features: Book club meetups, author talks, workshops, and community events
 */

'use client';

import { MobileLayout } from '@/components/mobile-layout';

const mockEvents = [
  {
    id: 1,
    title: 'Mystery Book Club',
    type: 'book-club',
    date: '2024-08-15',
    time: '7:00 PM',
    location: 'Central Library - Reading Room',
    attendees: 23,
    maxAttendees: 30,
    book: 'The Silent Patient by Alex Michaelides',
    description:
      'Join us for a thrilling discussion of psychological thrillers. This month we\'re diving into "The Silent Patient" - a novel that will keep you guessing until the very end.',
    host: 'Sarah Chen',
    isFeatured: true,
    tags: ['Mystery', 'Thriller', 'Discussion'],
  },
  {
    id: 2,
    title: 'Sci-Fi & Fantasy Meetup',
    type: 'book-club',
    date: '2024-08-18',
    time: '6:30 PM',
    location: 'Westside Branch - Community Room',
    attendees: 18,
    maxAttendees: 25,
    book: 'Project Hail Mary by Andy Weir',
    description:
      'Explore the cosmos with fellow sci-fi enthusiasts! We\'ll discuss "Project Hail Mary" and share our favorite space exploration stories.',
    host: 'Marcus Rodriguez',
    isFeatured: false,
    tags: ['Sci-Fi', 'Space', 'Adventure'],
  },
  {
    id: 3,
    title: 'Author Talk: Local Writers',
    type: 'author-talk',
    date: '2024-08-20',
    time: '8:00 PM',
    location: 'Central Library - Auditorium',
    attendees: 45,
    maxAttendees: 100,
    book: 'Various Local Authors',
    description: 'Meet local authors and discover new voices in your community. Q&A session and book signing included.',
    host: 'Library Events Team',
    isFeatured: true,
    tags: ['Local Authors', 'Q&A', 'Book Signing'],
  },
  {
    id: 4,
    title: 'Young Adult Book Club',
    type: 'book-club',
    date: '2024-08-22',
    time: '4:00 PM',
    location: 'Northside Branch - Teen Space',
    attendees: 12,
    maxAttendees: 20,
    book: 'The Inheritance Games by Jennifer Lynn Barnes',
    description:
      'Perfect for teens and young adults! Join our monthly YA book club for lively discussions and new friendships.',
    host: 'Emma Thompson',
    isFeatured: false,
    tags: ['Young Adult', 'Teen', 'Friendship'],
  },
  {
    id: 5,
    title: 'Poetry Night',
    type: 'workshop',
    date: '2024-08-25',
    time: '7:30 PM',
    location: 'Downtown Branch - Poetry Corner',
    attendees: 15,
    maxAttendees: 30,
    book: 'Open Mic & Featured Poets',
    description: 'Share your poetry or just listen to beautiful words. All skill levels welcome!',
    host: 'Poetry Collective',
    isFeatured: false,
    tags: ['Poetry', 'Open Mic', 'Creative'],
  },
  {
    id: 6,
    title: 'Historical Fiction Club',
    type: 'book-club',
    date: '2024-08-28',
    time: '6:00 PM',
    location: 'Central Library - History Room',
    attendees: 28,
    maxAttendees: 35,
    book: 'The Paris Library by Janet Skeslien Charles',
    description:
      'Travel through time with our historical fiction book club. This month we explore WWII Paris through literature.',
    host: 'Dr. James Wilson',
    isFeatured: true,
    tags: ['Historical Fiction', 'WWII', 'Paris'],
  },
];

// Event Card Component
const EventCard = ({ event, isCompact = false }: { event: any; isCompact?: boolean }) => {
  const handleJoinEvent = (eventId: number) => {
    console.log('Joining event:', eventId);
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'book-club':
        return 'bg-primary-green';
      case 'author-talk':
        return 'bg-primary-purple';
      case 'workshop':
        return 'bg-primary-orange';
      default:
        return 'bg-primary-blue';
    }
  };

  const getEventTypeText = (type: string) => {
    switch (type) {
      case 'book-club':
        return 'BOOK CLUB';
      case 'author-talk':
        return 'AUTHOR TALK';
      case 'workshop':
        return 'WORKSHOP';
      default:
        return 'EVENT';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="outline-bold-thin rounded-2xl bg-white/80 p-6 backdrop-blur-sm transition-transform duration-300 hover:scale-105">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div
              className={`shadow-backdrop mb-3 inline-block rounded-full px-3 py-1 text-xs font-black text-white ${getEventTypeColor(event.type)}`}
            >
              {getEventTypeText(event.type)}
            </div>
            <h3 className="mb-2 text-lg font-black text-text-primary">{event.title}</h3>
            <p className="text-base font-bold text-text-primary">{event.description}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-base">
            <span className="font-bold text-text-primary">DATE</span>
            <span className="font-black text-text-primary">{formatDate(event.date)}</span>
          </div>

          <div className="flex justify-between text-base">
            <span className="font-bold text-text-primary">TIME</span>
            <span className="font-black text-text-primary">{event.time}</span>
          </div>

          {!isCompact && (
            <>
              <div className="flex justify-between text-base">
                <span className="font-bold text-text-primary">LOCATION</span>
                <span className="font-black text-text-primary">{event.location}</span>
              </div>

              <div className="flex justify-between text-base">
                <span className="font-bold text-text-primary">ATTENDEES</span>
                <span className="font-black text-text-primary">
                  {event.attendees}/{event.maxAttendees}
                </span>
              </div>

              <div className="flex justify-between text-base">
                <span className="font-bold text-text-primary">HOST</span>
                <span className="font-black text-text-primary">{event.host}</span>
              </div>
            </>
          )}

          {isCompact && (
            <div className="flex justify-between text-base">
              <span className="font-bold text-text-primary">ATTENDEES</span>
              <span className="font-black text-text-primary">
                {event.attendees}/{event.maxAttendees}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {event.tags.slice(0, isCompact ? 2 : undefined).map((tag: string, index: number) => (
            <span
              key={index}
              className="rounded-full bg-primary-yellow/20 px-3 py-1 text-xs font-bold text-text-primary"
            >
              {tag}
            </span>
          ))}
        </div>

        <button
          onClick={() => handleJoinEvent(event.id)}
          className="touch-feedback shadow-backdrop w-full rounded-2xl bg-primary-green px-6 py-3 text-lg font-black text-text-primary transition-transform hover:scale-105"
        >
          JOIN EVENT
        </button>
      </div>
    </div>
  );
};

// Featured Events Component
const FeaturedEvents = ({ events }: { events: any[] }) => {
  return (
    <div className="animate-fade-in-up animation-delay-200">
      <div className="pop-element-lg relative overflow-hidden rounded-3xl bg-primary-orange p-8 shadow-[0_10px_40px_rgb(0,0,0,0.3)] sm:p-12">
        <div className="relative z-10 space-y-6 sm:space-y-8">
          <div>
            <h2 className="mb-4 text-huge font-black leading-extra-tight text-text-primary sm:mb-6">
              <span className="text-primary-yellow">FEATURED</span>
              <br />
              <span className="text-mega">EVENTS</span>
            </h2>
            <p className="mb-6 text-lg font-bold text-text-primary sm:text-xl">
              Don&apos;t miss these highlighted events happening soon!
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
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

// All Events Component
const AllEvents = ({ events }: { events: any[] }) => {
  return (
    <div className="animate-fade-in-up animation-delay-400">
      <div className="pop-element-lg relative overflow-hidden rounded-3xl bg-primary-blue p-8 shadow-[0_10px_40px_rgb(0,0,0,0.3)] sm:p-12">
        <div className="relative z-10 space-y-6 sm:space-y-8">
          <div>
            <h2 className="mb-4 text-huge font-black leading-extra-tight text-text-primary sm:mb-6">
              <span className="text-primary-yellow">ALL</span>
              <br />
              <span className="text-mega">EVENTS</span>
            </h2>
            <p className="mb-6 text-lg font-bold text-text-primary sm:text-xl">
              Explore all upcoming events and find your perfect match!
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} isCompact={true} />
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

const EventsPage = () => {
  const featuredEvents = mockEvents.filter((event) => event.isFeatured);
  const regularEvents = mockEvents.filter((event) => !event.isFeatured);

  return (
    <MobileLayout>
      <div className="px-4 py-8 sm:px-8 sm:py-12">
        <div className="mx-auto max-w-7xl space-y-8 sm:space-y-12">
          {/* Hero Section - Clean and Focused */}
          <div className="animate-fade-in-up pop-element-lg relative overflow-hidden rounded-3xl bg-primary-purple p-8 shadow-[0_10px_40px_rgb(0,0,0,0.3)] sm:p-12">
            <div className="relative z-10">
              <h1 className="mb-4 text-huge font-black leading-extra-tight text-text-primary sm:mb-6">
                <span className="text-primary-yellow">LIBRARY</span>
                <br />
                <span className="text-mega">EVENTS</span>
              </h1>
              <p className="mb-6 text-lg font-bold leading-tight text-text-primary sm:mb-8 sm:text-xl">
                Join book clubs, meet authors, and connect
                <br />
                with fellow readers in your community!
              </p>

              {/* Primary Action */}
              <div className="outline-bold-thin rounded-2xl bg-white/80 p-6 backdrop-blur-sm">
                <div className="space-y-4 text-center">
                  <div className="text-4xl font-black text-text-primary">🎉</div>
                  <div className="text-lg font-black text-text-primary">Ready to join an event?</div>
                  <div className="text-base font-bold text-text-primary">
                    Browse featured events below or explore all upcoming activities
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

          {/* Featured Events */}
          <FeaturedEvents events={featuredEvents} />

          {/* All Events */}
          <AllEvents events={regularEvents} />
        </div>
      </div>
    </MobileLayout>
  );
};

export default EventsPage;
